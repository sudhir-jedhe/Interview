# createSlice: Generated Actions + Immer-Powered Reducers

`createSlice` is the centerpiece of Redux Toolkit. A "slice" is the reducer logic and actions for a single feature/domain of state — one call to `createSlice` typically corresponds to one key in your root state object.

```javascript
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], total: 0 },
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
      state.total += action.payload.price;
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
```

Three things happen automatically that used to be manual work:

**1. Action creators are generated from the reducer keys.** `cartSlice.actions.addItem` is a function that returns `{ type: 'cart/addItem', payload: <arg> }`. The action type string is auto-derived as `${sliceName}/${reducerName}` — you never write the string `'cart/addItem'` yourself, which removes an entire category of "typo in the action type" bugs.

**2. `cartSlice.reducer` is a normal Redux reducer function.** It's a case reducer under the hood (an internal switch/lookup on `action.type`), so it plugs directly into `configureStore`'s `reducer` object exactly like a hand-written reducer would.

**3. The reducer functions can "mutate" `state` directly.** This is the part that looks like it violates Redux's core rule (reducers must not mutate state) — and it would, if not for Immer.

## How Immer makes this safe

`createSlice` wraps each case reducer with Immer's `produce`. Immer gives your reducer a special **draft** object — a JS Proxy that records every operation you perform on it (`push`, property assignment, `delete`, etc.) without touching the real, original state. When your reducer function finishes, Immer replays the recorded operations to produce a brand-new, structurally-shared immutable state object. The original `state` argument is never actually mutated — you're mutating a disposable proxy, and Immer computes the immutable diff for you.

```javascript
// What you write:
addItem: (state, action) => {
  state.items.push(action.payload);
}

// What conceptually happens, roughly equivalent to:
addItem: (state, action) => ({
  ...state,
  items: [...state.items, action.payload],
})
```

Two Immer rules matter for interviews:

- **Either mutate the draft OR return a new state — never both.** If your reducer returns a value, Immer uses that value and discards any draft mutations. Returning `undefined` after mutating the draft is correct (this is what implicitly happens when you don't write a `return`). Returning a new object while also mutating `state` is a bug — Immer will use the returned value and your mutations are silently thrown away.
- **You can still return a brand-new value when it's easier**, e.g. `clearCart: (state) => initialState` or `removeItem` reassigning `state.items = [...]`. Reassigning a property on the draft (`state.items = filtered`) is a mutation of the draft, which Immer tracks correctly — it is not the same as returning a whole new top-level object, and both are valid.

## `prepare` callbacks

When an action needs to carry a payload that isn't just "whatever was passed in" — e.g. you want to attach a generated ID or timestamp — use the `prepare` notation:

```javascript
reducers: {
  addItem: {
    reducer: (state, action) => {
      state.items.push(action.payload);
    },
    prepare: (name, price) => ({
      payload: { id: nanoid(), name, price, addedAt: Date.now() },
    }),
  },
},
```

This keeps the "shape the payload" logic co-located with the reducer that consumes it, instead of scattering ID-generation logic across every call site that dispatches `addItem`.
