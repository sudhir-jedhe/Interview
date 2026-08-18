# The Store: The Single Object Holding All State

The store is the runtime object that ties Redux's principles together. It's small in terms of API surface — four methods in classic Redux — but it's worth understanding exactly what it does and doesn't do.

## What the store actually is

The store is created once, typically at app startup, from a root reducer (and optionally middleware/enhancers):

```javascript
import { createStore } from 'redux';
// or, RTK-era:
import { configureStore } from '@reduxjs/toolkit';

const store = createStore(rootReducer);
// modern equivalent:
const store = configureStore({ reducer: rootReducer });
```

Internally, a classic store is little more than: a closure holding the current state variable, a list of subscriber callbacks, and a reducer function. It is **not** a database, a cache, or a network layer — it holds exactly the plain, serializable JS object your reducers produce.

## The public API

- **`getState()`** — returns the current state tree. Synchronous, always reflects the latest committed state.
- **`dispatch(action)`** — the *only* way to trigger a state change. Runs the action through the root reducer (and any middleware chain first), replaces the store's internal state with the reducer's return value, then notifies subscribers.
- **`subscribe(listener)`** — registers a callback invoked after every dispatch (whether or not the relevant slice actually changed — Redux itself doesn't diff; that's `useSelector`'s job). Returns an `unsubscribe` function. React-Redux's `Provider`/`useSelector` are built on top of `subscribe` internally.
- **`replaceReducer(nextReducer)`** — swaps the root reducer at runtime, used for code-splitting (lazily adding reducers as feature modules load) or hot-reloading during development.

```javascript
const unsubscribe = store.subscribe(() => {
  console.log('state changed:', store.getState());
});

store.dispatch({ type: 'cart/itemAdded', payload: { id: 1 } });
console.log(store.getState()); // reflects the update

unsubscribe();
```

## One store, one tree — but organized state

"Single source of truth" does not mean flat or unstructured. Real apps combine multiple slice reducers into one root reducer via `combineReducers` (or RTK's `configureStore({ reducer: {...} })`, which does the same thing), producing a nested object like `{ user, cart, ui }`. There is still exactly one store instance and one root state object — the nesting is just how you keep the reducer logic modular.

```javascript
const rootReducer = combineReducers({ user: userReducer, cart: cartReducer });
const store = createStore(rootReducer);
// store.getState() -> { user: {...}, cart: {...} }
```

## Store vs component state, structurally

A React component's `useState` is scoped to that component instance and disappears on unmount. The Redux store is a standalone object that exists independently of any component — it's created once and lives for the app's lifetime (or until you explicitly tear it down, e.g., in tests). `Provider` (from `react-redux`) makes the store available to the component tree via Context, but the store itself has no dependency on React; you could `dispatch` and `getState` from plain JS, a Node script, or a test file with zero React involved.

## Common interview follow-up

"How does a component actually get notified when state it cares about changes, given `subscribe` fires on *every* dispatch?" Answer: `useSelector` wraps `subscribe` internally, runs your selector function against the new state after each dispatch, and only triggers a re-render if the selected value differs (by reference by default) from the previous render's selected value. The store itself doesn't know about selectors — it just says "something changed, go check." This ties directly into `04-react-redux-hooks`.
