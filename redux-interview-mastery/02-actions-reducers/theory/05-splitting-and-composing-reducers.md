# Splitting Reducers by Domain and Composing Them

As an app grows, one giant reducer handling every action type in a single `switch` becomes unmanageable. Redux's answer is **reducer composition**: many small, focused slice reducers, each owning one part of the state tree, combined into a single root reducer.

## `combineReducers`

```javascript
import { combineReducers, createStore } from 'redux';

function userReducer(state = { name: null }, action) { /* ... */ return state; }
function cartReducer(state = { items: [] }, action) { /* ... */ return state; }
function uiReducer(state = { theme: 'light' }, action) { /* ... */ return state; }

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  ui: uiReducer,
});

const store = createStore(rootReducer);
// store.getState() -> { user: {...}, cart: {...}, ui: {...} }
```

Each slice reducer only ever sees and returns its own slice of state — `cartReducer` has no access to `state.user`, by design. This enforces a clean boundary: a domain's reducer can't accidentally read or corrupt another domain's data. `configureStore({ reducer: {...} })` from Redux Toolkit does exactly this under the hood when you pass it an object instead of a single function.

## Why split by domain, not by action type or by "feature that touches many things"

The natural axis is the shape of your state tree, not the UI feature. A "checkout" *feature* might touch `cart`, `user`, and `payment` slices — but you still keep `cartReducer`, `userReducer`, and `paymentReducer` as three separate functions, each independently testable and independently reasoned about, rather than one `checkoutReducer` that reaches across concerns.

## Composing further: reducers within reducers

Nothing stops a slice reducer from itself delegating to smaller reducer functions for sub-pieces of its own state — this is just function composition, no special API needed:

```javascript
function cartItemsReducer(state = [], action) { /* handles item add/remove/qty */ return state; }
function cartDiscountReducer(state = null, action) { /* handles discount code apply/remove */ return state; }

function cartReducer(state = {}, action) {
  return {
    items: cartItemsReducer(state.items, action),
    discount: cartDiscountReducer(state.discount, action),
  };
}
```

This is effectively hand-rolling a mini `combineReducers` for one slice — useful when a single domain's state has gotten complex enough to warrant its own internal composition, without promoting each piece to a top-level store key.

## Cross-slice reactions: `extraReducers` and `combineReducers`' boundary

A common real need: slice A must reset when an action defined in slice B fires (e.g., `cartSlice` should clear when `authSlice` dispatches `loggedOut`). Because `combineReducers` only ever hands a slice reducer *its own* previous state, the slice reducer still receives the *full action* — it can respond to action types it didn't itself define:

```javascript
// classic style: cartReducer directly matches an action type owned by "auth"
function cartReducer(state = initialState, action) {
  switch (action.type) {
    case 'auth/loggedOut':
      return initialState; // reset on an action from a different domain
    case 'cart/itemAdded':
      return { ...state, items: [...state.items, action.payload] };
    default:
      return state;
  }
}

// createSlice style: the same cross-slice reaction via extraReducers
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: { /* cart's own actions */ },
  extraReducers: (builder) => {
    builder.addCase('auth/loggedOut', () => initialState);
  },
});
```

This is the sanctioned way to react across slice boundaries — the state tree stays partitioned by `combineReducers`, but the *action* namespace is global, so any reducer can listen for any action type regardless of which slice defines it.
