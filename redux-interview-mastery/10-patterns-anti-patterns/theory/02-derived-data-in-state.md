# Anti-Pattern: Storing Derived/Computed Data in State

A subtler but extremely common mistake: storing a value in Redux state that's entirely computable from other values already in state. The most classic example is a cart's `totalPrice` field, updated by every reducer case that adds, removes, or edits a line item.

## Why this goes wrong

```javascript
// BEFORE: totalPrice is derived data, stored and manually kept in sync
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], totalPrice: 0 },
  reducers: {
    itemAdded(state, action) {
      state.items.push(action.payload);
      state.totalPrice += action.payload.price * action.payload.quantity; // easy to get wrong
    },
    itemQuantityChanged(state, action) {
      const item = state.items.find((i) => i.id === action.payload.id);
      const oldSubtotal = item.price * item.quantity;
      item.quantity = action.payload.quantity;
      state.totalPrice += item.price * item.quantity - oldSubtotal; // ...and wrong again here
    },
    // Forgot to update totalPrice in itemRemoved? Now it's silently incorrect,
    // and nothing will tell you — no error, no warning, just a wrong number in the UI.
  },
});
```

Every single reducer case that touches `items` now also has to remember to correctly update `totalPrice` — and "remember to update the derived field in every place that touches the source data" is exactly the class of bug that silently drifts wrong over time as new reducer cases get added by engineers who don't know (or forget) that `totalPrice` needs maintaining too.

## The fix: compute it in a selector

```javascript
// AFTER: totalPrice is never stored — it's always computed, always correct
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] }, // no totalPrice field at all
  reducers: {
    itemAdded(state, action) { state.items.push(action.payload); },
    itemQuantityChanged(state, action) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
    },
    itemRemoved(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload.id);
    },
  },
});

// Selector — memoized so it doesn't recompute unless items actually changed
import { createSelector } from '@reduxjs/toolkit';
const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
```

Now `totalPrice` cannot drift out of sync with `items`, because it isn't a separate fact stored anywhere — it's recomputed from the single source of truth every time `items` changes, and `createSelector`'s memoization means "every time" in practice only means "when `items` actually changed by reference," not on every unrelated state update.

## The general rule

If a value can be computed purely from other values already in state, it almost always shouldn't be stored — store it once, in one place, and derive everything else via selectors. Legitimate exceptions exist (a value that's expensive enough to compute that even memoized selector recomputation is too slow, or a value that needs to persist independently of its inputs, like a historical snapshot) but they're exceptions, not the default, and should be a deliberate, documented decision rather than an accident of "it was easier to just add a field." This same principle underlies why normalized state (`08-normalizing-state`) avoids storing a `commentCount` field on a post when `post.commentIds.length` already answers the question.
