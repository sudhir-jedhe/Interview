# Comparisons: useMemo & useCallback

### useMemo vs useCallback

| Aspect | `useMemo` | `useCallback` |
|---|---|---|
| Memoizes | The *return value* of a function you call inline | The *function reference* itself, not called |
| Signature | `useMemo(() => computeValue(), deps)` | `useCallback(fn, deps)` |
| Equivalent form | — | `useMemo(() => fn, deps)` |

Use `useMemo` when you need to cache a computed value (a filtered array, a derived number, an object). Use `useCallback` specifically when you need to cache a function reference (an event handler passed to a memoized child, an effect dependency). The most common mistake is using `useMemo(() => expensiveCall(), deps)` correctly but then also wrapping trivial one-line handlers in `useCallback` reflexively, everywhere, without a memoized consumer that benefits from it.

### Memoization worth it vs premature optimization

| Aspect | Worth memoizing | Premature optimization |
|---|---|---|
| Computation cost | Genuinely expensive (large array sort/filter, heavy math, complex derived state) | Cheap (a `+`, a short array `.map`, string concatenation) |
| Consumer | Passed to a `React.memo` child, or used in another hook's dependency array | Not passed anywhere that cares about referential stability |
| Effect on code | Prevents a measurable, profiled re-render or recomputation cost | Adds a dependency array to track and a small constant overhead, for no measurable gain |

Reach for `useMemo`/`useCallback` when you've identified (ideally via the React DevTools profiler) an actual expensive computation or unnecessary re-render chain. The most common mistake is memoizing everything defensively "just in case," which adds maintenance burden (every memoized value needs a correct, exhaustive dependency array) without a measurable performance benefit.

### Referential equality check: React.memo (shallow prop comparison) vs useEffect (dependency array)

| Aspect | `React.memo` | `useEffect` dependency array |
|---|---|---|
| What it compares | All props, shallowly, by default | Only the values you explicitly list |
| Consequence of a "new reference every render" prop/dep | Component re-renders anyway (memo defeated) | Effect re-runs every render (cleanup + setup repeats) |
| Fix | Memoize the object/function/array passed as that prop | Memoize the object/function/array in the dependency list, or avoid depending on the whole object |

Both systems rely on the same underlying assumption: unchanged data should have unchanged references. The most common mistake in both cases is passing an inline object/array/function literal (`{}`, `[]`, `() => {}`) as a prop or dependency, which is guaranteed to be "new" on every render and defeats whatever equality check is downstream, whether that's `React.memo`'s prop diffing or `useEffect`'s dependency comparison.
