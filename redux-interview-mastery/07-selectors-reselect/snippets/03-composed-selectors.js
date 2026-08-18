// Composing memoized selectors from other memoized selectors.
import { createSelector } from '@reduxjs/toolkit';

const selectCartItems = (state) => state.cart.items;
const selectSearchQuery = (state) => state.cart.searchQuery;
const selectDiscountRate = (state) => state.promotions.rate;

export const selectFilteredItems = createSelector(
  [selectCartItems, selectSearchQuery],
  (items, query) =>
    query ? items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase())) : items
);

export const selectSubtotal = createSelector(
  [selectFilteredItems],
  (items) => items.reduce((sum, i) => sum + i.price * i.quantity, 0)
);

export const selectDiscountedTotal = createSelector(
  [selectSubtotal, selectDiscountRate],
  (subtotal, rate) => Number((subtotal * (1 - rate)).toFixed(2))
);

if (require.main === module) {
  const state = {
    cart: {
      items: [
        { name: 'Widget', price: 10, quantity: 2 },
        { name: 'Gadget', price: 25, quantity: 1 },
      ],
      searchQuery: '',
    },
    promotions: { rate: 0.1 },
  };

  console.log(selectFilteredItems(state).length); // 2
  console.log(selectSubtotal(state)); // 45
  console.log(selectDiscountedTotal(state)); // 40.5
}
