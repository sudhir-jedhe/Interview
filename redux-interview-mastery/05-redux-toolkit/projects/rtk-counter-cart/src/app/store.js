import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import cartReducer from '../features/cart/cartSlice';

// configureStore wires both slices together, auto-adds the thunk middleware,
// Redux DevTools support, and dev-only serializability/immutability checks.
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    cart: cartReducer,
  },
});

export default store;
