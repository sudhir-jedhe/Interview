## Does this `useEffect` run on every render of `AppProvider`, or only once?

```jsx
function AppProvider({ children }) {
  const [count, setCount] = useState(0);
  const contextValue = { count, setCount }; // new object every render, no useMemo

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

function SomeConsumer() {
  const ctx = useContext(AppContext);

  useEffect(() => {
    console.log('effect ran');
  }, [ctx]); // dependency is the whole context object

  return null;
}
```

**Answer:** The effect re-runs on *every* render of `AppProvider`, not just when `count` actually changes.

**Why:** `contextValue` is a new object literal created on every render of `AppProvider`, so its reference changes every time, regardless of whether `count` itself changed. `useEffect`'s dependency array uses `Object.is` (reference equality) to decide whether to re-run, and since `ctx` is a new reference every render, the effect re-runs every render — even ones where `count` didn't change (e.g., a parent re-rendering `AppProvider` for an unrelated reason). This is the same "new object identity every render" trap as `output-based/01`, showing up in a different hook. Two fixes: wrap `contextValue` in `useMemo(() => ({ count, setCount }), [count])` so its reference is stable across renders where `count` is unchanged, or (equivalent to the broader lesson of this topic) use a library — Redux, Zustand, Jotai — whose subscription/selector model doesn't require you to manually manage object identity to get correct re-render/effect behavior in the first place.
