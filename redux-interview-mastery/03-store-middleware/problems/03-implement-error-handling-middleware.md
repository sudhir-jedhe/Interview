# Problem: Implement an Error-Catching / Reporting Middleware

## Task

Write a middleware that catches errors thrown by the reducer or by any later middleware in the chain, reports them (e.g., to an error-tracking service and/or the console), and — critically — decides what to do next without crashing the whole app.

## Requirements

- Wrap `next(action)` in a `try/catch`.
- On catch, report the error (for this exercise, `console.error` plus dispatching a plain `error/reported` action so the UI can show a fallback state).
- Must not silently eat *all* future errors — after reporting, prefer re-throwing (or at least clearly documenting why not) rather than pretending nothing happened, since middleware catching every error unconditionally can mask real bugs during development.
- Should also catch errors thrown synchronously by other middleware earlier in `next`'s chain, not just reducer errors — since from this middleware's point of view, "whatever `next(action)` does" is opaque.

## Solution

```javascript
const errorReportingMiddleware = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (err) {
    // 1. Report it — in real code, this would call an error-tracking SDK.
    console.error(`Error while processing action "${action.type}":`, err);

    // 2. Dispatch a plain action so reducers/UI can react (e.g., show a toast).
    store.dispatch({
      type: 'error/reported',
      payload: { message: err.message, actionType: action.type },
    });

    // 3. Re-throw in development so the error isn't silently hidden during
    //    debugging; swallow in production so one bad action doesn't crash
    //    the whole app for end users.
    if (process.env.NODE_ENV !== 'production') {
      throw err;
    }
    return undefined;
  }
};

module.exports = { errorReportingMiddleware };
```

## Quick verification

```javascript
const { createStore, applyMiddleware } = require('redux');
const { errorReportingMiddleware } = require('./03-implement-error-handling-middleware.js');

function reducer(state = { value: 0, lastError: null }, action) {
  switch (action.type) {
    case 'divide':
      if (action.payload === 0) throw new Error('Division by zero');
      return { ...state, value: state.value / action.payload };
    case 'error/reported':
      return { ...state, lastError: action.payload.message };
    default:
      return state;
  }
}

process.env.NODE_ENV = 'production'; // simulate prod so the example doesn't re-throw
const store = createStore(reducer, applyMiddleware(errorReportingMiddleware));

store.dispatch({ type: 'divide', payload: 0 });
console.log(store.getState());
// -> { value: 0, lastError: 'Division by zero' }
// The app kept running instead of an uncaught exception propagating to the dispatch call site.
```

## Interview follow-ups this problem invites

- "Where should this middleware sit relative to others in the chain, and why?" As early as possible (first, or immediately after any middleware that must run unconditionally, like a required auth check) — being early means its `try/catch` around `next(action)` wraps the *entire remainder* of the chain plus the reducer, catching errors from any of them. If placed last, it would only catch reducer errors, not errors thrown by other middleware earlier in the chain (which never even reach this one, since they'd throw before calling `next` down to it).
- "Why re-throw in development but swallow in production? Isn't that inconsistent?" It's a deliberate tradeoff: in development, silently swallowing every error makes bugs harder to notice and debug (you want them loud, ideally crashing a test or showing an obvious overlay); in production, one bad or unanticipated action shouldn't be allowed to crash the entire app for an end user — better to report it, degrade gracefully (e.g., show a fallback UI via the `error/reported` state), and keep the rest of the app usable.
- "This middleware dispatches inside a `catch` block that itself wraps a call to `next`, which internally could re-enter this same middleware for the new `error/reported` action — could that cause infinite recursion?" No, because `store.dispatch(...)` (not `next(...)`) re-enters the chain from the top for the *new* action, and that new dispatch's own `try/catch` only wraps its own `next(action)` call — as long as the reducer's `error/reported` case doesn't itself throw, this terminates normally after one extra pass through the chain.
