# Scenario: A Selector That Works in Testing but "Breaks Memoization" in Staging

A team builds a filterable/sortable orders dashboard, ships it, and it passes all functional QA. In staging, with realistic data volume, a performance review flags that the memoized `selectVisibleOrders` selector is recomputing on nearly every render — logging its "computing..." debug line dozens of times per second while a user just scrolls the page (no filters touched). Locally, with a small hardcoded test dataset, the same selector appeared to memoize correctly.

**Approach:** Investigate the call site, not the selector definition itself — a `createSelector` selector that's *correctly written* can still fail to memoize if something upstream keeps producing new input references, which is exactly what a closer look reveals here.

```javascript
// The selector itself, in isolation, is fine:
const selectVisibleOrders = createSelector(
  [(state) => state.orders.list, (state) => state.orders.filters],
  (orders, filters) => applyFilters(orders, filters)
);
```

```javascript
// The actual bug, found in the reducer that owns `orders.filters`:
const ordersSlice = createSlice({
  name: 'orders',
  initialState: { list: [], filters: { status: 'all', assignee: null } },
  reducers: {
    scrollPositionNoted(state, action) {
      // a well-intentioned but misplaced piece of state, tucked into `filters`
      // by a previous contributor who didn't want to add a new top-level field
      state.filters = { ...state.filters, lastScrollY: action.payload };
    },
  },
});
```

The dashboard dispatches `scrollPositionNoted` on scroll (for a "remember scroll position on navigate-back" feature) — and because that reducer does `state.filters = { ...state.filters, lastScrollY: ... }`, it produces a **brand-new `filters` object reference on every scroll event**, even though none of the fields `applyFilters` actually cares about (`status`, `assignee`) changed. `selectVisibleOrders`'s input selector `(state) => state.orders.filters` faithfully returns this new reference every time, `createSelector` correctly sees "input changed" (by its reference-equality contract, which is working exactly as designed), and dutifully recomputes — the selector isn't buggy, the *data it depends on* was structured incorrectly.

The fix is to stop conflating "filter criteria" with "unrelated per-scroll UI state" in the same object: move `lastScrollY` to its own field, sibling to `filters`, not nested inside it.

```javascript
// Fixed: scroll position lives outside `filters`, so scrolling never touches
// the `filters` reference that selectVisibleOrders actually depends on.
const ordersSlice = createSlice({
  name: 'orders',
  initialState: { list: [], filters: { status: 'all', assignee: null }, lastScrollY: 0 },
  reducers: {
    scrollPositionNoted(state, action) {
      state.lastScrollY = action.payload; // filters object reference is now untouched
    },
  },
});
```

The broader lesson for a senior engineer reviewing a "memoization isn't working" report: check whether the *input selector's source data* is being needlessly replaced by an unrelated reducer before assuming the `createSelector` call itself is wrong. State shape decisions — specifically, grouping unrelated fields into the same object — directly determine how often derived-selector inputs "change" by reference, independent of anything in the selector's own code.
