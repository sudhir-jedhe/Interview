# Memoized Selectors with `createSelector`

A plain selector like `(state) => state.cart.items.filter(i => i.inStock)` has a real cost: `.filter` allocates and returns a **brand-new array every single time it's called**, even if `state.cart.items` hasn't changed since the last call. If this selector is used with `useSelector` in a component, React-Redux calls it on *every* dispatched action anywhere in the app (to check whether the selected value changed), which means a brand-new array reference every time — and since `useSelector`'s default comparison is `===`, a new reference always looks like "the value changed," triggering a re-render even when the actual filtered contents are identical to last time.

`reselect`'s `createSelector` solves exactly this: it builds a selector that only recomputes when its **inputs** actually change (by reference), and caches (memoizes) the result otherwise — returning the exact same output reference if the inputs haven't changed.

```javascript
import { createSelector } from '@reduxjs/toolkit'; // re-exported from reselect

const selectCartItems = (state) => state.cart.items;

// createSelector(inputSelectors..., resultFn)
const selectInStockItems = createSelector(
  [selectCartItems],                       // input selector(s)
  (items) => items.filter((i) => i.inStock) // result function — only re-runs if inputs changed
);
```

## How the memoization actually works

By default, `createSelector` keeps a cache of size 1: it remembers the arguments (the outputs of the input selectors) from the *last* call. On each call:

1. It runs every input selector against the current `state`, producing an array of input values.
2. It compares each new input value against the corresponding value from the previous call, using `===` (reference equality) by default.
3. If **all** inputs are reference-equal to last time, it skips calling the result function entirely and returns the previously cached result — the same object reference as before.
4. If **any** input differs, it re-runs the result function and caches the new result (and the new inputs) for next time.

```javascript
const state1 = { cart: { items: [{ id: 1, inStock: true }] } };
const result1 = selectInStockItems(state1); // computes: filters, returns new array

const state2 = { cart: { items: state1.cart.items } }; // items array reference unchanged
const result2 = selectInStockItems(state2); // input (selectCartItems output) is === last time
// -> skips the filter entirely, returns result1 by reference: result2 === result1
```

This is exactly why `selectCartItems` — a trivial, non-memoized selector that just does `state.cart.items` — is used as the *input* selector: it returns whatever reference is already in the store, and that reference only changes when something actually replaces `state.cart.items` (e.g., a reducer adding/removing an item). If nothing touched the cart, `selectCartItems` keeps returning the same array reference, `createSelector` sees the input is unchanged, and skips recomputing the filtered list.

## Why referential equality of the output matters for React

`useSelector(selectInStockItems)` compares the selector's return value across renders using `===` by default. Because `createSelector` returns the *same* array reference when nothing relevant changed, `useSelector` correctly concludes "nothing changed, don't re-render this component" — even though an unrelated action (say, incrementing an unrelated counter slice) caused `useSelector` to re-invoke the selector. Without memoization, every dispatch would produce a new filtered array reference regardless of whether the cart itself changed, causing components reading it to re-render on every single action in the entire app — a real, measurable performance problem in larger apps with many connected components.
