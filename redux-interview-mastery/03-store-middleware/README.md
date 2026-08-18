# 03 — Store, Middleware, and Async

How the store's `dispatch` pipeline can be extended: the middleware pattern, how it enables async action creators via thunk, the distinction between middleware and store enhancers, and writing real middleware (logging, error handling) from scratch. This is the topic where interviewers test whether you understand Redux's internals well enough to build tooling, not just consume it.

## Summary

- The store's core API (`getState`, `dispatch`, `subscribe`, `replaceReducer`) is covered in `01-redux-core-concepts`; here, the focus is specifically on how `dispatch` becomes a **composable pipeline** that middleware plugs into.
- Middleware has the signature **`store => next => action => {...}`** — three curried, single-argument functions. `store` gives access to `getState`/`dispatch`; `next` forwards to the rest of the chain; the inner function runs on every dispatch and decides whether/how to call `next`.
- This shape exists specifically for **composability**: each middleware only needs to know about "the next thing," letting middleware be freely added, removed, or reordered without any of them needing to change.
- **Thunk** is the standard mechanism for async action creators: it checks if a dispatched value is a function, and if so calls it directly with `(dispatch, getState)` instead of forwarding it to the reducer — the entire implementation is about 5 lines.
- **`applyMiddleware`** installs middleware into the store and is itself implemented as a **store enhancer** — enhancers wrap the whole `createStore` function (and can do things middleware can't, like Redux DevTools' full state snapshotting), while middleware only wraps `dispatch`.
- Middleware order matters concretely: **thunk must come before** general-purpose middleware like a logger, or the logger only ever sees raw functions instead of the real actions the thunk eventually dispatches.

## Key bullets to remember for interviews

- Forgetting `return next(action)` in a middleware is a silent bug — no error, the action just never reaches the reducer.
- `store.getState()` called before vs after `next(action)` reflects state before/after the reducer runs, because `next` is what actually triggers reducer execution.
- A reducer (or earlier middleware) throwing propagates straight out through `next(action)`'s call stack unless some middleware wraps it in a `try/catch`.
- `dispatch(someFunction)` throws `"Actions must be plain objects"` without thunk (or equivalent) installed — the error message literally names `redux-thunk`.
- `applyMiddleware(...)` is an enhancer, passed as `createStore`'s third argument — there's no separate "middleware slot" in the raw API.

## Index

### theory/
- [01-store-api-recap.md](theory/01-store-api-recap.md) — the store's API through the lens of middleware, specifically why `dispatch` is the one middleware wraps
- [02-middleware-pattern.md](theory/02-middleware-pattern.md) — the `store => next => action` signature, unpacked layer by layer, and why it's shaped that way
- [03-thunk-and-async-actions.md](theory/03-thunk-and-async-actions.md) — how middleware enables async action creators, the pending/fulfilled/rejected pattern
- [04-applyMiddleware.md](theory/04-applyMiddleware.md) — wiring middleware into classic `createStore` and modern `configureStore`, why order matters
- [05-enhancers-vs-middleware.md](theory/05-enhancers-vs-middleware.md) — the enhancer mechanism, what it can do that middleware can't, composing multiple enhancers
- [06-writing-a-logging-middleware.md](theory/06-writing-a-logging-middleware.md) — building a logger from scratch, step by step, and common mistakes

### snippets/
- [01-logger-middleware.js](snippets/01-logger-middleware.js) — a minimal before/after logging middleware
- [02-thunk-basic-usage.js](snippets/02-thunk-basic-usage.js) — an async action creator with a pending/succeeded/failed sequence
- [03-error-catching-middleware.js](snippets/03-error-catching-middleware.js) — catching a reducer-thrown error and dispatching a fallback action
- [04-conditional-blocking-middleware.js](snippets/04-conditional-blocking-middleware.js) — a middleware that conditionally never calls `next`
- [05-multiple-middleware-order.js](snippets/05-multiple-middleware-order.js) — demonstrating why thunk must precede a logger
- [06-configureStore-with-custom-middleware.js](snippets/06-configureStore-with-custom-middleware.js) — appending custom middleware to RTK's defaults

### output-based/
- [01-middleware-order-with-thunk.md](output-based/01-middleware-order-with-thunk.md) — what a logger sees before vs after thunk in the chain
- [02-forgetting-next.md](output-based/02-forgetting-next.md) — a middleware that silently never reaches the reducer
- [03-dispatching-plain-object-without-thunk.md](output-based/03-dispatching-plain-object-without-thunk.md) — the exact error from dispatching a function with no thunk installed
- [04-getState-before-vs-after-next.md](output-based/04-getState-before-vs-after-next.md) — why `getState()` reflects different values before/after `next(action)`
- [05-error-thrown-in-reducer-uncaught.md](output-based/05-error-thrown-in-reducer-uncaught.md) — an uncaught reducer error propagating past a logger's own code
- [06-two-arg-vs-three-arg-middleware-signature.md](output-based/06-two-arg-vs-three-arg-middleware-signature.md) — a common arity typo that crashes on first dispatch
- [07-thunk-returning-a-promise.md](output-based/07-thunk-returning-a-promise.md) — why `await store.dispatch(thunk)` works, and what it resolves to

### scenarios/
- [01-adding-request-auth-headers-globally.md](scenarios/01-adding-request-auth-headers-globally.md) — centralizing auth-header attachment for 30+ thunks via middleware
- [02-analytics-middleware-for-product-events.md](scenarios/02-analytics-middleware-for-product-events.md) — tracking product events centrally instead of scattering calls across components
- [03-debugging-a-thunk-that-never-resolves.md](scenarios/03-debugging-a-thunk-that-never-resolves.md) — diagnosing a stuck spinner caused by an unhandled thunk promise rejection
- [04-choosing-thunk-vs-heavier-async-middleware.md](scenarios/04-choosing-thunk-vs-heavier-async-middleware.md) — recognizing when thunk's simplicity stops being enough (cancellation, sequencing)

### interview-qa/
- [01-middleware-mechanics.md](interview-qa/01-middleware-mechanics.md) — the signature, currying rationale, action transformation, `next` vs `dispatch`
- [02-thunk-and-async.md](interview-qa/02-thunk-and-async.md) — implementing thunk from memory, `getState`'s purpose, async lifecycle patterns, alternatives
- [03-enhancers-and-store-setup.md](interview-qa/03-enhancers-and-store-setup.md) — `applyMiddleware` as an enhancer, what enhancers can do beyond middleware, `configureStore`'s relationship to both

### problems/
- [01-implement-logging-middleware.md](problems/01-implement-logging-middleware.md) — build a from-scratch logger printing prev state, action, next state
- [02-implement-thunk-middleware.md](problems/02-implement-thunk-middleware.md) — build the ~5-line core of `redux-thunk`, plus an extra-argument bonus
- [03-implement-error-handling-middleware.md](problems/03-implement-error-handling-middleware.md) — build a middleware catching and reporting errors from reducers/other middleware

### assets/
- [README.md](assets/README.md) — placeholder for original notes' images/PDFs
