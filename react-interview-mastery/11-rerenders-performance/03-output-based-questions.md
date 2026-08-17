# Output-Based Questions

### 1. Does `Child` log on every click?
```jsx
function Child({ value }) {
  console.log('Child render');
  return <span>{value}</span>;
}
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <Child value="fixed" />
    </>
  );
}
```
**Answer:** Yes, "Child render" logs on every click.

**Why:** `Child` is not memoized, so it re-renders whenever its parent re-renders — regardless of whether its own props changed. `setCount` triggers `Parent` to re-render, which re-renders `Child` unconditionally.

---

### 2. Does wrapping in `React.memo` change the outcome here?
```jsx
const Child = React.memo(function Child({ config }) {
  console.log('Child render');
  return <span>{config.label}</span>;
});
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <Child config={{ label: 'fixed' }} />
    </>
  );
}
```
**Answer:** No — "Child render" still logs on every click, even though `Child` is memoized.

**Why:** `memo` does a shallow comparison of props. `config` is a new object literal created on every `Parent` render, so `Object.is(prevConfig, nextConfig)` is `false`. The label's *value* is unchanged but the reference isn't, so `memo` bails out and re-renders anyway.

---

### 3. What logs when the button is clicked once?
```jsx
function Parent() {
  const [n, setN] = useState(0);
  console.log('Parent render');
  return (
    <div>
      <button onClick={() => setN(n + 1)}>inc</button>
      <MemoChild n={n} />
    </div>
  );
}
const MemoChild = React.memo(function MemoChild({ n }) {
  console.log('MemoChild render', n);
  return <p>{n}</p>;
});
```
**Answer:** `"Parent render"` then `"MemoChild render 1"`.

**Why:** `n` is a primitive, so it's compared by value under `Object.is`. It changed from `0` to `1`, so `memo` correctly lets the re-render through. This is the "happy path" for `memo` — primitive props.

---

### 4. Two clicks in a row on the same button (batched in one event handler) — how many `Parent` renders?
```jsx
function Parent() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  console.log('render');
  function handleClick() {
    setA(a + 1);
    setB(b + 1);
  }
  return <button onClick={handleClick}>{a}-{b}</button>;
}
```
**Answer:** One additional `"render"` log per click (not two).

**Why:** React 18 batches all state updates that occur within a single event handler (and now even inside promises/timeouts by default), producing a single re-render that applies both `setA` and `setB` together.

---

### 5. Does using an inline arrow function as a `key` extractor cause a problem here?
```jsx
function List({ items }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item.text}</li>
      ))}
    </ul>
  );
}
// items initially: [{text:'a'},{text:'b'},{text:'c'}]
// then user deletes the first item -> [{text:'b'},{text:'c'}]
```
**Answer:** The list re-renders "correctly" visually (shows b, c) but React reuses the DOM node/state that belonged to index 0 ("a") for "b", and the node for index 1 ("c") for the new index 1 — i.e., it patches text in place rather than removing the first `<li>` and shifting.

**Why:** Using array index as `key` ties identity to position, not to the item itself. When the first item is removed, every subsequent item shifts up one index, so React thinks the *elements* stayed the same and only their content changed — it diffs/updates text content instead of unmounting/remounting. This is invisible for plain text but breaks badly for components holding their own state (e.g., uncontrolled inputs) at each row.

---

### 6. What does the console show, in order?
```jsx
const Row = React.memo(({ id, onClick }) => {
  console.log('Row', id);
  return <li onClick={onClick}>{id}</li>;
});
function List() {
  const [items] = useState([1, 2, 3]);
  const [selected, setSelected] = useState(null);
  return (
    <ul>
      {items.map(id => (
        <Row key={id} id={id} onClick={() => setSelected(id)} />
      ))}
    </ul>
  );
}
```
**Answer:** On mount: `Row 1`, `Row 2`, `Row 3`. After clicking any row: all three `Row` logs fire again.

**Why:** `onClick={() => setSelected(id)}` creates a brand-new function on every `List` render for every row. Even though only `selected` changed, every `Row`'s `onClick` prop reference changed too, so `memo`'s shallow comparison fails for all three rows, not just the clicked one.

---

### 7. Given a `ThemeContext.Provider` wrapping the whole app, which components re-render when `theme` toggles?
```jsx
const ThemeContext = createContext();
function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar onToggle={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))} />
      <Sidebar />
    </ThemeContext.Provider>
  );
}
function Toolbar({ onToggle }) {
  return <button onClick={onToggle}>Toggle</button>;
}
function Sidebar() {
  return <SidebarLink />;
}
function SidebarLink() {
  const theme = useContext(ThemeContext);
  return <a className={theme}>Link</a>;
}
```
**Answer:** `App` re-renders (state owner), `Toolbar` and `Sidebar` re-render too (they're children of `App`, not memoized), and `SidebarLink` re-renders because it consumes the changed context value.

**Why:** Nothing here is memoized, so the parent re-render alone would cascade through `Toolbar`/`Sidebar`/`SidebarLink` regardless of context. The context change is actually redundant with the parent-cascade in this particular example — it would only matter independently if `Sidebar`/`SidebarLink` were wrapped in `memo`, in which case the context change would still force `SidebarLink` (but not necessarily `Sidebar`) to re-render.

---

### 8. Will `memo` prevent the re-render here?
```jsx
const Child = React.memo(function Child({ items }) {
  console.log('Child render');
  return <span>{items.length}</span>;
});
function Parent() {
  const [tick, setTick] = useState(0);
  const items = [1, 2, 3]; // recreated every render
  return (
    <>
      <button onClick={() => setTick(t => t + 1)}>{tick}</button>
      <Child items={items} />
    </>
  );
}
```
**Answer:** No — `Child` re-renders on every click.

**Why:** Same shallow-comparison caveat as objects: `[1,2,3]` is a new array reference every render even though its contents are identical. `memo` compares by reference for non-primitives, so it never skips here. Wrapping `items` in `useMemo(() => [1,2,3], [])` would fix it.
