# Snippets

### 1. Basic HOC that injects a loading gate
```jsx
function withLoading(Wrapped) {
  return function WithLoading({ isLoading, ...rest }) {
    return isLoading ? <p>Loading...</p> : <Wrapped {...rest} />;
  };
}
const Greeting = ({ name }) => <p>Hello, {name}</p>;
const GreetingWithLoading = withLoading(Greeting);
// <GreetingWithLoading isLoading={false} name="Ada" /> -> "Hello, Ada"
```

### 2. HOC passing through extra props with `...rest`
```jsx
function withBorder(Wrapped) {
  return function WithBorder({ borderColor = 'black', ...rest }) {
    return (
      <div style={{ border: `1px solid ${borderColor}` }}>
        <Wrapped {...rest} />
      </div>
    );
  };
}
const Card = ({ title }) => <div>{title}</div>;
const BorderedCard = withBorder(Card);
// <BorderedCard title="Hi" borderColor="red" /> renders bordered <div>Hi</div>
```

### 3. Setting `displayName` for debuggable HOCs
```jsx
function withLogger(Wrapped) {
  function WithLogger(props) {
    console.log('rendering', Wrapped.name, props);
    return <Wrapped {...props} />;
  }
  WithLogger.displayName = `withLogger(${Wrapped.displayName || Wrapped.name})`;
  return WithLogger;
}
```

### 4. Render prop component sharing mouse position logic
```jsx
function MouseTracker({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
      {children(pos)}
    </div>
  );
}
// usage: <MouseTracker>{({ x, y }) => <p>{x}, {y}</p>}</MouseTracker>
```

### 5. Render prop using a `render` prop name instead of `children`
```jsx
function Toggle({ render }) {
  const [on, setOn] = useState(false);
  return render({ on, toggle: () => setOn(o => !o) });
}
// usage:
// <Toggle render={({ on, toggle }) => (
//   <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>
// )} />
```

### 6. The equivalent logic as a custom hook (the modern replacement)
```jsx
function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn(o => !o), []);
  return [on, toggle];
}
function ToggleButton() {
  const [on, toggle] = useToggle();
  return <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>;
}
```

### 7. Stacking two HOCs (showing the wrapper nesting hooks avoid)
```jsx
const Enhanced = withLoading(withBorder(Greeting));
// Tree in DevTools: WithLoading > WithBorder > Greeting
// <Enhanced isLoading={false} borderColor="blue" name="Ada" />
```
