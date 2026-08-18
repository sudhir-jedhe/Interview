# Scenario: A Product List Page Freezes for a Moment on Every Keystroke

A product catalog page lets users filter by category, price range, and a free-text search, and sort by name/price/popularity — applied client-side against an in-memory list of ~5,000 products already loaded into Redux state. Typing in the search box causes a visible, janky pause on every keystroke. Profiling shows the culprit: a plain (non-memoized) selector doing `.filter(...).filter(...).filter(...).sort(...)` over all 5,000 items, called from `useSelector`, re-running on every render — including renders triggered by totally unrelated state changes elsewhere in the app (a live notification badge updating in the header, for instance).

**Approach:** Memoize the derivation with `createSelector`, composed as a small pipeline so each filtering step only recomputes when its actual relevant inputs change, and make sure the *inputs themselves* (the filter state object) aren't recreated on every render at the call site.

```javascript
import { createSelector } from '@reduxjs/toolkit';

const selectAllProducts = (state) => state.catalog.products;
const selectCategory = (state) => state.catalog.filters.category;
const selectPriceRange = (state) => state.catalog.filters.priceRange; // [min, max]
const selectSearchQuery = (state) => state.catalog.filters.searchQuery;
const selectSortBy = (state) => state.catalog.sortBy;

const selectCategoryFiltered = createSelector(
  [selectAllProducts, selectCategory],
  (products, category) => (category === 'all' ? products : products.filter((p) => p.category === category))
);

const selectPriceFiltered = createSelector(
  [selectCategoryFiltered, selectPriceRange],
  (products, [min, max]) => products.filter((p) => p.price >= min && p.price <= max)
);

const selectSearchFiltered = createSelector(
  [selectPriceFiltered, selectSearchQuery],
  (products, query) =>
    query ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())) : products
);

export const selectVisibleProducts = createSelector(
  [selectSearchFiltered, selectSortBy],
  (products, sortBy) => {
    const sorted = [...products]; // never sort the upstream array in place
    if (sortBy === 'price') sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === 'popularity') sorted.sort((a, b) => b.popularity - a.popularity);
    else sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }
);
```

```jsx
function ProductList() {
  // selectVisibleProducts only recomputes when catalog.products, filters, or
  // sortBy actually change — an unrelated header badge updating no longer
  // triggers this component to re-run the full filter/sort pipeline at all.
  const products = useSelector(selectVisibleProducts);
  return <ul>{products.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

The staged composition matters, not just wrapping the whole thing in one `createSelector`: typing in the search box only invalidates `selectSearchFiltered` and `selectVisibleProducts` (the sort step) — it doesn't force `selectCategoryFiltered` or `selectPriceFiltered` to recompute, since their own inputs (`category`, `priceRange`) haven't changed. If category and price filtering are the more expensive steps (larger reduction of the working set) and search/sort are comparatively cheap on an already-narrowed list, this staging concentrates the remaining per-keystroke cost on the cheapest part of the pipeline. It's also worth confirming the filter state itself (`state.catalog.filters`) is only ever replaced by a reducer when it actually changes — if the reducer handling the search box's `onChange` accidentally created a brand-new `filters` object on every keystroke even when only `searchQuery` changed inside it, that alone wouldn't defeat this pipeline (each input selector reads one specific field, not the whole `filters` object), which is itself a small but deliberate design choice worth calling out in review.
