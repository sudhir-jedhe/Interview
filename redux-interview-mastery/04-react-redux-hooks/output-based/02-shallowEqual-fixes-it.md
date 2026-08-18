# Output: Does adding `shallowEqual` fix the previous re-render problem?

```jsx
import { useSelector, shallowEqual } from 'react-redux';

function ActiveItems() {
  const activeItems = useSelector(
    (state) => state.cart.items.filter((item) => item.active),
    shallowEqual
  );
  console.log('render');
  return <span>{activeItems.length}</span>;
}

// Same 5 unrelated dispatches as before, none touching state.cart.
```

**Answer:** `'render'` logs only once (the initial mount) — the 5 unrelated dispatches no longer trigger a re-render.

**Why:** `shallowEqual` compares the *previous* and *new* selector results one level deep — for an array, that means checking each element pairwise with `===`, rather than comparing the array references themselves. Since `state.cart.items` never changed across those 5 dispatches, `.filter(...)` produces a new array reference each time, but every element inside it is the exact same object reference as before — so `shallowEqual` correctly reports "no meaningful change," and `useSelector` skips the re-render. Note this doesn't eliminate the selector function itself re-running (the `.filter` call still executes on every dispatch — only the *re-render* is avoided), which matters for genuinely expensive selectors; see the companion note on `reselect`/`createSelector` for avoiding redundant computation too, not just redundant renders.
