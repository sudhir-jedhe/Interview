# Output-Based Questions: Context API

### Question 1

```jsx
const CountContext = createContext();

function App() {
  const [count, setCount] = useState(0);
  console.log('App render');
  return (
    <CountContext.Provider value={{ count, setCount }}>
      <Child />
    </CountContext.Provider>
  );
}

function Child() {
  console.log('Child render');
  const { count } = useContext(CountContext);
  return <p>{count}</p>;
}
```

Clicking a button elsewhere calls `setCount(c => c + 1)` once. What logs?

**Answer:** `App render` then `Child render` — every time, on every increment.

**Why:** `setCount` triggers `App` to re-render, which creates a brand-new `{ count, setCount }` object literal for `value`. Even though `Child` only reads `count`, React re-renders every consumer of a context whenever the `value` reference changes (checked via `Object.is`), regardless of which fields the consumer actually uses.

---

### Question 2

```jsx
const ThemeContext = createContext('light');

function Page() {
  return (
    <ThemeContext.Provider value="dark">
      <Section />
    </ThemeContext.Provider>
  );
}

function Section() {
  return <Label />;
}

function Label() {
  const theme = useContext(ThemeContext);
  return <span>{theme}</span>;
}
```

What does `<Label/>` render, and does `<Section/>` need to know about `ThemeContext`?

**Answer:** Renders `dark`. `Section` needs no knowledge of `ThemeContext` at all — it doesn't call `useContext`, doesn't accept a `theme` prop, and doesn't re-render because of context value changes (only because its parent re-renders).

**Why:** This is exactly what Context is for — `Label`, several layers below the Provider, reads the value directly without `Section` acting as a pass-through. `Section`'s render count is driven only by its own props/state and its parent's re-renders, not by `ThemeContext`'s value.

---

### Question 3

```jsx
const DataContext = createContext(null);

function Consumer() {
  const data = useContext(DataContext);
  return <p>{data ?? 'no provider'}</p>;
}

function App() {
  return <Consumer />; // rendered with no wrapping Provider
}
```

What renders?

**Answer:** `no provider`.

**Why:** With no `DataContext.Provider` above `Consumer` in the tree, `useContext` returns the default value passed to `createContext`, which is `null` here. `null ?? 'no provider'` evaluates to `'no provider'`.

---

### Question 4

```jsx
function Provider({ children }) {
  const [state, setState] = useState({ count: 0 });
  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
}

function A() {
  const { state } = useContext(MyContext);
  console.log('A', state.count);
  return null;
}

function B() {
  console.log('B');
  return null;
}

function Root() {
  return (
    <Provider>
      <A />
      <B />
    </Provider>
  );
}
```

`A` calls `setState({ count: 0 })` (same value, new object) inside a click handler. Does `B` re-render? Does `A`?

**Answer:** Both `A` and `B` re-render (assuming neither is wrapped in `React.memo`).

**Why:** `setState` was called with a new object reference, so React treats it as a state change and re-renders `Provider`, which creates a new context `value`, which re-renders every consumer (`A`). `B` re-renders too — not because of context, but simply because it's a child of `Provider`, and by default all children of a re-rendered component re-render regardless of context or props, unless wrapped in `React.memo`.

---

### Question 5

```jsx
const CounterContext = createContext();

function CounterProvider({ children }) {
  const [count, setCount] = useState(0);
  const increment = () => setCount((c) => c + 1);
  const value = useMemo(() => ({ count, increment }), [count]);
  return <CounterContext.Provider value={value}>{children}</CounterContext.Provider>;
}
```

Is `increment` guaranteed to be referentially stable across renders where `count` doesn't change?

**Answer:** The `value` object is stable (same reference) when `count` doesn't change, thanks to `useMemo`. But `increment` itself is a brand-new function on every render of `CounterProvider` — it just happens not to matter here because it's only re-exposed through `value` when `count` changes.

**Why:** This is a subtle trap: `useMemo`'s dependency array only lists `count`, so the memoized `value` object is reused when `count` is unchanged — but `increment` was still recreated fresh before being passed into that memo call. If `increment` were used directly elsewhere as a `useEffect` dependency (bypassing `value`), it would cause effects to re-run every render. Wrapping `increment` itself in `useCallback` would fix that independently.

---

### Question 6

```jsx
const ListContext = createContext([]);

function List() {
  const items = useContext(ListContext);
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function App() {
  const [items] = useState(['a', 'b']);
  return (
    <ListContext.Provider value={items}>
      <List />
    </ListContext.Provider>
  );
}

// App re-renders for an unrelated reason (e.g. parent state change), items array reference unchanged
```

Does `List` re-render when `App` re-renders but `items` (the array reference) hasn't changed?

**Answer:** No, `List` does not re-render.

**Why:** React's context propagation checks `Object.is(newValue, oldValue)` on the `value` prop passed to the Provider. Since `items` comes from `useState` and wasn't reassigned, it's the same array reference across `App` re-renders, so `value` is unchanged and consumers bail out of re-rendering due to context (though they could still re-render for unrelated reasons like their own state or a non-memoized parent re-render cascading through props — not applicable here since `List` takes no props).

---

### Question 7

```jsx
const ConfigContext = createContext();

function ConfigProvider({ children }) {
  return (
    <ConfigContext.Provider value={{ apiUrl: 'https://api.example.com' }}>
      {children}
    </ConfigContext.Provider>
  );
}

function Widget() {
  const config = useContext(ConfigContext);
  useEffect(() => {
    console.log('fetching from', config.apiUrl);
  }, [config]);
  return null;
}
```

Every time `ConfigProvider`'s parent re-renders (even though `apiUrl` never changes), does the effect in `Widget` re-run?

**Answer:** Yes, it re-runs on every re-render of `ConfigProvider`.

**Why:** The object literal `{ apiUrl: '...' }` is recreated on every render of `ConfigProvider`, giving `config` a new reference each time even though its contents never change. The `useEffect` dependency array contains `config` (the whole object), and since it's a new reference every render, the effect fires every time. Fixing this requires memoizing the context value with `useMemo(() => ({ apiUrl: '...' }), [])` or depending on `config.apiUrl` directly instead of the whole object.
