# Interview Questions — `useEffect` & Lifecycle

**Q: When does `useEffect`'s callback actually run relative to rendering?**
It runs after React commits the render's output to the DOM and the browser has had a chance to paint — never during the render/function-body execution itself. This means effects can safely read the real DOM (e.g., measure an element) and never block the initial paint of a frame, unlike `useLayoutEffect`.

**Q: What's the difference between omitting the dependency array, passing `[]`, and passing `[a, b]`?**
No array means the effect runs after every single render, unconditionally. An empty array means it runs exactly once, right after the initial mount, and never again. An array with values means it runs after mount and then again any time one of those listed values differs (by `Object.is`) from its value in the previous render.

**Q: When does an effect's cleanup function run?**
Twice in different circumstances: right before the effect re-runs due to a dependency changing (cleanup for the *old* values happens first, then the new effect body runs with the new values), and once more when the component unmounts entirely. This "clean up, then re-run" pattern lets each effect execution be treated as fully self-contained.

**Q: What is a stale closure in the context of `useEffect`, and how does it happen?**
It's when a function created inside an effect (e.g., an interval/timeout callback or an event listener) closes over props/state values as they existed at the time the effect ran, and that effect doesn't re-run when those values later change — so the callback keeps operating on outdated data indefinitely. It happens most commonly when a dependency is read inside the effect but omitted from the dependency array.

**Q: Given a stale closure bug where an interval logs an outdated `count`, what are two ways to fix it?**
Either add `count` to the dependency array (so the effect — and its interval — is recreated with a fresh closure whenever `count` changes), or, more idiomatically for accumulator-style updates, avoid needing `count` in the closure at all by using the functional updater form `setCount(c => c + 1)`, which always operates on the true latest state regardless of what the closure captured.

**Q: Why can an object or array literal as a dependency cause an infinite re-render loop?**
Because a new object/array literal is a new reference on every render, even if its contents are identical. If that object is listed as a dependency, React's per-dependency `Object.is` comparison sees a "change" on every render, re-running the effect every time — and if the effect also triggers a state update (directly or via a fetch that eventually calls `setState`), that causes another render, recreating the object again, and the cycle repeats indefinitely.

**Q: How do you fix an effect that infinitely loops because of an unstable object/function dependency?**
Prefer depending on the primitive values that actually matter (destructure the object's fields into the dependency array instead of the object itself) or construct the object inside the effect body so it's not a dependency at all. If the object genuinely must exist outside the effect and be shared, wrap its creation in `useMemo` (or the function in `useCallback`) keyed on its own primitive inputs so its reference stays stable across renders unless those inputs change.

**Q: What's the difference between `useEffect` and `useLayoutEffect`?**
They share the same API, but `useLayoutEffect` runs synchronously immediately after DOM mutations are applied and *before* the browser paints, blocking the paint until it completes; `useEffect` runs asynchronously after paint. Use `useLayoutEffect` only when you need to measure the DOM and synchronously adjust something before the user sees a frame with the wrong layout — otherwise `useEffect` is the correct default since it doesn't delay rendering.

**Q: Is it accurate to think of `useEffect(fn, [])` as equivalent to `componentDidMount`?**
Only loosely, and this framing causes bugs. The more accurate mental model is that an effect synchronizes the component with something external based on the reactive values it reads, and the dependency array declares what those values are — not "when in the lifecycle should this run." Thinking in lifecycle terms tempts people to under-specify the dependency array to control timing, which produces stale closures; thinking in synchronization terms leads to correctly exhaustive dependency arrays.

**Q: Why might the `react-hooks/exhaustive-deps` ESLint rule flag a dependency you don't want to add, and what should you generally do about it?**
It flags any reactive value read inside the effect that's missing from the dependency array, because that's a very common source of stale-closure bugs — even if you "know" it's fine in a particular case, the rule can't verify that. The generally correct response is to fix the underlying reason you don't want to add it: use the functional updater form to avoid needing state, wrap unstable objects/functions in `useMemo`/`useCallback`, or move value creation inside the effect — not to add an eslint-disable comment, which should be a last resort with a clear justification.

**Q: If an effect performs an async fetch and the component unmounts (or the dependency changes) before the fetch resolves, what problem can occur, and how do you guard against it?**
Calling a state setter after the component has unmounted, or after a newer request has superseded an older one, can apply a stale response's data on top of newer state — a race condition where an older, slower request "wins" and overwrites the correct result. The standard guard is a boolean flag (or an `AbortController`) set in the cleanup function so the async callback checks whether it's still valid before calling the setter.

```jsx
React.useEffect(() => {
  let cancelled = false;
  fetchData(id).then(data => {
    if (!cancelled) setData(data);
  });
  return () => { cancelled = true; };
}, [id]);
```
