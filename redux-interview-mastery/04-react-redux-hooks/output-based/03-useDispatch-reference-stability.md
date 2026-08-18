# Output: Is `dispatch` from `useDispatch` a stable reference across renders?

```jsx
function Counter() {
  const dispatch = useDispatch();
  const renderCount = useRef(0);
  renderCount.current += 1;

  useEffect(() => {
    console.log('effect ran, render #', renderCount.current);
  }, [dispatch]);

  const [, forceRerender] = useState(0);

  return (
    <div>
      <button onClick={() => forceRerender((n) => n + 1)}>Force re-render</button>
    </div>
  );
}

// Clicking "Force re-render" 3 times.
```

**Answer:** `'effect ran, render # 1'` logs exactly once — clicking "Force re-render" three times causes three re-renders of the component, but the `useEffect` (dependent on `[dispatch]`) does not re-run any of those times.

**Why:** `useDispatch()` returns the same `dispatch` function reference on every render, for the lifetime of a given `<Provider>` — it's read once from the store instance, and the store's `dispatch` method itself never changes identity after the store is created. Since `dispatch`'s reference never changes, an effect with `[dispatch]` as its dependency array only re-runs on mount (when the dependency is first established), never again due to re-renders — this is exactly why it's safe (and idiomatic) to include `dispatch` in a `useEffect`/`useCallback` dependency array without worrying it will cause extra effect runs, unlike, say, a freshly-constructed object or array selected via `useSelector` without memoization.
