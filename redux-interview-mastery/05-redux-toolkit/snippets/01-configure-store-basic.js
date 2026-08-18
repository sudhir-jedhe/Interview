// Basic configureStore setup wiring two slice reducers together.
// Run mentally: store.getState() => { counter: { value: 0 }, cart: { items: [], total: 0 } }

import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import cartReducer from '../features/cart/cartSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    cart: cartReducer,
  },
  // devTools defaults to true in development, false in production automatically
});

console.log(store.getState());
// { counter: { value: 0 }, cart: { items: [], total: 0 } }

store.subscribe(() => console.log('state changed:', store.getState()));

export default store;
