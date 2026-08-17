# Snippets

### 1. Parent re-render forces child re-render even with unchanged props
```jsx
function Parent() {
  const [tick, setTick] = useState(0);
  return (
    <>
      <button onClick={() => setTick(t => t + 1)}>tick: {tick}</button>
      <Child label="static" />
    </>
  );
}
function Child({ label }) {
  console.log('Child rendered'); // fires every click, though label never changes
  return <span>{label}</span>;
}
```

### 2. `React.memo` skips re-render when props are shallowly equal
```jsx
const Child = React.memo(function Child({ label }) {
  console.log('Child rendered');
  return <span>{label}</span>;
});
function Parent() {
  const [tick, setTick] = useState(0);
  return (
    <>
      <button onClick={() => setTick(t => t + 1)}>tick: {tick}</button>
      <Child label="static" /> {/* now skips re-render — same primitive prop */}
    </>
  );
}
```

### 3. `React.memo` defeated by an inline object prop
```jsx
const Box = React.memo(function Box({ style }) {
  console.log('Box rendered');
  return <div style={style}>content</div>;
});
function Parent() {
  const [tick, setTick] = useState(0);
  return (
    <>
      <button onClick={() => setTick(t => t + 1)}>{tick}</button>
      {/* new {} literal every render -> memo never skips */}
      <Box style={{ color: 'red' }} />
    </>
  );
}
```

### 4. Fixing it with `useMemo` for a stable object reference
```jsx
function Parent() {
  const [tick, setTick] = useState(0);
  const style = useMemo(() => ({ color: 'red' }), []); // stable across renders
  return (
    <>
      <button onClick={() => setTick(t => t + 1)}>{tick}</button>
      <Box style={style} />
    </>
  );
}
```

### 5. `useCallback` stabilizing a function prop for a memoized child
```jsx
const Button = React.memo(function Button({ onClick, children }) {
  console.log('Button rendered');
  return <button onClick={onClick}>{children}</button>;
});
function Parent() {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => setCount(c => c + 1), []); // stable identity
  return <Button onClick={increment}>Count: {count}</Button>;
}
```

### 6. Context change re-renders every consumer, even unrelated ones
```jsx
const ThemeContext = createContext({ theme: 'light', user: 'anon' });
function App() {
  const [theme, setTheme] = useState('light');
  const value = { theme, user: 'anon' }; // new object every render too!
  return (
    <ThemeContext.Provider value={value}>
      <ThemeToggleButton onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))} />
      <UserBadge /> {/* re-renders on every theme toggle, doesn't even read theme */}
    </ThemeContext.Provider>
  );
}
function UserBadge() {
  const { user } = useContext(ThemeContext);
  console.log('UserBadge rendered');
  return <span>{user}</span>;
}
```

### 7. Splitting state into a child component to narrow re-render scope
```jsx
// Before: SearchBox state lives in a big Parent, re-rendering everything below on each keystroke.
// After: isolate the input's state in its own leaf component.
function SearchBox() {
  const [query, setQuery] = useState('');
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
function Page() {
  return (
    <>
      <SearchBox /> {/* keystrokes only re-render this component */}
      <ExpensiveDashboard />
    </>
  );
}
```
