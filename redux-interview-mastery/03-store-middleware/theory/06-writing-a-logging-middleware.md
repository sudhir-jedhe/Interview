# Writing a Custom Logging Middleware From Scratch

A logging middleware is the canonical "explain and implement middleware" interview exercise, because it exercises every part of the pattern: reading `store`, calling `next`, and doing work both before and after.

## The goal

Print, for every dispatched action: the previous state, the action itself, and the resulting next state — a lightweight version of what `redux-logger` (a popular real package) does.

## Building it up

```javascript
// Step 1: the bare minimum — pass everything through unchanged
const passthroughMiddleware = (store) => (next) => (action) => next(action);

// Step 2: log before dispatching
const logBefore = (store) => (next) => (action) => {
  console.log('dispatching:', action);
  return next(action);
};

// Step 3: also log after — this requires capturing next(action)'s result
// and reading state *after* the reducer has run
const logger = (store) => (next) => (action) => {
  console.log('prev state:', store.getState());
  console.log('dispatching:', action);
  const result = next(action); // <-- reducer runs somewhere inside this call
  console.log('next state:', store.getState());
  return result;
};
```

The key detail: `store.getState()` called *before* `next(action)` reflects the state prior to this action; called *after* `next(action)` returns, it reflects the state after the reducer (and any further middleware down the chain) has processed it — because `next(action)` is what actually triggers the reducer to run (directly, or via the rest of the chain). This before/after pattern is only possible because logging middleware controls exactly when it calls `next`.

## A more production-shaped version

```javascript
const logger = (store) => (next) => (action) => {
  if (process.env.NODE_ENV === 'production') {
    return next(action); // skip logging overhead in prod
  }

  console.groupCollapsed(`action ${action.type}`);
  console.log('%c prev state', 'color: gray', store.getState());
  console.log('%c action    ', 'color: blue', action);

  const result = next(action);

  console.log('%c next state', 'color: green', store.getState());
  console.groupEnd();

  return result;
};
```

## Registering it

```javascript
// Classic
const store = createStore(rootReducer, applyMiddleware(thunk, logger));

// Redux Toolkit
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
```

## Common mistakes when writing this from memory

- **Forgetting to `return next(action)`** — without it, `dispatch(...)` calls throughout the app would return `undefined` instead of the action (or whatever the reducer chain normally returns), silently breaking any code that relies on `dispatch`'s return value (uncommon, but some patterns depend on it, e.g., thunks returning promises).
- **Calling `store.getState()` only once, before `next(action)`** — this logs the same "prev state" twice instead of showing the actual transition, defeating the purpose of a before/after logger.
- **Two-argument arrow function instead of three nested single-argument functions** — writing `(store, next) => (action) => {...}` instead of `(store) => (next) => (action) => {...}` breaks how `applyMiddleware` calls middleware (it calls each middleware with exactly one argument, `store`, expecting back a function of exactly one argument, `next`) — this is a very common syntax slip under interview pressure, worth deliberately practicing until it's automatic.

Full implementation + a runnable example live in `problems/01-implement-logging-middleware.md` and `snippets/`.
