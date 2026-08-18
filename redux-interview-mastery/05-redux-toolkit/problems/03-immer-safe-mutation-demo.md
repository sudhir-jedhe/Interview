# Problem 3: Demonstrate That Immer-Backed "Mutation" Never Touches Real State

## Task

Write a small, self-contained demonstration (no test framework needed — plain assertions) that proves `state.items.push(x)` inside a `createSlice` reducer does **not** mutate the original state object passed in, even though the reducer code looks like a direct array mutation.

## Reference solution

```javascript
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], total: 0 },
  reducers: {
    addItem(state, action) {
      state.items.push(action.payload); // looks like a mutation
      state.total += action.payload.price;
    },
  },
});

function assert(condition, message) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
  console.log(`OK: ${message}`);
}

// --- Demonstration ---

const originalState = { items: [], total: 0 };
const originalItemsRef = originalState.items; // keep a reference to the original array

const newState = cartSlice.reducer(
  originalState,
  cartSlice.actions.addItem({ id: 1, name: 'Widget', price: 9.99 })
);

// 1. The original state object was NOT mutated.
assert(originalState.items.length === 0, 'original state.items is still empty');
assert(originalState.total === 0, 'original state.total is still 0');

// 2. The original array reference was NOT mutated in place either.
assert(originalItemsRef === originalState.items, 'sanity: same reference check is valid');
assert(originalItemsRef.length === 0, 'the original array object itself was never pushed to');

// 3. A brand-new state object was produced.
assert(newState !== originalState, 'newState is a different object reference');
assert(newState.items !== originalState.items, 'newState.items is a new array reference');
assert(newState.items.length === 1, 'newState.items has the new item');
assert(newState.total === 9.99, 'newState.total reflects the addition');

// 4. Calling the reducer again on newState, with an untouched second field,
//    proves Immer shares unchanged references rather than deep-cloning everything.
const sliceWithExtraField = { items: newState.items, total: newState.total, meta: { note: 'unchanged' } };
const nextState = cartSlice.reducer(
  sliceWithExtraField,
  cartSlice.actions.addItem({ id: 2, name: 'Gadget', price: 19.99 })
);
assert(nextState.meta === sliceWithExtraField.meta, 'untouched branches are structurally shared, not cloned');

console.log('All assertions passed — Immer produced new state without mutating the original.');
```

## What this proves, and why it's the crux of "Immer makes mutation safe"

- **The reducer's `state` parameter is a Proxy, not the real object.** `originalState` (and specifically `originalState.items`, captured by reference *before* calling the reducer) is provably untouched after the call — if `push` had really mutated the real array, `originalItemsRef.length` would be `1`, not `0`.
- **A new object graph is returned**, and `newState !== originalState` — this is what makes the result compatible with Redux's requirement that reducers return new references for anything that changed, which is exactly what `useSelector`/connected components rely on to know when to re-render.
- **Structural sharing keeps this cheap.** The fourth check shows that fields Immer's draft never touched (`meta`) come through as the exact same object reference in the output — Immer doesn't deep-clone the entire state tree on every action, only the path from the root down to whatever was actually mutated, which is why "mutating" syntax inside `createSlice` doesn't carry the performance cost people sometimes assume it does.
