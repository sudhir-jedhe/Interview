# Problem 1: Refactor a Stored "Total Price" Field Into a Selector

## Task

Given this cart slice, which stores and manually maintains `totalPrice`:

```javascript
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], totalPrice: 0 },
  reducers: {
    itemAdded(state, action) {
      state.items.push(action.payload);
      state.totalPrice += action.payload.price * action.payload.quantity;
    },
    itemQuantityChanged(state, action) {
      const item = state.items.find((i) => i.id === action.payload.id);
      const oldSubtotal = item.price * item.quantity;
      item.quantity = action.payload.quantity;
      state.totalPrice += item.price * item.quantity - oldSubtotal;
    },
    itemRemoved(state, action) {
      const item = state.items.find((i) => i.id === action.payload.id);
      state.totalPrice -= item.price * item.quantity;
      state.items = state.items.filter((i) => i.id !== action.payload.id);
    },
  },
});
```

Refactor this so `totalPrice` is never stored, is computed via a memoized selector, and cannot drift out of sync regardless of which reducer case runs or in what order.

## Solution

```javascript
import { createSlice, createSelector, configureStore } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] }, // no totalPrice field
  reducers: {
    itemAdded(state, action) {
      state.items.push(action.payload);
    },
    itemQuantityChanged(state, action) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
    },
    itemRemoved(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload.id);
    },
  },
});

const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

export const { itemAdded, itemQuantityChanged, itemRemoved } = cartSlice.actions;
export default cartSlice.reducer;

// Verify:
const store = configureStore({ reducer: { cart: cartSlice.reducer } });
store.dispatch(itemAdded({ id: 1, price: 10, quantity: 2 }));
store.dispatch(itemAdded({ id: 2, price: 5, quantity: 3 }));
console.log(selectCartTotal(store.getState())); // 35

store.dispatch(itemQuantityChanged({ id: 1, quantity: 5 }));
console.log(selectCartTotal(store.getState())); // 65 — correctly recomputed, no manual bookkeeping

store.dispatch(itemRemoved({ id: 2 }));
console.log(selectCartTotal(store.getState())); // 50
```

## Why this is strictly better

Every reducer case is now shorter and can't get the total wrong, because none of them touch a `totalPrice` field at all — there's nothing left to forget. `selectCartTotal` is memoized via `createSelector`, so calling it repeatedly with an unchanged `items` array (e.g., after a dispatch that only touched an unrelated slice) returns the cached reference without recomputing, preserving the re-render-avoidance benefit alongside the correctness benefit.
