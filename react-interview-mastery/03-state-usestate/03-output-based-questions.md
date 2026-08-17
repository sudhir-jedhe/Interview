# Output-Based Questions — State & `useState`

### 1. What does the button show after one click?

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);
  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }
  return <button onClick={handleClick}>{count}</button>;
}
```

**Answer:** After one click, the button shows `1`, not `3`.

**Why:** All three `setCount(count + 1)` calls read the same `count` value (0) captured in this render's closure, so each one schedules "set state to 1." React only applies the last-scheduled value for a given batch when using the non-functional form repeatedly like this — the net effect is a single increment, not three.

---

### 2. What does the button show after one click, and why is it different from question 1?

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);
  function handleClick() {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  }
  return <button onClick={handleClick}>{count}</button>;
}
```

**Answer:** After one click, the button shows `3`.

**Why:** The functional updater form receives the *latest pending* state as its argument, not the value captured in the closure. React queues these updater functions and applies them in sequence, so each one correctly builds on the previous one's result within the same batch.

---

### 3. What logs when the button is clicked?

```jsx
function Example() {
  const [count, setCount] = React.useState(0);
  function handleClick() {
    setCount(count + 1);
    console.log('count is', count);
  }
  return <button onClick={handleClick}>{count}</button>;
}
```

**Answer:** `count is 0` on the first click (and `count is 1` on the second click, etc.) — always the *pre-update* value.

**Why:** `setCount` schedules a re-render; it doesn't mutate the `count` variable in the current closure synchronously. The `console.log` right after still reads the same `count` that existed when this render's `handleClick` was created, which is the old value.

---

### 4. What happens to the list after clicking "Add" twice?

```jsx
function List() {
  const [items, setItems] = React.useState([]);
  function addItem() {
    items.push(items.length);
    setItems(items);
  }
  return (
    <>
      <button onClick={addItem}>Add</button>
      <ul>{items.map((n, i) => <li key={i}>{n}</li>)}</ul>
    </>
  );
}
```

**Answer:** Nothing visibly changes in the UI after either click, even though `items` does grow internally.

**Why:** `.push()` mutates the array in place, so `setItems(items)` is called with the *same reference* the state already holds. React's default bailout check (`Object.is` comparison) sees no reference change and skips the re-render, even though the array's contents did change. The fix is `setItems(prev => [...prev, prev.length])` to produce a new array reference.

---

### 5. What renders, and what's the bug?

```jsx
function ExpensiveInit() {
  console.log('component render');
  const [data] = React.useState(computeExpensive());
  return <div>{data}</div>;
}
function computeExpensive() {
  console.log('computing...');
  return Math.random();
}
```

**Answer:** `computing...` logs on *every* render of `ExpensiveInit`, not just the first — even though the computed value is discarded on subsequent renders (state stays at its original value after mount).

**Why:** `React.useState(computeExpensive())` evaluates the argument expression eagerly, every single render, because that's normal JavaScript function-call evaluation order — the argument is computed before `useState` is even called. React only *uses* that value on the first render, but the function still runs every time. The fix is the lazy form: `useState(() => computeExpensive())`, so React only invokes the function on mount.

---

### 6. Does clicking "Reset" actually reset `count` visually? What's the surprise?

```jsx
function Timer({ initialCount }) {
  const [count, setCount] = React.useState(initialCount);
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={() => setCount(initialCount)}>Reset</button>
    </div>
  );
}

// Rendered as: <Timer initialCount={0} />, never re-rendered with a new initialCount prop
```

**Answer:** "Reset" works fine here (sets `count` back to `0`), but this is a bit of a trap question — many people expect `useState(initialCount)` to re-sync `count` whenever `initialCount` prop changes on a re-render. It does not.

**Why:** `useState`'s argument is only used to seed state on the component's very first mount. If the parent later re-renders `<Timer initialCount={5} />` with a new prop value, `count` will NOT automatically update to `5` — it stays whatever it was, because `useState` ignores its argument after mount. Re-syncing to prop changes requires either a `key` change (to remount) or a manual effect/derived-state pattern.

---

### 7. What happens on the second click?

```jsx
function Form() {
  const [values, setValues] = React.useState({ name: '', email: '' });
  function handleNameChange(e) {
    values.name = e.target.value; // direct mutation
    setValues(values);
  }
  return <input value={values.name} onChange={handleNameChange} />;
}
```

**Answer:** The input appears frozen — typing doesn't visibly update the field's displayed value (React may even warn about a controlled input receiving an unexpected value in some cases, or it simply never re-renders to reflect the new state).

**Why:** Same root cause as question 4: mutating `values` directly and passing the same reference back to `setValues` means React's reference-equality bailout skips the re-render. The controlled `<input value={values.name}>` therefore never sees an updated `value`, so it looks stuck even though the underlying object did technically change in memory.
