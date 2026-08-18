## What does `selectExpensiveInStock(state, 20)` return, and how many input selectors ran?

```javascript
const selectItems = (state) => state.items;
const selectMinPriceArg = (state, minPrice) => minPrice;

const selectExpensiveInStock = createSelector(
  [selectItems, (state) => state.filters.onlyInStock, selectMinPriceArg],
  (items, onlyInStock, minPrice) => {
    let result = items.filter((i) => i.price >= minPrice);
    if (onlyInStock) result = result.filter((i) => i.inStock);
    return result;
  }
);

const state = {
  items: [
    { name: 'A', price: 15, inStock: true },
    { name: 'B', price: 25, inStock: false },
    { name: 'C', price: 30, inStock: true },
  ],
  filters: { onlyInStock: true },
};

console.log(selectExpensiveInStock(state, 20).map((i) => i.name));
```

**Answer:** `['C']`. All three input selectors run on every call (that's unconditional — `createSelector` always evaluates every input selector to compare against the previous cached inputs; it can't skip *some* inputs). Item `'B'` is excluded because although its price (25) meets the `minPrice` threshold (20), it's not in stock and `onlyInStock` is `true`.

**Why:** This tests whether you understand that `createSelector`'s input selectors can be a mix of simple state readers (`selectItems`, the inline `state.filters.onlyInStock` reader) and selectors that read the *extra arguments* passed to the outer selector (`selectMinPriceArg`, which ignores `state` entirely and just returns whatever second argument was passed in) — all positional arguments passed to the outer memoized selector (`state, 20` here) are forwarded to *every* input selector, not routed to a specific one. `selectMinPriceArg(state, 20)` returns `20` regardless of `state`'s contents; `selectItems(state, 20)` simply ignores the second argument since it only destructures `state`. The result function then receives the three input selectors' outputs, in the order the input selectors were listed, as three separate parameters — `items`, `onlyInStock`, `minPrice` — matching their declaration order, not the order or number of arguments the caller happened to pass to the outer selector.
