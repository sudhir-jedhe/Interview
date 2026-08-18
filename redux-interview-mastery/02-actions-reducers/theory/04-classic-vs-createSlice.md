# Classic Switch-Statement Reducers vs `createSlice`

Both approaches produce the same runtime contract — a `(state, action) => newState` function — but they differ enormously in ergonomics, and interviews frequently ask you to compare them directly.

## The classic pattern

```javascript
const initialState = { items: [] };

function cartReducer(state = initialState, action) {
  switch (action.type) {
    case 'cart/itemAdded':
      return { ...state, items: [...state.items, action.payload] };
    case 'cart/itemRemoved':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    default:
      return state;
  }
}
```

You hand-write: the action type strings, the action creators (separately, if you want them), the `switch`, every spread-based immutable update, and the `default` fallback. It's explicit and dependency-free, but verbose, and immutable-update spreading gets unwieldy fast for nested state (`{ ...state, user: { ...state.user, address: { ...state.user.address, city: 'X' } } }`).

## `createSlice`

```javascript
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    itemAdded(state, action) {
      state.items.push(action.payload); // "mutating" syntax
    },
    itemRemoved(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
  },
});

export const { itemAdded, itemRemoved } = cartSlice.actions;
export default cartSlice.reducer;
```

`createSlice` generates the action creators and action type strings for you (`'cart/itemAdded'`, `'cart/itemRemoved'`), builds the `switch`-equivalent dispatch internally, and — critically — wraps every reducer function with **Immer**'s `produce`.

## How Immer makes "mutating" syntax safe

Immer gives your reducer function a `Proxy` standing in for the real `state`. Every operation that looks like mutation (`state.items.push(x)`, `state.user.name = 'Ada'`, `delete state.flag`) is intercepted by the proxy and recorded as an intended change, rather than actually touching the real underlying object. When your reducer function returns, Immer uses the recorded operations to produce a **new, structurally-shared object** — untouched branches of the tree are reused by reference; only the parts you "changed" get new objects — and that new object is what Redux Toolkit actually uses as the next state. The original `state` object handed to your reducer is never mutated.

```javascript
// Illustrative Immer core, roughly what createSlice does under the hood:
import produce from 'immer';

const nextState = produce(currentState, (draft) => {
  draft.items.push(newItem); // safe: recorded against the draft proxy
});
// currentState is untouched; nextState is a new object with the change applied
```

## Side-by-side comparison

| | Classic switch | `createSlice` |
|---|---|---|
| Action types | Hand-written strings, must match exactly between action creator and reducer `case` | Auto-generated from slice name + reducer key, always in sync |
| Action creators | Hand-written separately (or omitted, dispatching raw objects) | Auto-generated, one per reducer function |
| Immutable updates | Manual spreads (`{ ...state, ... }`), error-prone for deep nesting | "Mutating" syntax via Immer, safe and much shorter for nested updates |
| Boilerplate | High | Low |
| Debuggability of the mechanism | Fully transparent — no library magic | Requires understanding Immer's proxy-based draft model to reason about edge cases |
| Escape hatch | N/A | Returning a new value directly from a `createSlice` reducer (instead of mutating the draft) is also supported — but never both mutate *and* return in the same reducer |

## The interview-ready framing

"`createSlice` doesn't change what a reducer fundamentally is — it's still a pure function of `(state, action)` from Redux's point of view. It changes *how you're allowed to write* the state-transition logic, by using Immer to translate mutating-looking code into real immutable updates. Classic Redux is still common in older codebases and is worth knowing because interviewers test both, and because understanding the manual-spread version is what makes Immer's value obvious rather than magical."
