## Does this component re-render when an unrelated slice updates?

```javascript
const selectFilters = (state) => state.search.filters; // { category, inStockOnly }

function ProductFilters() {
  // NOTE: no createSelector here — a raw inline selector
  const filters = useSelector((state) => ({
    category: state.search.filters.category,
    inStockOnly: state.search.filters.inStockOnly,
  }));
  // ...
}
```

Assume `state.search.filters` itself never changes reference unless the user actually changes a filter, and some unrelated slice (`state.notifications`) updates frequently.

**Answer:** Yes — `ProductFilters` re-renders on every dispatch that causes *any* re-render pass through `useSelector`, including ones only touching `state.notifications`, even though `filters.category`/`filters.inStockOnly`'s actual values never changed.

**Why:** The inline selector `(state) => ({ category: ..., inStockOnly: ... })` constructs a **brand-new object literal every time it's called**, regardless of whether the underlying values changed. `useSelector`'s default comparison is `===` (reference equality) between the previous return value and the new one — two different object literals with identical field values are never `===`, so `useSelector` always concludes "the selected value changed" and triggers a re-render, on every single dispatched action anywhere in the connected app (since `useSelector` re-invokes the selector on every action to check for changes).

There are two independent, valid fixes here, worth distinguishing: **(1)** wrap the selector in `createSelector` so the *same* object reference is returned when neither `category` nor `inStockOnly` changed — the standard fix and the one this topic focuses on; or **(2)** pass `shallowEqual` (from `react-redux`) as `useSelector`'s second argument, which compares the returned object's fields shallowly instead of by reference, avoiding the need for memoization entirely for a small, flat object like this one. `createSelector` is generally preferred when the derivation itself is nontrivial or reused elsewhere; `shallowEqual` is a lighter-weight fix when the only issue is "this inline selector returns a fresh object with the same shallow contents" and there's no actual expensive computation to cache.
