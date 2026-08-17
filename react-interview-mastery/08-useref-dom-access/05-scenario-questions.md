# Scenario Questions: useRef & DOM Access

### Scenario 1: A "click count" badge doesn't update even though you can see the number is changing in devtools

You're building a button that shows how many times it's been clicked. You wired it up with `useRef` for the counter (to avoid "unnecessary re-renders," as a teammate suggested), but the number displayed never changes even though logging `ref.current` in the click handler shows it incrementing correctly.

**Approach:** This is a direct consequence of `useRef` mutations not scheduling re-renders. If the counter needs to be displayed, it needs to live in `useState`, full stop — there's no such thing as "avoiding re-renders" for a value that's supposed to visibly update; a re-render is exactly what needs to happen.

```jsx
// Broken: ref mutation never triggers a re-render, UI stays stale
function ClickCounter() {
  const clicks = useRef(0);
  return (
    <button onClick={() => { clicks.current += 1; }}>
      Clicked {clicks.current} times
    </button>
  );
}

// Fixed: use state for anything that needs to appear on screen
function ClickCounter() {
  const [clicks, setClicks] = useState(0);
  return (
    <button onClick={() => setClicks((c) => c + 1)}>
      Clicked {clicks} times
    </button>
  );
}
```

`useRef` is the right tool only for values the component needs to remember internally without that change being reflected in the rendered output by itself (e.g., "have I already logged this event," a debounce timer ID) — not for anything the user is meant to see update.

---

### Scenario 2: A chat app's auto-scroll-to-bottom feature scrolls too early, before new messages are painted

You're building a chat window that should auto-scroll to the latest message whenever a new one arrives. Currently it calls `scrollIntoView` directly in the message-add handler, and it intermittently scrolls to the *second-to-last* message instead of the newest one.

**Approach:** The DOM hasn't been updated with the new message's node yet at the moment the handler runs (state updates are async and the DOM commit happens afterward). Use a ref on the "bottom marker" and trigger the scroll from a `useEffect` that depends on the messages array, which runs after React has committed the new DOM:

```jsx
function ChatWindow({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // runs after messages (and the DOM) update

  return (
    <div className="chat-window">
      {messages.map((m) => (
        <Message key={m.id} message={m} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
```

Scrolling from `useEffect` guarantees the DOM has already been updated with the newly rendered message before the scroll calculation happens, fixing the off-by-one scroll target.

---

### Scenario 3: A third-party charting library needs a raw DOM element to mount into, wrapped in a reusable component

You're integrating an imperative charting library (not React-aware) that exposes `new Chart(domElement, config)` and `chart.destroy()`. You need a `<ChartWidget data={...} />` component that other teams can drop in anywhere, without knowing about the underlying library's imperative API.

**Approach:** Use a ref to get the mount point, instantiate the chart in a `useEffect`, and clean it up on unmount or when `data` changes:

```jsx
function ChartWidget({ data }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    chartRef.current = new Chart(containerRef.current, { data });
    return () => chartRef.current.destroy();
  }, [data]); // recreate the chart whenever data changes

  return <div ref={containerRef} className="chart-container" />;
}
```

This isolates the imperative, non-React library entirely inside `ChartWidget` — consumers just pass `data` as a prop and never touch the underlying instance. If frequent `data` updates make full chart recreation too expensive, switch to calling `chart.update(data)` on an existing instance instead of destroying/recreating, still driven from the same effect.

---

### Scenario 4: A reusable `<TextField>` component needs to let parent forms call `.focus()` on validation errors, without exposing the whole DOM node

You're building a design-system `<TextField>` component (which internally renders a `<label>`, an `<input>`, and an error message). A form using several `TextField`s needs to programmatically focus the first field that fails validation on submit — but the design system team doesn't want consumers reaching into the internal DOM structure (e.g., mutating styles directly on the input from outside).

**Approach:** Use `forwardRef` + `useImperativeHandle` to expose only a `focus()` method, hiding the internal markup entirely:

```jsx
const TextField = forwardRef(function TextField({ label, error, ...inputProps }, ref) {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
  }));

  return (
    <div className="text-field">
      <label>{label}</label>
      <input ref={inputRef} {...inputProps} />
      {error && <span className="error">{error}</span>}
    </div>
  );
});

function SignupForm() {
  const fieldRefs = useRef({});
  const handleSubmit = (errors) => {
    const firstErrorField = Object.keys(errors)[0];
    fieldRefs.current[firstErrorField]?.focus();
  };
  return (
    <TextField ref={(el) => (fieldRefs.current.email = el)} label="Email" />
  );
}
```

This keeps `TextField`'s internal DOM structure fully private — the form can only call `.focus()`, nothing else — while still solving the real imperative need (focus management) that plain props/state can't express well.
