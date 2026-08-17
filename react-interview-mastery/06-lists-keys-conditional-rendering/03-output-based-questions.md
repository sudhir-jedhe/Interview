# Output-Based Questions: Lists, Keys & Conditional Rendering

### Question 1

```jsx
function Notifications({ count }) {
  return <div>{count && <span>You have {count} alerts</span>}</div>;
}

// rendered with <Notifications count={0} />
```

**Answer:** The page renders the text `0` inside the `<div>`, not nothing.

**Why:** `count && <span>...</span>` short-circuits at `count` because `0` is falsy, so the expression evaluates to `0` (not `false`). JSX renders numbers as text nodes, so `0` shows up literally on the screen. Only `false`, `null`, and `undefined` render as nothing.

---

### Question 2

```jsx
function List() {
  const [items, setItems] = useState(['a', 'b', 'c']);
  return (
    <div>
      <button onClick={() => setItems((prev) => prev.filter((i) => i !== 'a'))}>
        Remove a
      </button>
      {items.map((item, index) => (
        <RowWithInput key={index} label={item} />
      ))}
    </div>
  );
}

function RowWithInput({ label }) {
  const [text, setText] = useState('');
  return (
    <div>
      {label}: <input value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
}
```

If the user types "hello" into the input next to "b" (index 1), then clicks "Remove a", what happens to the input text?

**Answer:** The "hello" text stays visible, but now it appears next to "c" instead of "b".

**Why:** Keys are index-based, so after removing `'a'`, the array shifts: `'b'` and `'c'` move to indices 0 and 1. React matches by key (index), so the component instance that was at index 1 (holding `text = 'hello'` in its own state) is reused for whatever item now sits at index 1 — which is `'c'`. The DOM node and its internal state are not tied to the label, only to the position.

---

### Question 3

```jsx
function Page({ isAdmin }) {
  return <div>{isAdmin && <AdminPanel />}</div>;
}
```

`isAdmin` is `undefined` on first render (data hasn't loaded yet). What renders?

**Answer:** Nothing visible — the `<div>` renders empty.

**Why:** `undefined && <AdminPanel />` evaluates to `undefined`, and React renders `undefined` (like `null`/`false`) as nothing. This is different from the `0` case because `undefined` is one of the "renders as nothing" values.

---

### Question 4

```jsx
function Grid({ rows }) {
  return (
    <>
      {rows.map((row) => (
        <div key={row.id}>
          {row.cells.map((cell) => (
            <span key={row.id}>{cell.value}</span>
          ))}
        </div>
      ))}
    </>
  );
}
```

React logs a warning in the console. What is it, and is the app still functionally broken?

**Answer:** React warns about duplicate keys within the inner `.map()` (every `<span>` in a given row shares the same key: `row.id`). The app will likely misrender — cells within a row may not update correctly when their values change, though it won't crash.

**Why:** Each `.map()` call needs keys unique among its own siblings. The inner map is keyed by `row.id`, which is constant across all cells in that row, so React can't tell the cells apart. It should be keyed by `cell.id` instead.

---

### Question 5

```jsx
function Toggle() {
  const [show, setShow] = useState(true);
  return (
    <div>
      <button onClick={() => setShow((s) => !s)}>Toggle</button>
      {show ? <Timer /> : null}
    </div>
  );
}

function Timer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return <p>{seconds}</p>;
}
```

The user toggles off then back on. Does the timer resume from where it left off?

**Answer:** No — it resets to `0`.

**Why:** When `show` becomes `false`, `<Timer />` is removed from the tree, which unmounts it and discards its state entirely (the interval is cleared by the cleanup function too). When `show` becomes `true` again, it's a brand-new mount with fresh `useState(0)`. Conditional rendering with `? :` or `&&` fully unmounts components, unlike CSS-based hiding (`display: none`), which would preserve state.

---

### Question 6

```jsx
function Board({ cards }) {
  return (
    <>
      {cards.map((card) => (
        <Card key={card.id} card={card} />
      ))}
    </>
  );
}
```

`cards` is `[{id: 1, name: 'A'}, {id: 2, name: 'B'}]`. The parent re-renders and passes a **new array reference** with the exact same objects and order (e.g., from `[...cards]`). Do the `Card` components re-render?

**Answer:** Yes, all `Card` instances re-render (assuming `Card` isn't wrapped in `React.memo`), even though nothing meaningfully changed.

**Why:** Keys staying the same across renders means React reuses the same component instances (no remount), but that's separate from re-rendering. Without `React.memo`, every child of a re-rendered parent re-renders regardless of prop equality. Stable keys prevent unmount/remount thrashing; they don't by themselves prevent re-renders.

---

### Question 7

```jsx
function Items({ list }) {
  return (
    <ul>
      {list.map((item) => {
        <li key={item.id}>{item.name}</li>;
      })}
    </ul>
  );
}
```

What renders inside the `<ul>`?

**Answer:** Nothing — an empty `<ul>`.

**Why:** The arrow function body uses curly braces `{ ... }`, which makes it a block body requiring an explicit `return`. There is no `return` here, so every call returns `undefined`, and `.map()` produces an array of `undefined`s. React renders `undefined` as nothing. This is a very common copy-paste bug when converting an implicit-return arrow (`item => <li>...`) into a multi-line one.

---

### Question 8

```jsx
function Sortable() {
  const [nums, setNums] = useState([3, 1, 2]);
  return (
    <div>
      <button onClick={() => setNums((n) => [...n].sort())}>Sort</button>
      {nums.map((n) => (
        <input key={n} defaultValue={n} />
      ))}
    </div>
  );
}
```

Before sorting, the user types extra text into the input showing `1` (making it read "1x"). After clicking Sort, which input shows "1x"?

**Answer:** The input keyed `1` still shows "1x" — it just moves to whatever position `1` now sorts into (the first position, since sorted is `[1,2,3]`).

**Why:** Here the key is the value itself (`n`), which is stable and unique per item, so React correctly tracks that specific input across the reorder and keeps its DOM node (and typed-in value, since it's uncommitted `defaultValue` state) attached to the "1" item rather than to a position. This is the *correct* use of a non-id key when the values themselves are unique identifiers.
