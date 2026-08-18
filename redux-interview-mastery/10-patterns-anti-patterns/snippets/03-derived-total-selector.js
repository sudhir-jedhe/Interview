// Requires: @reduxjs/toolkit
// A cart slice with NO stored totalPrice field, plus a memoized selector that derives it.

import { createSlice, createSelector, configureStore } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    itemAdded(state, action) { state.items.push(action.payload); },
    itemQuantityChanged(state, action) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
    },
  },
});

const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

const store = configureStore({ reducer: { cart: cartSlice.reducer } });
store.dispatch(cartSlice.actions.itemAdded({ id: 'sku1', price: 10, quantity: 2 }));
store.dispatch(cartSlice.actions.itemAdded({ id: 'sku2', price: 5, quantity: 1 }));

console.log('total:', selectCartTotal(store.getState())); // 25 — always correct, never hand-maintained
