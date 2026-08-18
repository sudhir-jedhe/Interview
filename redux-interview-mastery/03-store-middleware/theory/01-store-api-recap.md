# The Store's Public API, Revisited for Middleware

`01-redux-core-concepts/theory/05-the-store.md` covers the store's API (`getState`, `dispatch`, `subscribe`, `replaceReducer`) in the context of "what is the store." This file covers the same four methods specifically through the lens of **middleware** — because middleware exists entirely to intercept and extend one of them: `dispatch`.

## The method middleware cares about: `dispatch`

Without middleware, `dispatch(action)` does exactly one thing: run `action` through the root reducer, commit the result, notify subscribers. Every `dispatch` call is a direct, synchronous hop into the reducer.

```javascript
// No middleware: dispatch -> reducer, directly
store.dispatch({ type: 'counter/incremented' });
```

Middleware inserts a **chain of functions between the call to `dispatch` and the reducer actually running**. Each middleware in the chain gets a chance to inspect, transform, delay, log, or even swallow an action before deciding whether to pass it further down the chain toward the reducer.

```
dispatch(action) -> middleware1 -> middleware2 -> middleware3 -> reducer
```

## `getState` and `subscribe` inside middleware

Middleware functions are given access to a restricted version of the store — specifically `{ getState, dispatch }` — as their first argument (see `02-middleware-pattern.md` for the exact signature). This is why middleware like `redux-thunk` can let an async action creator read the *current* state before deciding what to dispatch next (`getState()`), and why a logging middleware can dispatch additional actions of its own (`dispatch(...)`) as part of its logic, not just pass the original action through.

`subscribe` is not exposed to middleware directly — middleware operates on the dispatch pipeline, not on "being notified after the fact." If a middleware needs to react to every completed state change (rather than intercept the dispatch itself), it would typically just do that logic *after* calling `next(action)`, since by then the reducer has already run and `getState()` reflects the new state.

## `replaceReducer` and middleware are independent axes

`replaceReducer` swaps which reducer function computes the next state; middleware wraps *how `dispatch` reaches* whatever the current reducer is. They don't interact — replacing the reducer doesn't require reconfiguring middleware, and configuring middleware doesn't care which reducer is currently active. This independence is intentional: the middleware chain is set up once, at `createStore`/`configureStore` time, as part of the **store enhancer**, while the reducer can be swapped later via `replaceReducer` without touching the middleware chain at all.

## Why this matters for the rest of this topic

Every remaining file in this topic — the middleware signature, thunk, custom logging/error-handling middleware, enhancers — is really elaborating on one idea: **`dispatch` is not fixed at store creation; it's a composable pipeline that middleware plugs into**, and everything middleware can do (delay actions, transform them, log them, catch errors, allow non-object arguments) follows from where in that pipeline it sits and what it chooses to do with `next`.
