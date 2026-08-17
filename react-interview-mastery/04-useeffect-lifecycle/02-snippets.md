# Snippets — `useEffect` & Lifecycle

```jsx
// 1. Effect with no dependency array — runs after every render
function RenderLogger() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    console.log('rendered');
  });
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

```jsx
// 2. Empty dependency array — runs once, on mount only
function MountLogger() {
  React.useEffect(() => {
    console.log('mounted');
  }, []);
  return <p>Loaded</p>;
}
```

```jsx
// 3. Dependency array with a value — re-runs only when that value changes
function UserProfile({ userId }) {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    let cancelled = false;
    fetchUser(userId).then(data => {
      if (!cancelled) setUser(data);
    });
    return () => { cancelled = true; }; // avoid setting state after unmount/stale request
  }, [userId]);
  return <div>{user?.name ?? 'Loading...'}</div>;
}
```

```jsx
// 4. Cleanup function unsubscribing an event listener
function WindowWidth() {
  const [width, setWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    function handleResize() { setWidth(window.innerWidth); }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return <p>Width: {width}px</p>;
}
```

```jsx
// 5. Avoiding a stale closure with the functional update form inside setInterval
function Ticker() {
  const [seconds, setSeconds] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []); // no stale-closure bug because setSeconds uses the updater form
  return <p>{seconds}s elapsed</p>;
}
```

```jsx
// 6. useLayoutEffect measuring the DOM before paint to avoid a visible flicker
function Tooltip({ text }) {
  const ref = React.useRef(null);
  const [top, setTop] = React.useState(0);
  React.useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTop(-height - 8); // positioned before the browser paints
  }, [text]);
  return <div ref={ref} style={{ position: 'absolute', top }}>{text}</div>;
}
```

```jsx
// 7. Avoiding an infinite loop by depending on primitives, not a fresh object literal
function SearchResults({ query, page }) {
  const [results, setResults] = React.useState([]);
  React.useEffect(() => {
    // built inside the effect, not passed in as an unstable dependency
    fetchResults({ query, page }).then(setResults);
  }, [query, page]);
  return <ul>{results.map(r => <li key={r.id}>{r.title}</li>)}</ul>;
}
```
