# Problem: Implement a Custom Logging Middleware

## Task

Write a middleware that logs, for every dispatched action, the previous state, the action, and the resulting next state — from scratch, without any library.

## Requirements

- Must not swallow the action — always forward it (`next(action)`) so the rest of the chain and the reducer still run normally.
- Must print state *before* and *after* the action is processed, not the same value twice.
- Must return whatever `next(action)` returns, so `dispatch(...)` calls elsewhere in the app still behave normally (their return value isn't silently discarded).

## Solution

```javascript
const logger = (store) => (next) => (action) => {
  console.log('%c prev state', 'color: gray', store.getState());
  console.log('%c action    ', 'color: blue', action);

  const result = next(action); // reducer (and any remaining middleware) run here

  console.log('%c next state', 'color: green', store.getState());

  return result;
};

module.exports = { logger };
```

## Quick verification

```javascript
const { createStore, applyMiddleware } = require('redux');
const { logger } = require('./01-implement-logging-middleware.js');

function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'incremented':
      return { count: state.count + 1 };
    default:
      return state;
  }
}

const store = createStore(counterReducer, applyMiddleware(logger));

store.dispatch({ type: 'incremented' });
// logs:
//  prev state { count: 0 }
//  action     { type: 'incremented' }
//  next state { count: 1 }

console.log(store.getState()); // { count: 1 }
```

## Interview follow-ups this problem invites

- "How would you disable this in production without deleting it?" Guard the body with `if (process.env.NODE_ENV === 'production') return next(action);` at the top, so the middleware still exists (and could be re-enabled via a feature flag or dev-only build) but does no logging work in prod builds.
- "What would happen if you forgot `return next(action);` and just called `next(action);` on its own line?" `dispatch` calls throughout the app would receive `undefined` back instead of whatever the chain would normally return (the action itself, or a thunk's promise) — silently breaking any code relying on `dispatch`'s return value. See `output-based/02-forgetting-next.md` for the more severe version of this mistake (omitting the call to `next` entirely).
- "Could this same middleware also log which specific reducer(s) handled the action?" Not without extra instrumentation — a reducer function is opaque from the middleware's point of view; middleware only sees the dispatch pipeline, not which internal `switch` case (or `combineReducers` slice) actually matched. You'd need to add that logging inside the reducer itself, or diff `prev state` against `next state` to infer which top-level slice(s) changed.
