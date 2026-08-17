# Snippets: Custom Hooks

```jsx
// useToggle: boolean state with a stable toggle function
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}

function Accordion() {
  const [expanded, toggleExpanded] = useToggle(false);
  return (
    <button onClick={toggleExpanded}>{expanded ? 'Collapse' : 'Expand'}</button>
  );
}
```

```jsx
// useDebounce: delay reacting to a fast-changing value
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
```

```jsx
// useLocalStorage: state persisted across page reloads
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = window.localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : initialValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  return (
    <button onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}>
      {theme}
    </button>
  );
}
```

```jsx
// useFetch: request with loading/error state and cleanup on unmount
function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });
    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ data: null, loading: false, error });
      });
    return () => controller.abort();
  }, [url]);
  return state;
}
```

```jsx
// Composing custom hooks: useDebouncedFetch built from useDebounce + useFetch
function useDebouncedFetch(url, delay = 300) {
  const debouncedUrl = useDebounce(url, delay);
  return useFetch(debouncedUrl);
}
```

```jsx
// useWindowWidth: subscribing to a browser event with proper cleanup
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}
```

```jsx
// Two independent calls to the same custom hook never share state
function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  return [count, () => setCount((c) => c + 1)];
}

function Dashboard() {
  const [likes, incrementLikes] = useCounter(0);
  const [shares, incrementShares] = useCounter(0);
  // likes and shares are fully independent, even though both come from useCounter
  return (
    <div>
      <button onClick={incrementLikes}>Likes: {likes}</button>
      <button onClick={incrementShares}>Shares: {shares}</button>
    </div>
  );
}
```
