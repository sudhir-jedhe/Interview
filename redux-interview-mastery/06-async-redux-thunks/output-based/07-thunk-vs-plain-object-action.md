## Will the logger middleware below log this dispatch?

```javascript
const loggerMiddleware = (store) => (next) => (action) => {
  console.log('LOGGER saw action:', action);
  return next(action);
};

// middleware order: thunk BEFORE logger
const store = configureStore({
  reducer,
  middleware: (getDefault) => [thunkMiddleware, loggerMiddleware],
});

function increment() {
  return (dispatch) => dispatch({ type: 'counter/increment' });
}

store.dispatch(increment());
```

**Answer:** `LOGGER saw action:` never logs for the *thunk itself* (the function `increment()` returns) — but it *does* log once, for the inner `{ type: 'counter/increment' }` action that the thunk dispatches. If the middleware order were reversed (`loggerMiddleware` before `thunkMiddleware`), the logger would additionally log the raw function itself before the thunk middleware ever gets a chance to intercept it.

**Why:** Middleware forms a chain, and each middleware's position in the array determines what it sees. With `[thunkMiddleware, loggerMiddleware]`, `thunkMiddleware` runs first: it inspects `store.dispatch(increment())`'s argument, sees it's a function, and — instead of calling `next(action)` to pass it further down the chain to `loggerMiddleware` — calls the function directly. The logger middleware, positioned *after* thunk in the chain, never receives the function at all; it only ever sees the `{ type: 'counter/increment' }` object because that's a *new*, separate `dispatch(...)` call made from inside the thunk, which re-enters the *entire* middleware chain from the top, this time carrying a plain object that `thunkMiddleware` correctly forwards via `next(action)` down to `loggerMiddleware`. This is a genuinely important detail for debugging middleware order bugs: placing a logger *before* thunk in the middleware array shows you raw thunk functions (usually useless to log); placing it *after* — the conventional position, and what `getDefaultMiddleware()` does by default — means you only ever see the "real," fully-resolved plain actions that actually reach the reducers.
