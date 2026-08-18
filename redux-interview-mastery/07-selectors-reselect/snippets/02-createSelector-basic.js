// A memoized selector: only recomputes the filter when its input actually changes.
import { createSelector } from '@reduxjs/toolkit'; // re-exports reselect's createSelector

const selectCartItems = (state) => state.cart.items;

export const selectInStockItems = createSelector(
  [selectCartItems],
  (items) => items.filter((item) => item.inStock)
);

if (require.main === module) {
  const state1 = { cart: { items: [{ id: 1, inStock: true }, { id: 2, inStock: false }] } };

  const result1 = selectInStockItems(state1);
  const result2 = selectInStockItems(state1); // same state object -> cache hit
  console.log(result1 === result2); // true — no recomputation happened

  const state2 = { cart: { items: state1.cart.items } }; // items array reference unchanged
  const result3 = selectInStockItems(state2);
  console.log(result3 === result1); // true — input selector's output is === last time

  const state3 = { cart: { items: [...state1.cart.items] } }; // new array reference (same contents)
  const result4 = selectInStockItems(state3);
  console.log(result4 === result1); // false — input reference changed, so it recomputed
}
