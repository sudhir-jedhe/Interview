# Output-Based Questions — `useEffect` & Lifecycle

### 1. What's logged, and in what order, on mount?

```jsx
function App() {
  console.log('A: render');
  React.useEffect(() => {
    console.log('C: effect');
  });
  console.log('B: still rendering');
  return <div>hi</div>;
}
```

**Answer:** `A: render`, `B: still rendering`, `C: effect` — in that order.

**Why:** The component function body (render phase) runs completely and synchronously first, producing the JSX. React commits the resulting DOM changes, and only after paint does it run the effect callback. Effects never run interleaved with the render function's own synchronous code.

---

### 2. What logs when the count button is clicked, using this effect?

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    console.log('effect ran, count =', count);
  }, []);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

**Answer:** `effect ran, count = 0` logs exactly once, on mount. Clicking the button does not log anything else.

**Why:** The empty dependency array means the effect runs only once, after the initial render, and never again — regardless of how many times `count` subsequently changes. The effect's closure permanently captured `count = 0` from that first render.

---

### 3. What does this log every second, and what's the bug?

```jsx
function Clock() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => {
      console.log('count is', count);
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <p>{count}</p>;
}
```

**Answer:** It logs `count is 0` every single second, forever, and the displayed `<p>` also stays stuck at `1` (it increments once, from 0 to 1, and then stays there).

**Why:** The effect runs once (empty deps) and its `setInterval` callback closes over `count` and `setCount` as they existed on that first render — `count` is permanently `0` in that closure. Each tick calls `setCount(count + 1)`, i.e. `setCount(0 + 1)`, which sets state to `1` every time — not an increasing value, since `count` never updates inside this stale closure. The state does re-render the component each tick (with the same value, `1`, after the first tick), but the closure itself is frozen.

---

### 4. How is this different from question 3, and what does it log?

```jsx
function Clock() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <p>{count}</p>;
}
```

**Answer:** The displayed count correctly increments every second: 1, 2, 3, 4...

**Why:** The functional updater form `c => c + 1` doesn't rely on any value captured by the effect's closure — React calls it with the actual latest state value at the time the interval fires, regardless of what `count` was when the effect was created. This sidesteps the stale-closure problem entirely without needing `count` in the dependency array.

---

### 5. What happens when `roomId` changes from `"lobby"` to `"general"`?

```jsx
function ChatRoom({ roomId }) {
  React.useEffect(() => {
    console.log('connecting to', roomId);
    return () => console.log('disconnecting from', roomId);
  }, [roomId]);
  return <div>{roomId}</div>;
}
```

**Answer:** Logs, in order: `disconnecting from lobby`, then `connecting to general`.

**Why:** When a dependency changes, React first runs the cleanup function from the *previous* effect run (closing over the old `roomId`, `"lobby"`), and only then runs the new effect body with the updated `roomId`. This "clean up, then re-run" sequencing is what lets each effect run treat itself as a fresh, self-contained synchronization rather than an incremental patch.

---

### 6. What's wrong with this component, and what happens when it runs?

```jsx
function SearchBox({ onSearch }) {
  const [query, setQuery] = React.useState('');
  const options = { trim: true, caseSensitive: false };

  React.useEffect(() => {
    onSearch(query, options);
  }, [query, options]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

**Answer:** The effect re-runs on *every single render* of `SearchBox`, not just when `query` actually changes — including renders triggered by the parent for unrelated reasons, and even the render caused by the effect itself calling `onSearch` if that triggers a parent state update.

**Why:** `options` is a new object literal created fresh on every render, so it's a new reference every time even though its contents never change. Since it's in the dependency array, React's shallow comparison (`Object.is` per dependency) sees it as "changed" every render, causing the effect to fire repeatedly. Fix by moving the object literal inside the effect, or wrapping it in `useMemo`, or depending on its primitive fields directly.

---

### 7. Given `useLayoutEffect`, does the user ever see a flicker?

```jsx
function AutoScrollBox({ messages }) {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages]);
  return <div ref={ref} style={{ overflow: 'auto', height: 200 }}>
    {messages.map(m => <p key={m.id}>{m.text}</p>)}
  </div>;
}
```

**Answer:** No visible flicker — the scroll position is corrected before the browser paints the new messages.

**Why:** `useLayoutEffect` runs synchronously after DOM mutations but *before* the browser paints the frame to the screen, blocking paint until it finishes. That makes it the right tool here: adjusting `scrollTop` happens before the user ever sees the unscrolled state. Using regular `useEffect` instead could cause a single visible frame where the box is unscrolled before snapping down, because `useEffect` runs after paint.
