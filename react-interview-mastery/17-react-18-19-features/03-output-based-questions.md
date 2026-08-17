# Output-Based Questions: React 18/19 Features

### 1. How many times does this log "render"?
```jsx
function App() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  console.log("render");

  function handleClick() {
    setTimeout(() => {
      setA(1);
      setB(1);
    }, 0);
  }

  return <button onClick={handleClick}>{a}-{b}</button>;
}
// React 18, createRoot. Click once.
```
**Answer:** `"render"` logs twice total: once for the initial mount, and once more after both `setA` and `setB` are applied together.

**Why:** React 18's automatic batching applies inside `setTimeout` callbacks, not just event handlers, so the two state updates are batched into a single re-render instead of two. This is a direct behavior change from React 17, where the same code would have caused two separate re-renders (four "render" logs total including mount... actually three: mount + 2 updates).

---

### 2. What does `isPending` show, and in what order?
```jsx
function Demo() {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState("a");

  function update() {
    startTransition(() => {
      setValue("b");
    });
  }

  console.log("render", value, isPending);
  return <button onClick={update}>go</button>;
}
```
**Answer:** On click: `"render b true"` may briefly log (or be skipped if the update is fast enough), followed by `"render b false"` once the transition completes. For a very fast, synchronous update like this, React may batch it such that you mostly only observe the final `false` state — the `true` intermediate render is not guaranteed to be visually distinguishable for trivial updates.

**Why:** `isPending` becomes `true` while the transition's work is in progress and flips back to `false` once React finishes committing the transitioned update; for cheap updates like a plain string set, this can happen fast enough that the pending state is easy to miss without an actual expensive computation in between.

---

### 3. Does the input lag while typing?
```jsx
function Search({ list }) {
  const [text, setText] = useState("");

  function handleChange(e) {
    setText(e.target.value);
    // expensiveFilter is a synchronous, heavy computation over 50k items
    setResults(expensiveFilter(list, e.target.value));
  }
  // ...
}
```
**Answer:** Yes, the input visibly lags on every keystroke.

**Why:** Neither `setText` nor `setResults` is marked non-urgent — both run in the same synchronous update, so React must finish rendering the expensive filtered list before the input's new value is painted. Wrapping the `setResults` call in `startTransition` (or deriving `results` via `useDeferredValue(text)`) would let React prioritize repainting the input immediately.

---

### 4. What's logged, and how many renders happen?
```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  console.log("render", count);
  return <button onClick={handleClick}>{count}</button>;
}
// Click once, starting from count = 0.
```
**Answer:** Logs `"render 0"` (mount) then `"render 1"` (after click) — count ends at 1, not 3.

**Why:** All three `setCount(count + 1)` calls close over the same `count` value (0) from that render, so each schedules "set count to 1," and React batches them into a single update since they're inside an event handler. This is unrelated to React 18's automatic batching specifically — event handler batching existed before React 18 too; it demonstrates the stale-closure trap, not the new batching behavior.

---

### 5. Is this a Server Component or Client Component, and what's wrong with it?
```jsx
"use client";

async function ProductDetails({ id }) {
  const product = await db.products.findById(id);
  return <h1>{product.name}</h1>;
}
```
**Answer:** This is invalid — it's marked `"use client"` but is written as an `async` Server-Component-style function directly querying the database, which Client Components cannot do.

**Why:** `"use client"` opts a component into client-side rendering, where you don't have direct server-side resources like a database connection available, and client components (as of the current RSC model) aren't rendered as `async` functions the way Server Components can be. Direct data access with `await db...` belongs in a Server Component (no `"use client"` directive); a Client Component would instead receive `product` as a prop or fetch it client-side.

---

### 6. What does useId produce across two renders of the same component instance?
```jsx
function Field() {
  const id = useId();
  console.log(id);
  return <input id={id} />;
}

function App() {
  const [, forceRender] = useReducer((x) => x + 1, 0);
  return (
    <>
      <Field />
      <button onClick={forceRender}>re-render</button>
    </>
  );
}
```
**Answer:** The same ID string logs on every re-render of that `Field` instance (e.g., `":r0:"` both times).

**Why:** `useId` generates a stable ID tied to the component instance's position in the tree, computed once and preserved across re-renders — it is not regenerated on every render like `Math.random()` would be. It only changes if the component unmounts and a new instance mounts.

---

### 7. What breaks if useSyncExternalStore's snapshot function returns a new object every call?
```jsx
function useStore() {
  return useSyncExternalStore(
    subscribe,
    () => ({ value: store.getValue() }) // new object every call
  );
}
```
**Answer:** The component re-renders in an infinite loop (or React logs a warning about getSnapshot returning a different value on every call and the render becomes unstable).

**Why:** `useSyncExternalStore` compares the snapshot from `getSnapshot` across calls (typically via `Object.is`) to decide whether a re-render is needed; returning a brand-new object literal every call always compares as different, so React thinks the store changed every single time it checks, causing continuous re-renders. The snapshot function must return a stable reference when the underlying value hasn't changed (e.g., return `store.getValue()` directly if it's a primitive, or memoize the object).
