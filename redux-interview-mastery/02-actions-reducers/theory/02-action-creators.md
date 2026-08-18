# Action Creators

An action creator is just a function that returns an action object. They exist to avoid hand-writing the same object literal at every call site, to centralize the exact shape of a given action type in one place, and to give you a single spot to add logic like generating an ID or timestamp.

## Classic, hand-written action creators

```javascript
// action creator
function itemAdded(item) {
  return { type: 'cart/itemAdded', payload: item };
}

// usage
dispatch(itemAdded({ id: 1, name: 'Book', price: 20 }));
```

A common enhancement is attaching metadata at creation time rather than duplicating it at every dispatch site:

```javascript
function todoAdded(text) {
  return {
    type: 'todos/todoAdded',
    payload: { id: crypto.randomUUID(), text, completed: false },
  };
}
```

Note: generating an ID or reading `Date.now()` is fine *inside the action creator* — it's not a reducer, so it isn't required to be pure. The reducer that consumes the resulting action still only sees a plain object and stays pure.

## Redux Toolkit's `createSlice`: auto-generated action creators

`createSlice` generates an action creator for every reducer function you define, matching the reducer's key as the action type suffix (`sliceName/reducerKey`), and wraps whatever you pass as the argument into `payload` automatically:

```javascript
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    itemAdded(state, action) {
      state.items.push(action.payload);
    },
  },
});

// createSlice generated this for you:
cartSlice.actions.itemAdded({ id: 1, name: 'Book' });
// -> { type: 'cart/itemAdded', payload: { id: 1, name: 'Book' } }
```

For cases needing custom payload shaping (e.g., generating an ID at dispatch time), `createSlice` supports a `prepare` callback:

```javascript
reducers: {
  todoAdded: {
    reducer(state, action) {
      state.push(action.payload);
    },
    prepare(text) {
      return { payload: { id: nanoid(), text, completed: false } };
    },
  },
},
```

## Why centralize action creation at all

Without action creators, every dispatch site re-types the exact `type` string and payload shape by hand — a classic source of typos (`'cart/itmeAdded'`) that silently fail (the reducer's `switch` just falls through to `default`, no error, no warning). Centralizing the shape in one function (or letting `createSlice` generate it) means the string literal exists in exactly one place, and TypeScript/editor autocomplete can catch mismatches that would otherwise be invisible until a bug report.

## Action creators are not reducers

A very common junior confusion: action creators decide *what happened and what data is attached*; they never decide *how state should change* — that's the reducer's exclusive job. An action creator that inspects current state and returns different action *shapes* based on it is a smell (usually a sign that logic which belongs in the reducer, or in a thunk for legitimately async decisions, has leaked into the action-creation step).
