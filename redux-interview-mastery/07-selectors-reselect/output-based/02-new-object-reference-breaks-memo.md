## Why does this component re-render on every dispatch, even unrelated ones?

```javascript
const selectVisibleTodos = createSelector(
  [(state) => state.todos, (state) => state.filter],
  (todos, filter) => {
    if (filter === 'all') return todos;
    return todos.filter((t) => (filter === 'completed' ? t.completed : !t.completed));
  }
);

function TodoList() {
  // an object literal is created fresh on every render of TodoList itself
  const options = { includeArchived: false };
  const visibleTodos = useSelector((state) => selectVisibleTodos(state, options));
  // ...
}
```

**Answer:** `TodoList` re-renders on every single dispatched action in the entire app, not just ones affecting `todos`/`filter` — the memoization is completely defeated, even though `selectVisibleTodos` itself looks correctly memoized.

**Why:** Look closely at the call site: `selectVisibleTodos(state, options)` passes `options` as a *second argument*, but `selectVisibleTodos`'s input selectors are `[(state) => state.todos, (state) => state.filter]` — neither one reads the second argument at all, so `options` is actually inert and irrelevant to `createSelector`'s memoization here... which means this particular example's `selectVisibleTodos` call would actually still memoize correctly based on `state.todos`/`state.filter` alone. The *real* bug is the inline arrow function passed to `useSelector`: `(state) => selectVisibleTodos(state, options)` is itself a brand-new function on every render, which is harmless by itself — `useSelector` calls it and compares the *return value*, not the function reference. So actually the memoized selector correctly returns the same array reference across renders when `todos`/`filter` are unchanged, and `TodoList` should NOT re-render unnecessarily here.

This question is deliberately included as a trap: the presence of `options = { includeArchived: false }` being recreated every render looks alarming, but it's a red herring *because it's never read by any input selector* — an unused, ignored second argument doesn't affect memoization. The actual lesson: always check whether a "suspicious-looking new object" is actually consumed by an input selector before assuming it breaks memoization. If `selectVisibleTodos`'s input selectors instead included something like `(state, options) => options`, passing a fresh `options` object every render genuinely would break the cache — that's the version worth being wary of, and precisely why parameterized selectors that take object arguments need those objects to be memoized (e.g., via `useMemo`) at the call site, not just the selector itself.
