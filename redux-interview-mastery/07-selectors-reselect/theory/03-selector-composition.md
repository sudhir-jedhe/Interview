# Selector Composition: Building Complex Selectors from Simple Ones

One of `createSelector`'s most useful properties, beyond memoization itself, is that its output is just another selector — a plain function taking `state` and returning a value. That means memoized selectors can be used as **input selectors** to other `createSelector` calls, letting you build a pipeline of small, independently understandable, independently testable selectors instead of one large, tangled derivation.

```javascript
import { createSelector } from '@reduxjs/toolkit';

// Layer 1: simple, non-memoized "raw state" selectors
const selectCartItems = (state) => state.cart.items;
const selectDiscountRate = (state) => state.promotions.activeDiscountRate;
const selectSearchQuery = (state) => state.cart.searchQuery;

// Layer 2: memoized selectors built from layer 1
const selectFilteredItems = createSelector(
  [selectCartItems, selectSearchQuery],
  (items, query) =>
    query ? items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase())) : items
);

const selectSubtotal = createSelector(
  [selectFilteredItems],
  (items) => items.reduce((sum, i) => sum + i.price * i.quantity, 0)
);

// Layer 3: composed from layer 2 selectors — createSelector selectors are valid inputs too
const selectDiscountedTotal = createSelector(
  [selectSubtotal, selectDiscountRate],
  (subtotal, rate) => subtotal * (1 - rate)
);
```

Each layer only recomputes when the specific inputs it actually depends on change: `selectFilteredItems` recomputes only when `cart.items` or `cart.searchQuery` change; `selectSubtotal` only recomputes when the *filtered* list reference changes (which itself only changes when its own inputs change); `selectDiscountedTotal` only recomputes when either the subtotal or the discount rate changes. Changing an unrelated piece of state — say, a user's display name — never touches this chain at all, because none of these selectors read anything from `state.user`.

## Why compose instead of writing one big selector

A single selector doing everything —

```javascript
// Harder to test, harder to reuse, and the memoization granularity is coarse
const selectDiscountedTotal = createSelector(
  [selectCartItems, selectSearchQuery, selectDiscountRate],
  (items, query, rate) => {
    const filtered = query ? items.filter(/* ... */) : items;
    const subtotal = filtered.reduce(/* ... */);
    return subtotal * (1 - rate);
  }
);
```

— works, but loses two things composition preserves: **reuse** (if some other part of the UI needs just `selectFilteredItems` or just `selectSubtotal`, those aren't separately available; you'd duplicate logic or export intermediate values awkwardly), and **testability at the right granularity** (you can unit test `selectFilteredItems`'s filtering logic in isolation from the discount math, and vice versa, rather than needing a full-shaped state object to test any of it). Composition also makes the code read like the domain: "the discounted total is the subtotal, discounted" is a one-line, self-documenting composition of two other clearly-named things, rather than one function whose comment has to explain three unrelated concerns at once.

The performance model stays intuitive too: think of it as a dependency graph, not a flat list — each memoized selector only recomputes if something upstream of it (that it actually reads) changed, and that recomputation propagates only as far downstream as necessary.
