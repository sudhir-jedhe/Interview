# Output-Based Questions: useMemo & useCallback

### Question 1

```jsx
const Child = React.memo(function Child({ onClick }) {
  console.log('Child render');
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = () => console.log('clicked');

  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      <Child onClick={handleClick} />
    </>
  );
}
```

Clicking "Increment" 3 times — how many times does "Child render" log?

**Answer:** 4 times total (once on initial mount, then once per increment click).

**Why:** `handleClick` is declared as a plain arrow function inside `Parent`'s body, so it's a brand-new function reference on every render of `Parent`. `React.memo`'s shallow prop comparison sees a "different" `onClick` every time, so it never bails out — `Child` re-renders on every `Parent` render despite being wrapped in `React.memo`. Wrapping `handleClick` in `useCallback(() => console.log('clicked'), [])` would fix this.

---

### Question 2

```jsx
function List({ items, taxRate }) {
  const total = useMemo(() => {
    console.log('recomputing total');
    return items.reduce((sum, i) => sum + i.price, 0) * (1 + taxRate);
  }, [items]);

  return <p>{total.toFixed(2)}</p>;
}
```

`items` stays the same array reference across renders, but `taxRate` changes from `0.05` to `0.08`. Does "recomputing total" log, and is the displayed total correct?

**Answer:** "recomputing total" does not log (deps array only has `items`, unchanged), and the displayed total is stale — it still reflects the old `taxRate`.

**Why:** `taxRate` is used inside the memoized function but missing from the dependency array. `useMemo` only recomputes when a listed dependency changes; since `items` is unchanged, React returns the cached value from before, silently ignoring that `taxRate` changed. This is a classic missing-dependency bug — most lint configs with `eslint-plugin-react-hooks`'s `exhaustive-deps` rule would flag this.

---

### Question 3

```jsx
function SearchPanel({ query }) {
  const options = { caseSensitive: false };

  const results = useMemo(() => {
    console.log('searching');
    return search(query, options);
  }, [query, options]);

  return <ResultsList results={results} />;
}
```

`SearchPanel` re-renders repeatedly due to an unrelated parent state change, with `query` staying the same each time. Does "searching" log on every one of those re-renders?

**Answer:** Yes, "searching" logs on every re-render, even though `query` never changes.

**Why:** `options` is a new object literal created fresh inside the component body on every render, so it's a new reference every time. It's listed as a `useMemo` dependency, and since `Object.is(newOptions, oldOptions)` is always `false`, the memoization is defeated — the expensive computation reruns every render regardless of `query`. The fix is to either move `options` outside the component (if it's truly constant) or wrap it in its own `useMemo` with an empty dependency array.

---

### Question 4

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const logCount = useCallback(() => {
    console.log(count);
  }, []);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      <button onClick={logCount}>Log count</button>
    </div>
  );
}
```

The user clicks "Increment" 3 times, then clicks "Log count". What logs?

**Answer:** `0`, not `3`.

**Why:** `useCallback(fn, [])` memoizes `logCount` once, on the initial render, and reuses that exact same function forever since the dependency array never changes. That original function closed over `count` as it was on the first render — `0`. Later renders create new `count` values, but `logCount` was never recreated to capture them, so it's a stale closure. Fixing it requires `[count]` as the dependency array (recreating `logCount` whenever `count` changes) or using the functional form if applicable.

---

### Question 5

```jsx
function ExpensiveList({ data }) {
  const sorted = useMemo(() => {
    console.log('sorting', data.length, 'items');
    return [...data].sort((a, b) => a.value - b.value);
  }, [data]);

  return <ul>{sorted.map((d) => <li key={d.id}>{d.value}</li>)}</ul>;
}

function App() {
  const [data] = useState([{ id: 1, value: 3 }, { id: 2, value: 1 }]);
  const [tick, setTick] = useState(0);

  return (
    <div>
      <button onClick={() => setTick((t) => t + 1)}>Tick: {tick}</button>
      <ExpensiveList data={data} />
    </div>
  );
}
```

Clicking "Tick" 5 times — does "sorting..." log 5 more times?

**Answer:** No — it doesn't log again at all after the initial render.

**Why:** `data` comes from `useState` and is never reassigned, so it's the same array reference on every render of `App`, which means `ExpensiveList` always receives the same `data` prop reference. Even though `App` re-renders (and by default so would `ExpensiveList`, since it's not wrapped in `React.memo`), the `useMemo` inside `ExpensiveList` checks its own dependency (`data`) — unchanged — and returns the cached sorted array without recomputing.

---

### Question 6

```jsx
function Form() {
  const [name, setName] = useState('');
  const validate = useMemo(() => (value) => value.trim().length > 0, []);

  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}
```

What is `validate` here — is this a reasonable use of `useMemo`?

**Answer:** `validate` is a memoized function reference (`useMemo` returning a function, rather than a computed value), functionally identical to `useCallback((value) => value.trim().length > 0, [])`. It works correctly, but it's non-idiomatic — using `useMemo` to memoize a function is unusual and less clear than just using `useCallback` for that purpose.

**Why:** `useMemo(() => fn, deps)` and `useCallback(fn, deps)` produce the same result — `useCallback` is literally implemented as a thin wrapper over this exact pattern. Since the intent here ("memoize this function") maps directly onto `useCallback`'s purpose, most style guides and linters would flag this as better written as `useCallback((value) => value.trim().length > 0, [])`.

---

### Question 7

```jsx
const Item = React.memo(function Item({ item, onDelete }) {
  console.log('Item render:', item.id);
  return <li>{item.name}<button onClick={() => onDelete(item.id)}>x</button></li>;
});

function List({ items, onDelete }) {
  return (
    <ul>
      {items.map((item) => (
        <Item key={item.id} item={item} onDelete={onDelete} />
      ))}
    </ul>
  );
}

function App() {
  const [items, setItems] = useState([{ id: 1, name: 'A' }, { id: 2, name: 'B' }]);
  const handleDelete = useCallback(
    (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
    []
  );
  return <List items={items} onDelete={handleDelete} />;
}
```

The user deletes item with id `1`. Does `Item` for id `2` re-render?

**Answer:** No — `Item` for id `2` does not re-render.

**Why:** `handleDelete` is memoized with `useCallback(..., [])`, so it's referentially stable across `App` re-renders (and it correctly uses the functional updater `setItems(prev => ...)`, so it never needs `items` in its own closure/deps). `items` itself is a new array reference after filtering (expected, since state changed), but the individual `item` object for id `2` is untouched — same reference as before. Since `Item` is wrapped in `React.memo` and both `item` (unchanged reference) and `onDelete` (stable via `useCallback`) pass the shallow-equality check, `Item` for id `2` skips re-rendering. Only the removed item's `Item` disappears from the list; id `1`'s component unmounts, id `2`'s never re-renders.
