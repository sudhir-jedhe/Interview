# Problem 1: Rebuild a Redux Slice Using `useContext` + `useReducer`

## Task

Given this Redux Toolkit slice for a shopping cart:

```javascript
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    itemAdded: (state, action) => { state.items.push(action.payload); },
    itemRemoved: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});
export const { itemAdded, itemRemoved } = cartSlice.actions;
export default cartSlice.reducer;
```

Rebuild identical functionality using only `React.createContext` + `useReducer` — no Redux, no external libraries. Then list, explicitly, what you lose by doing this.

## Solution

```jsx
import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'itemAdded':
      return { items: [...state.items, action.payload] };
    case 'itemRemoved':
      return { items: state.items.filter((item) => item.id !== action.payload.id) };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

// Action creators — optional, but keep call sites consistent, similar to Redux's exported actions:
export const itemAdded = (item) => ({ type: 'itemAdded', payload: item });
export const itemRemoved = (id) => ({ type: 'itemRemoved', payload: { id } });

// Usage: const { state, dispatch } = useCart(); dispatch(itemAdded({ id: 1, name: 'Widget' }));
```

## What you lose

1. **DevTools / time-travel debugging.** There's no equivalent of Redux DevTools' action log or state-snapshot replay for a `useReducer` inside a Context provider — you'd have to wire up manual logging in `dispatch` yourself to get any visibility at all.
2. **Middleware pipeline.** Redux's `applyMiddleware` (thunk, logger, custom async orchestration) has no built-in equivalent here. Adding logging or async side effects means wrapping `dispatch` by hand, and that wrapper isn't reusable across other Context-based stores the way Redux middleware composes across an entire app.
3. **Selector-based render granularity.** Every consumer of `CartContext` re-renders whenever *any* part of `{ state, dispatch }` changes — there's no `useSelector`-equivalent narrowing to just `state.items.length`, for example, without manually splitting into multiple contexts.
4. **No cross-cutting ecosystem tooling.** Redux's action-based model is what many browser extensions, testing utilities, and analytics integrations plug into. A bespoke Context+`useReducer` store has none of that out of the box.

This isn't an argument that the rebuild is wrong — it's functionally equivalent for this cart's logic — it's the point of the exercise: name the concrete things a dedicated store library buys you beyond "less code to write."
