# `applyMiddleware`: Wiring Middleware Into the Store

Writing a middleware function is only half the story — `applyMiddleware` is what actually installs one or more middleware functions into a store's dispatch pipeline.

## Classic Redux

```javascript
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

const logger = (store) => (next) => (action) => {
  console.log('dispatching', action);
  return next(action);
};

const store = createStore(
  rootReducer,
  applyMiddleware(thunk, logger)
);
```

`applyMiddleware(...)` itself returns a **store enhancer** (see `05-enhancers-vs-middleware.md` for that distinction) — `createStore`'s third argument. Internally, `applyMiddleware` builds the actual middleware chain by composing every middleware function together and monkey-patching the store's `dispatch` to be the composed chain instead of the raw reducer-calling dispatch.

## Order matters

Middleware passed to `applyMiddleware(a, b, c)` runs in the order listed: `a` sees the action first, then (if it calls `next`) `b`, then `c`, then finally the real reducer-invoking dispatch.

```javascript
applyMiddleware(thunk, logger)
// dispatch(someThunk) -> thunk middleware intercepts it (function, not object) -> calls the thunk
//   the thunk calls dispatch(realAction) again -> re-enters the *whole* chain from the top
//     -> thunk sees a plain object this time, passes to next -> logger logs it -> reducer runs
```

This matters concretely: if `logger` were placed *before* `thunk` in the list, `dispatch(someThunk)` would hit `logger` first, and `logger` would log the raw function object (unhelpful — you want it to log the real actions the thunk eventually dispatches, not the thunk function itself). Placing `thunk` first ensures function-type "actions" are resolved into real plain-object actions before anything else in the chain (like a logger, which expects `action.type` to exist) sees them.

## Modern Redux Toolkit: `configureStore`

```javascript
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import logger from './loggerMiddleware';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
```

`configureStore` already includes a set of sensible default middleware (thunk, a serializability check, an immutable-state-mutation check, all active only in development for the dev-check ones) — `getDefaultMiddleware()` returns that default array, and `.concat(logger)` appends your custom middleware to the end, preserving the defaults rather than replacing them. You can also pass a plain array to fully override the defaults, but that's rarely what you want (you'd lose thunk support and the dev-mode safety checks).

## Verifying middleware is installed

A quick sanity check often shown in interviews: try dispatching a function without thunk installed.

```javascript
const store = createStore(rootReducer); // no applyMiddleware(thunk)
store.dispatch((dispatch) => dispatch({ type: 'x' }));
// Throws: "Actions must be plain objects. Use custom middleware for async actions."
```

That exact error message is Redux's built-in nudge toward exactly this topic — it's telling you that dispatching a function requires middleware.
