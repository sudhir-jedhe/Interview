# Output-Based Questions: useRef & DOM Access

### Question 1

```jsx
function Counter() {
  const countRef = useRef(0);
  const [, forceRender] = useState(0);

  const handleClick = () => {
    countRef.current += 1;
    console.log(countRef.current);
  };

  return (
    <div>
      <p>Displayed: {countRef.current}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}
```

The user clicks the button 3 times. What does the console show, and what does "Displayed:" show on screen after each click?

**Answer:** The console logs `1`, `2`, `3` correctly. "Displayed:" stays at `0` on screen the entire time, never updating.

**Why:** Mutating `countRef.current` updates the value immediately (so `console.log` reads the fresh value), but it does not schedule a re-render. Since nothing else re-renders this component, the JSX showing `countRef.current` was only evaluated once, at the initial render, and never re-evaluated — it's frozen at `0` visually even though the underlying ref value is changing.

---

### Question 2

```jsx
function Input() {
  const ref = useRef(null);
  console.log('render, ref.current =', ref.current);
  return <input ref={ref} />;
}
```

What does the console log on the very first render — is `ref.current` the `<input>` DOM node or `null`?

**Answer:** `null`.

**Why:** During the render phase, React hasn't committed the JSX to the actual DOM yet, so refs to DOM elements haven't been attached. React sets `ref.current` to the real node only after the commit phase, right before effects run. If you `console.log` at the top of the function body (during render), you'll always see the ref's value from *before* this render's DOM was attached — `null` on the first render.

---

### Question 3

```jsx
function usePrevious(value) {
  const ref = useRef();
  ref.current = value; // set directly during render, no useEffect
  return ref.current;
}

function Display({ value }) {
  const previous = usePrevious(value);
  return <p>current: {value}, previous: {previous}</p>;
}
```

`Display` is rendered with `value=1`, then re-rendered with `value=2`. What does "previous:" show on the second render?

**Answer:** `2`, not `1` — the bug is that `previous` always equals `current`.

**Why:** Setting `ref.current = value` directly in the render body updates it *before* the return statement reads `ref.current`, so you're immediately overwriting the old value with the new one in the same render pass. The correct `usePrevious` pattern updates the ref inside a `useEffect` (which runs *after* render/commit), so during the current render, `ref.current` still holds the value from the previous render — only after that render commits does the effect update it for next time.

---

### Question 4

```jsx
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // note: uses `count`, not the updater form
    }, 1000);
    return () => clearInterval(id);
  }, []); // empty deps

  return <p>{count}</p>;
}
```

What number does the display get stuck at?

**Answer:** It increments once, to `1`, then stays at `1` forever.

**Why:** The effect runs once (empty deps), capturing `count = 0` in its closure at that time. `setInterval`'s callback keeps calling `setCount(0 + 1)` every second — always computing `1` from the same stale `count = 0`, because the closure was never recreated (the effect never re-ran to capture a fresh `count`). This is the classic stale-closure bug and is directly relevant to `useRef`: storing the latest `count` in a ref (updated every render) and reading `ref.current` inside the interval callback is the standard fix, or using the functional updater `setCount(c => c + 1)`.

---

### Question 5

```jsx
function ParentA() {
  const ref = useRef(null);
  return <MyComponent ref={ref} />;
}

function MyComponent(props) {
  return <div>Hi</div>;
}
```

What warning (if any) appears in the console, and what is `ref.current` after mount?

**Answer:** React warns that function components cannot be given refs, and `ref.current` stays `null`.

**Why:** `MyComponent` is a plain function component, not wrapped in `forwardRef`. React special-cases the `ref` prop — it's never passed through to `props`, and without `forwardRef` there's no mechanism for the component to attach it to anything internally. React logs a warning suggesting `forwardRef` if you're trying to pass a ref to a function component.

---

### Question 6

```jsx
const Fancy = forwardRef(function Fancy(props, ref) {
  const innerRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus: () => innerRef.current.focus(),
  }));
  return <input ref={innerRef} />;
});

function App() {
  const ref = useRef(null);
  useEffect(() => {
    console.log(ref.current);
  }, []);
  return <Fancy ref={ref} />;
}
```

What does `console.log(ref.current)` print — the DOM `<input>` element, or something else?

**Answer:** It prints an object `{ focus: [Function] }` — not the raw `<input>` DOM node.

**Why:** `useImperativeHandle` overrides what the forwarded ref exposes to the parent. Instead of `ref.current` being the actual DOM node (which is what plain `ref={innerRef}` forwarding would give), it's the object returned by the `useImperativeHandle` factory function — here, just a `focus` method. The parent has no direct access to the underlying `<input>` unless it's explicitly exposed.

---

### Question 7

```jsx
function List({ items }) {
  const itemRefs = useRef([]);
  itemRefs.current = []; // reset every render

  return (
    <ul>
      {items.map((item, i) => (
        <li
          key={item.id}
          ref={(el) => (itemRefs.current[i] = el)}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
}
```

Why does `itemRefs.current = []` need to run on every render, and what would break if it were inside a `useEffect` with an empty dependency array instead?

**Answer:** It needs to run every render because the list of DOM nodes can change (items added/removed), and resetting the array during render (before the callback refs run) ensures stale entries from removed items don't linger. If it were in a `useEffect([])`, it would only reset once on mount — after that, removed items would leave stale `null`/dangling entries mixed in with valid ones as the array's length and indices drift out of sync with `items`.

**Why:** Callback refs like `ref={(el) => ...}` run during the commit phase for every element that mounts, updates its ref, or unmounts (called with `null` on unmount/ref change). Resetting the array right before that at the top of the render body (not in an effect) keeps `itemRefs.current` in sync with the current `items` array on every pass.
