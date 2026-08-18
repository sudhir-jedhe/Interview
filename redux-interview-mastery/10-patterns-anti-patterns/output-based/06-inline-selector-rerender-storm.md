## How many times does `ExpensiveList` re-render after 5 unrelated `themeToggled` dispatches?

```jsx
function ExpensiveList() {
  const sortedActiveItems = useSelector((state) =>
    state.items
      .filter((item) => item.active)
      .sort((a, b) => a.priority - b.priority)
  );
  console.log('ExpensiveList rendered');
  return <ul>{sortedActiveItems.map((i) => <li key={i.id}>{i.name}</li>)}</ul>;
}

// Elsewhere: 5 dispatches of { type: 'ui/themeToggled' }, which only affects state.ui.theme,
// never state.items.
```

**Answer:** `ExpensiveList` re-renders all 5 times — once per `themeToggled` dispatch — despite `state.items` never changing across any of them.

**Why:** The selector passed to `useSelector` is an inline arrow function containing `.filter(...).sort(...)`, both of which always allocate and return a brand-new array, regardless of whether the input data changed. `useSelector` re-runs this selector on every dispatched action (that part is cheap and necessary — it has to check), but because the selector itself has no memoization, it returns a new array reference every single time it's called, even when `state.items` is identical to the previous call. `useSelector`'s default `===` comparison then sees "a new reference" and concludes "this changed," forcing a re-render — five times, for five actions that had nothing to do with this component's data. The fix is wrapping this exact logic in `createSelector` with `state.items` as the sole input selector: on each of the 5 dispatches, `createSelector` checks whether `state.items` changed by reference (it didn't — `themeToggled` only touched `state.ui`), and since it didn't, returns the cached array from last time without re-running `.filter().sort()` at all, and `useSelector` correctly sees no change and skips the re-render.
