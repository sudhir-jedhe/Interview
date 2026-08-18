# The Middleware Pattern: `store => next => action => {...}`

Redux middleware has a distinctive triple-arrow signature that confuses almost everyone the first time they see it. Understanding *why* it's shaped this way — not just memorizing the shape — is one of the highest-value things to nail for a mid/senior Redux interview.

## The signature, unpacked

```javascript
const myMiddleware = (store) => (next) => (action) => {
  // ... do something with store, next, action ...
  return next(action);
};
```

This is three nested functions, each returning the next:

1. **`store => ...`** — outer function, called once when the middleware is applied to the store. Receives a restricted store-like object: `{ getState, dispatch }`.
2. **`next => ...`** — middle function, called once per middleware, wired up by Redux internally. `next` is "the next thing in the chain" — either the next middleware, or (for the last middleware) the actual store's real `dispatch`, which sends the action into the reducer.
3. **`action => {...}`** — inner function, called **every time** `dispatch(action)` is invoked anywhere in the app. This is where your middleware's actual per-action logic lives.

## Why three nested layers, specifically

Each layer solves a different problem:

- The **`store` layer** exists so middleware can call `getState()` or `dispatch()` at any point in its logic — without it, a middleware couldn't read current state before deciding how to handle an action, which thunk absolutely needs.
- The **`next` layer** exists so middleware is **composable**: each middleware only needs to know about "the next thing," not the entire chain or which position it's in. This lets you freely reorder, add, or remove middleware without any of them needing to change — each one just calls `next(action)` to pass control forward, exactly like Express.js middleware calling `next()`.
- The **`action` layer** is the actual per-dispatch entry point — this function runs fresh every single time any code calls `dispatch`.

## What "wraps the next" means concretely

```javascript
const logger = (store) => (next) => (action) => {
  console.log('dispatching', action);
  const result = next(action); // hands off to the next middleware (or the reducer)
  console.log('next state', store.getState());
  return result;
};
```

Because `logger` calls `next(action)` and captures its return value, it can run code **both before and after** the rest of the chain (and the reducer) has processed the action — logging the action before, and the resulting state after. This before/after wrapping is only possible because each middleware controls exactly when (and whether) it calls `next`.

## Middleware can choose not to call `next`

Since `next` is just a function, a middleware can decide to **not** call it — effectively swallowing the action so it never reaches the reducer (or the rest of the chain). This is how a "block this specific action type" or a debounce/throttle middleware would work: inspect `action`, and conditionally skip calling `next(action)` entirely.

```javascript
const blockDeprecatedActions = (store) => (next) => (action) => {
  if (action.type === 'legacy/doNotUse') {
    console.warn('Blocked deprecated action:', action.type);
    return; // next() never called — action never reaches the reducer
  }
  return next(action);
};
```

## Middleware can dispatch new actions, or handle non-object "actions"

Because the middleware's inner function receives whatever was passed to `dispatch`, it isn't required to be a plain object — a middleware can accept *anything* as `action` and decide what to do with it, as long as it (or something further down the chain) eventually calls `next` with a real plain-object action, or calls `store.dispatch(...)` itself with one. This is exactly the mechanism `redux-thunk` uses to let you `dispatch(someFunction)` — see `03-thunk-and-async-actions.md`.
