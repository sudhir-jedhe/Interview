// Combining createSelector (reselect) with useSelector to avoid both
// redundant computation AND redundant re-renders for an expensive derivation.
import React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit'; // RTK re-exports createSelector

const selectCartItems = (state) => state.cart.items;

const selectCartTotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => sum + item.price * item.qty, 0)
  // only recomputes when `state.cart.items` itself changes reference;
  // returns the same cached number reference otherwise (irrelevant for a
  // primitive, but the pattern matters more for object/array outputs)
);

function CartTotal() {
  const total = useSelector(selectCartTotal);
  return <div>Total: ${total.toFixed(2)}</div>;
}

export default CartTotal;
