// Requires: @reduxjs/toolkit
// One well-designed action for a logical "checkout submitted" event, instead of four dispatches.

import { createSlice, configureStore } from '@reduxjs/toolkit';

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: { shippingAddress: null, billingAddress: null, paymentMethod: null, status: 'idle' },
  reducers: {
    // BEFORE (fragmented) would have been 4 separate reducer cases dispatched separately.
    // AFTER: one action, one atomic transition, no intermediate half-submitted state observable.
    checkoutSubmitted(state, action) {
      state.shippingAddress = action.payload.shippingAddress;
      state.billingAddress = action.payload.billingAddress;
      state.paymentMethod = action.payload.paymentMethod;
      state.status = 'submitted';
    },
  },
});

const store = configureStore({ reducer: { checkout: checkoutSlice.reducer } });

store.dispatch(
  checkoutSlice.actions.checkoutSubmitted({
    shippingAddress: '123 Main St',
    billingAddress: '123 Main St',
    paymentMethod: 'card_ending_4242',
  })
);

console.log(store.getState().checkout);
// { shippingAddress: '123 Main St', billingAddress: '123 Main St', paymentMethod: 'card_ending_4242', status: 'submitted' }
// One dispatch, one DevTools action-log entry, zero window where only some fields were set.
