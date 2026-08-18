# Problem: Implement a Minimal Thunk Middleware From Scratch

## Task

Implement the core of `redux-thunk` — the actual library is only a handful of meaningful lines, and being able to reproduce it from memory is one of the most common Redux whiteboard exercises.

## Requirements

- If the dispatched `action` is a function, call it directly with `(dispatch, getState)` instead of forwarding it via `next`.
- If it's a plain object (or anything else), pass it through unchanged via `next`.
- Return whatever the called function (or `next`) returns, so `dispatch(thunk)` can be `await`-ed if the thunk returns a promise.
- (Bonus, matches the real library) Support an optional third "extra argument" injected into every thunk, useful for dependency injection (e.g., an API client instance) without importing it directly into every thunk file.

## Solution

```javascript
function createThunkMiddleware(extraArgument) {
  return (store) => (next) => (action) => {
    if (typeof action === 'function') {
      return action(store.dispatch, store.getState, extraArgument);
    }
    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

module.exports = { thunk, createThunkMiddleware };
```

## Quick verification

```javascript
const { createStore, applyMiddleware } = require('redux');
const { thunk } = require('./02-implement-thunk-middleware.js');

function reducer(state = { value: null, loading: false }, action) {
  switch (action.type) {
    case 'started':
      return { ...state, loading: true };
    case 'succeeded':
      return { value: action.payload, loading: false };
    default:
      return state;
  }
}

const store = createStore(reducer, applyMiddleware(thunk));

function delayedSet(value) {
  return (dispatch) => {
    dispatch({ type: 'started' });
    setTimeout(() => dispatch({ type: 'succeeded', payload: value }), 10);
  };
}

store.dispatch(delayedSet(42));
console.log(store.getState()); // { value: null, loading: true }  (synchronous part)

setTimeout(() => {
  console.log(store.getState()); // { value: 42, loading: false }  (after the delay)
}, 20);

// Plain object actions still work unchanged:
store.dispatch({ type: 'started' });
```

## Interview follow-ups this problem invites

- "Why is `typeof action === 'function'` a safe-enough check, given actions are 'supposed to' be plain objects?" Because plain Redux already rejects non-object, non-function values at the base `dispatch` validation step (it throws for `undefined`, numbers, strings, etc. missing a `type`), so by the time an app has thunk installed, "function" vs "plain object with a type" is the only meaningful branch thunk needs to distinguish — anything else would already be invalid regardless.
- "What's the `extraArgument` feature for, concretely?" It lets you inject a dependency (an API client, a WebSocket connection, feature-flag service) into every thunk without each thunk file needing to `import` it directly — useful for testing (swap in a mock API client when configuring the store for tests) and for avoiding tight coupling between thunk files and a specific module's import path.
- "What happens if a thunk function itself throws synchronously (not via a rejected promise)?" The `action(store.dispatch, store.getState, extraArgument)` call throws directly, which propagates out of the middleware's inner function exactly like a reducer throwing (see `03-store-middleware/output-based/05-error-thrown-in-reducer-uncaught.md`) — uncaught unless something further up the call stack (or another middleware wrapping this one) catches it.
