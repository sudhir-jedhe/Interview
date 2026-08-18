# Problem: Implement a Generic `createReducer(initialState, handlers)` Helper

## Task

Implement `createReducer(initialState, handlers)`, a helper that takes an initial state value and a map of `{ [actionType]: (state, action) => newState }` handler functions, and returns a standard `(state, action) => newState` reducer — avoiding hand-written `switch` boilerplate. This mirrors (a simplified version of) Redux Toolkit's own `createReducer` utility.

## Requirements

- The returned reducer must default to `initialState` when `state` is `undefined`.
- For a recognized `action.type`, call the matching handler with `(state, action)` and return its result.
- For an unrecognized `action.type`, return the existing state unchanged (equivalent to a `default` case).
- (Stretch) Support an array of action types mapping to the same handler, useful for "these several actions should all reset this slice."

## Solution

```javascript
function createReducer(initialState, handlers) {
  // Normalize: allow a handler key to be a comma-less single type, OR support
  // an array-of-types shorthand by pre-expanding it into individual keys.
  return function reducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (typeof handler === 'function') {
      return handler(state, action);
    }
    return state;
  };
}

// Stretch: expand array-keyed handlers into individual entries once, at setup time.
function createReducerWithArrayKeys(initialState, handlerMap) {
  const expanded = {};
  for (const key of Object.keys(handlerMap)) {
    const types = key.split(',').map((s) => s.trim());
    for (const type of types) {
      expanded[type] = handlerMap[key];
    }
  }
  return createReducer(initialState, expanded);
}

module.exports = { createReducer, createReducerWithArrayKeys };
```

## Quick verification

```javascript
const { createReducer } = require('./02-implement-createReducer-helper.js');

const cartReducer = createReducer(
  { items: [] },
  {
    'cart/itemAdded': (state, action) => ({ items: [...state.items, action.payload] }),
    'cart/itemRemoved': (state, action) => ({
      items: state.items.filter((i) => i.id !== action.payload),
    }),
    'cart/cleared': () => ({ items: [] }),
  }
);

console.log(cartReducer(undefined, { type: '@@INIT' })); // { items: [] }

let state = cartReducer(undefined, { type: 'cart/itemAdded', payload: { id: 1, name: 'Book' } });
console.log(state); // { items: [{ id: 1, name: 'Book' }] }

state = cartReducer(state, { type: 'cart/itemAdded', payload: { id: 2, name: 'Pen' } });
console.log(state); // { items: [{ id: 1, ... }, { id: 2, ... }] }

state = cartReducer(state, { type: 'cart/itemRemoved', payload: 1 });
console.log(state); // { items: [{ id: 2, name: 'Pen' }] }

state = cartReducer(state, { type: 'cart/cleared' });
console.log(state); // { items: [] }

// Unrecognized action returns the same reference:
const before = state;
state = cartReducer(state, { type: 'totally/unrelated' });
console.log(state === before); // true
```

## Interview follow-ups this problem invites

- "How is this different from what `createSlice` does internally?" Conceptually identical in spirit — `createSlice`'s reducer-building logic is a more feature-complete version of exactly this pattern, additionally wrapping each handler in Immer's `produce` so handlers can use mutating syntax, and auto-generating the `handlers` map's keys (and matching action creators) from the `reducers` object you pass it, rather than requiring you to type the string keys yourself.
- "What's the advantage of this over a raw `switch`?" Mainly readability and reduced ceremony for large reducers — a lookup table access (`handlers[action.type]`) is arguably clearer than a long `switch`, and it's trivial to programmatically inspect (`Object.keys(handlers)`) which action types a given reducer responds to, which a `switch` doesn't expose as data.
