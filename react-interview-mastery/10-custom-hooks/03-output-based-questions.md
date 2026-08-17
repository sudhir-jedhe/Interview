# Output-Based Questions: Custom Hooks

### Question 1

```jsx
function useCounter() {
  const [count, setCount] = useState(0);
  return [count, () => setCount((c) => c + 1)];
}

function App() {
  const [countA, incrementA] = useCounter();
  const [countB, incrementB] = useCounter();

  return (
    <div>
      <button onClick={incrementA}>A: {countA}</button>
      <button onClick={incrementB}>B: {countB}</button>
    </div>
  );
}
```

The user clicks "A" three times. What does "B:" show?

**Answer:** `B: 0` — unchanged.

**Why:** Each call to `useCounter()` creates its own independent `useState` slot. Custom hooks share *logic* (the code that defines how state updates), not *state itself* — the two calls in `App` are two completely separate instances of `count`, with no connection to each other. Clicking A's button only ever touches A's own `count`.

---

### Question 2

```jsx
function useFeatureFlag(name, enabled) {
  if (enabled) {
    const [isOn] = useState(true);
    return isOn;
  }
  return false;
}

function Feature({ enabled }) {
  const isOn = useFeatureFlag('newUI', enabled);
  return <p>{isOn ? 'on' : 'off'}</p>;
}
```

`Feature` first renders with `enabled={true}`, then re-renders with `enabled={false}`. What happens?

**Answer:** React throws an error like "Rendered fewer hooks than expected" (or logs a warning about hooks order changing), and the app likely crashes or falls into an inconsistent state for this component.

**Why:** The `useState` call inside `useFeatureFlag` is conditional on `enabled`. On the first render, `useState` is called (1 hook slot used); on the second render, `enabled` is `false`, so the `if` block is skipped and `useState` is never called (0 hook slots used). React expects the exact same number and order of hook calls between renders for a given component instance — violating that corrupts its internal bookkeeping and throws.

---

### Question 3

```jsx
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function Search() {
  const [text, setText] = useState('');
  const debouncedText = useDebounce(text, 500);
  console.log('render, debouncedText =', debouncedText);
  return <input value={text} onChange={(e) => setText(e.target.value)} />;
}
```

The user types "hi" quickly (two keystrokes within 500ms of each other). How many times does "render" log with a *changed* `debouncedText` value (ignoring the initial render)?

**Answer:** Once — not twice. The intermediate value `"h"` is skipped; only the final `"hi"` eventually shows up as `debouncedText`.

**Why:** Each keystroke updates `text`, which re-runs the effect (since `value`/`text` changed), which clears the *previous* pending `setTimeout` (via the cleanup function) and schedules a new one. Since the second keystroke arrives before the first 500ms timer fires, the first timer is cancelled before ever calling `setDebounced("h")`. Only the timer scheduled after the last keystroke ("hi") survives long enough to fire, setting `debouncedText` to `"hi"` directly — the intermediate state is never rendered.

---

### Question 4

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : initialValue;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

function ComponentA() {
  const [theme] = useLocalStorage('theme', 'light');
  return <p>A sees: {theme}</p>;
}

function ComponentB() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  return <button onClick={() => setTheme('dark')}>B: {theme}</button>;
}
```

Both are rendered as siblings. The user clicks the button in `ComponentB`. Does `ComponentA`'s displayed text update to "A sees: dark" immediately?

**Answer:** No — `ComponentA` still shows "A sees: light" until it happens to re-render for some other reason (e.g., a remount or a manual refresh); it does not automatically pick up B's change.

**Why:** Each call to `useLocalStorage` creates its own independent `useState`, so `ComponentA`'s in-memory `value` isn't linked to `ComponentB`'s. Clicking B's button updates B's own state (which then also writes to `localStorage`) — but A has no mechanism to know that write happened, since it only read `localStorage` once, on its own initial mount. To truly sync across components you'd need to also listen for the `storage` event (which only fires in *other* tabs/windows, not the same one) or use Context/a shared store instead.

---

### Question 5

```jsx
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    function update() { setIsOnline(navigator.onLine); }
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  return isOnline;
}

function StatusBanner() {
  const isOnline = useOnlineStatus();
  return <p>{isOnline ? 'Online' : 'Offline'}</p>;
}

function App() {
  const [showBanner, setShowBanner] = useState(true);
  return (
    <>
      <button onClick={() => setShowBanner((s) => !s)}>Toggle</button>
      {showBanner && <StatusBanner />}
    </>
  );
}
```

The user toggles `showBanner` off then on again. Are the `online`/`offline` event listeners from the first mount still attached after that?

**Answer:** No — they were properly removed, and a fresh pair was added on remount.

**Why:** Toggling `showBanner` off unmounts `StatusBanner`, which runs the `useEffect` cleanup function, removing both listeners. Toggling it back on mounts a brand-new instance of `StatusBanner`, running the effect again and attaching new listeners. This is correct, leak-free behavior — proper cleanup in a custom hook's `useEffect` ensures unmounting a component that uses it doesn't leave dangling subscriptions.

---

### Question 6

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetch(url).then((r) => r.json()).then((json) => {
      if (!cancelled) setData(json);
    });
    return () => { cancelled = true; };
  }, [url]);
  return data;
}

function Profile({ userId }) {
  const data = useFetch(`/api/users/${userId}`);
  return <p>{data ? data.name : 'Loading...'}</p>;
}
```

`Profile` is rendered with `userId={1}`, then quickly re-rendered with `userId={2}` before the first fetch resolves. Does the component ever briefly display user 1's name before showing user 2's?

**Answer:** No — it goes straight from "Loading..." to user 2's name, never flashing user 1's data.

**Why:** Changing `url` (via `userId`) reruns the effect, and before the new fetch starts, React calls the previous effect's cleanup, setting that closure's `cancelled` to `true`. When the first fetch's `.then` eventually resolves, its `if (!cancelled)` check is `true` (cancelled), so `setData` is skipped for the stale request. Only the second effect's fetch (for `userId=2`) is allowed to call `setData`, preventing a stale-response race condition — this is the manual equivalent of what `AbortController` gives you more directly.
