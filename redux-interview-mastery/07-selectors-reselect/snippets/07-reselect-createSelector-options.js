// Customizing createSelector's equality check and cache size via createSelectorCreator / options.
import { createSelector, createSelectorCreator, lruMemoize } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';

const selectFilters = (state) => state.search.filters; // e.g. { category, minPrice, maxPrice }

// Default: reference (===) equality on inputs — a NEW filters object every render
// (even with identical field values) would defeat memoization here.
const selectResultsDefault = createSelector(
  [selectFilters, (state) => state.products.list],
  (filters, products) => products.filter(/* ... apply filters ... */ () => true)
);

// A selector creator using shallow equality instead of reference equality for inputs —
// useful when an input selector might return a fresh object with the same field values.
const createShallowEqualSelector = createSelectorCreator(lruMemoize, shallowEqual);

const selectResultsShallow = createShallowEqualSelector(
  [selectFilters, (state) => state.products.list],
  (filters, products) =>
    products.filter(
      (p) =>
        (!filters.category || p.category === filters.category) &&
        p.price >= (filters.minPrice ?? 0) &&
        p.price <= (filters.maxPrice ?? Infinity)
    )
);

// A selector with a larger-than-default cache size — useful for parameterized
// selectors called with a small, bounded set of distinct argument values
// (an alternative to the factory pattern when the argument set is known/small).
const selectItemsByStatus = createSelector(
  [(state) => state.items.list, (state, status) => status],
  (items, status) => items.filter((i) => i.status === status),
  { memoizeOptions: { maxSize: 10 } } // remembers up to 10 distinct (items, status) pairs
);

export { selectResultsDefault, selectResultsShallow, selectItemsByStatus };
