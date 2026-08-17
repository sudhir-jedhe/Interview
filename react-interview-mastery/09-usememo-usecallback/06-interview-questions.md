# Interview Questions: useMemo & useCallback

**Q: What does `useMemo` do, exactly?**

It caches the return value of a function across renders, only recomputing when one of the values in its dependency array changes. On renders where the dependencies are unchanged, React skips calling the function and returns the previously cached value.

```jsx
const filtered = useMemo(() => items.filter((i) => i.active), [items]);
```

---

**Q: What does `useCallback` do, and how does it relate to `useMemo`?**

It returns a stable function reference across renders as long as its dependency array hasn't changed, instead of the function being recreated fresh on every render (the default behavior for any function declared inside a component body). `useCallback(fn, deps)` is exactly equivalent to `useMemo(() => fn, deps)` — it's implemented as a thin convenience wrapper around that pattern.

---

**Q: Why does referential equality matter in React?**

Because JavaScript compares objects, arrays, and functions by reference, not structural content — two objects with identical contents are still `!==` if they're different instances. React leans on this for optimization: `React.memo` does a shallow prop comparison to decide whether to skip a re-render, and `useEffect`/`useMemo`/`useCallback` compare dependency arrays by reference to decide whether to rerun. If you pass a freshly created object/array/function every render, these checks always see "something changed," defeating the optimization even when nothing meaningfully did.

---

**Q: Give a concrete example of an inline prop defeating `React.memo`.**

```jsx
const Child = React.memo(function Child({ onClick }) {
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>{count}</button>
      <Child onClick={() => console.log('clicked')} /> {/* new function every render */}
    </>
  );
}
```

`onClick` is a new arrow function every time `Parent` renders, so `Child`'s shallow prop comparison always sees a change and re-renders anyway, regardless of `React.memo`. Wrapping the handler in `useCallback` fixes it.

---

**Q: Is memoizing every value and function in a component always a good idea?**

No. Memoization has its own cost — storing the cached value/deps and comparing the dependency array on every render — and for cheap computations or handlers that aren't consumed by a `React.memo` child or another hook's dependency array, that overhead can exceed the cost of just recomputing/recreating the value. It also adds a dependency array that must be kept exhaustive and correct, which is itself a common source of stale-value bugs. Reach for it when profiling shows an actual expensive computation or unnecessary re-render chain, not reflexively.

---

**Q: What's the classic bug with an incomplete dependency array in `useMemo`/`useCallback`?**

A "stale closure" — if the memoized function/computation reads a variable that isn't listed in the dependency array, the cached result (or function) keeps using the old value from whenever it was last recomputed, silently ignoring subsequent updates to that variable.

```jsx
const total = useMemo(
  () => items.reduce((s, i) => s + i.price, 0) * (1 + taxRate),
  [items] // BUG: taxRate is used but missing — total goes stale when taxRate changes
);
```

The `eslint-plugin-react-hooks` `exhaustive-deps` rule catches most of these automatically and should be treated as a strong signal, not a suggestion to silence.

---

**Q: What happens if you list an inline object literal as a `useMemo`/`useCallback` dependency?**

The memoization is effectively defeated, because the object is a new reference on every render, so the dependency comparison always reports "changed," forcing recomputation every time regardless of whether the object's actual contents changed.

```jsx
const results = useMemo(() => search(query, { caseSensitive: false }), [query, { caseSensitive: false }]);
// the inline object dependency is new every render — useMemo never actually caches anything
```

The fix is to hoist constant objects outside the component, or wrap them in their own `useMemo`.

---

**Q: Are `useMemo` and `useCallback` guaranteed to always return the cached value/function, or can React discard the cache?**

They're not a hard guarantee in the strictest sense — React's documentation notes that in certain circumstances (e.g., freeing memory for offscreen components) React may choose to discard a memoized value and recompute it. In practice, for typical mounted components you can treat the memoization as reliable, but you should not rely on `useMemo` as a substitute for `useRef` when you need a value to be guaranteed stable/mutable across renders (e.g., an instance variable) — `useRef` is the correct tool for that guarantee.

---

**Q: How would you decide whether to add `useMemo` around a given computation?**

Ask: is this computation expensive enough to matter (profile if unsure), and is the result consumed somewhere that benefits from referential stability (a `React.memo` child, another hook's dependency array)? If both are true, memoize it with a complete, accurate dependency array. If the computation is cheap and nothing downstream cares about reference identity, skip it — the added complexity isn't worth it.

---

**Q: What's the practical difference between writing `useCallback(fn, deps)` and `useMemo(() => fn, deps)`?**

None in terms of runtime behavior — they produce the identical memoized function reference under the identical rules. The difference is purely idiomatic: `useCallback` communicates "I'm memoizing a function" more directly and is the conventional choice for that case, while `useMemo` is reserved for memoizing computed values. Using `useMemo` to memoize a function works but reads as unconventional in review.

---

**Q: Does wrapping a component in `React.memo` do anything if its props include a callback that changes every render?**

No meaningful benefit — `React.memo`'s shallow comparison will see the changed callback prop as "different" every time and re-render the component anyway, exactly as if `React.memo` weren't applied at all (for that render trigger). `React.memo` and stable prop references (via `useMemo`/`useCallback` in the parent) need to be used together; neither one alone solves the unnecessary re-render problem.
