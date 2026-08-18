# 06 — Async Redux with Thunks

Reducers must stay pure and synchronous, so async work (network requests, timers) can't live inside them. This topic covers `redux-thunk` — the middleware that lets an action creator return a function instead of a plain object, unlocking async orchestration — the standard pending/fulfilled/rejected flow, loading/error modeling, `redux-saga` as an alternative for complex coordination, and when to stop hand-rolling this and reach for `createAsyncThunk`.

## Key points

- **Why middleware at all** — Redux's `dispatch` only accepts plain objects by default; a thunk (a function returned from an action creator) is invalid unless `redux-thunk` middleware is registered to recognize and call it with `dispatch`/`getState` instead of forwarding it to reducers.
- **Thunk mechanics** — the entire middleware is: if the dispatched value is a function, call it with `(dispatch, getState, extraArgument)`; otherwise pass it through via `next(action)`. No magic beyond that.
- **The pending/fulfilled/rejected flow** — dispatch a "started" action synchronously, then dispatch either a success or failure action once the async work settles; model this as a `status` enum, not a loose boolean, to avoid representing impossible state combinations.
- **Loading/error patterns** — scope status per-resource (not one global flag shared by unrelated requests), guard against stale/out-of-order responses with a request id, and use structured error objects rather than bare strings when the UI needs more than a message.
- **redux-saga (conceptual)** — generator-based, declarative effects (`call`, `put`, `race`, `takeLatest`, `debounce`) that make cancellation and complex coordination easier to express than hand-rolled thunk logic, at the cost of a steeper learning curve.
- **When to reach for `createAsyncThunk` instead** — almost always, for the standard "fetch and track status" shape; hand-written thunks remain the right tool for one-off orchestration logic that doesn't fit that shape, and for understanding what RTK is automating.

## Index

### theory/
- `01-why-middleware-for-async.md` — reducer purity, why async can't live there, middleware as the escape hatch.
- `02-redux-thunk-mechanics.md` — the thunk middleware's implementation and exact call contract.
- `03-async-flow-pending-fulfilled-rejected.md` — the standard three-action pattern and why two states aren't enough.
- `04-loading-error-state-patterns.md` — per-resource status, stale-request guards, structured errors, resetting error on retry.
- `05-redux-saga-comparison.md` — generators/effects vs. promises, where sagas genuinely win, and the adoption tradeoff.
- `06-when-to-use-create-async-thunk.md` — the practical default (RTK) vs. when hand-written thunks still make sense.

### snippets/
- `01-basic-thunk.js` — minimal thunk with pending/fulfilled/rejected dispatches.
- `02-thunk-with-getstate.js` — using `getState()` to skip a redundant fetch.
- `03-thunk-middleware-from-scratch.js` — the entire `redux-thunk` middleware reimplemented.
- `04-cancellable-fetch-thunk.js` — `AbortController`-based cancellation tied to component unmount.
- `05-sequential-thunk-actions.js` — a multi-step thunk with independent per-step error handling.
- `06-debounced-search-thunk.js` — debounced dispatch with a staleness guard.
- `07-saga-vs-thunk-pseudo.js` — the same debounced search expressed as a thunk vs. a saga.

### output-based/
- `01-thunk-return-value.md` — async/await ordering when a thunk's return value is awaited by the caller.
- `02-missing-thunk-middleware.md` — the exact error thrown when thunk middleware isn't registered.
- `03-getstate-stale-closure.md` — a captured `getState()` snapshot going stale across an `await`.
- `04-unhandled-promise-rejection.md` — a thunk missing `try/catch`, silently stuck in "loading" forever.
- `05-race-condition-out-of-order-responses.md` — concurrent requests resolving out of dispatch order.
- `06-dispatch-inside-thunk-timing.md` — sync vs. macrotask-deferred dispatch ordering with subscribers.
- `07-thunk-vs-plain-object-action.md` — how middleware order determines what a logger middleware actually sees.

### scenarios/
- `01-cancel-fetch-on-unmount.md` — fixing "state update on unmounted component" warnings with abort + staleness guard.
- `02-multi-step-checkout-flow.md` — per-step error handling so a non-critical step's failure can't cause double-charging.
- `03-debounced-search-as-you-type.md` — debounce + staleness guard for a live search box.
- `04-retry-with-backoff.md` — retrying only transient (5xx/network) errors with exponential backoff.

### interview-qa/
- `01-thunk-fundamentals-qa.md` — why reducers can't fetch, thunk middleware mechanics, the missing-middleware error, the three-action pattern.
- `02-async-patterns-qa.md` — cancellation on unmount, stale-response races, debouncing vs. throttling.
- `03-thunk-vs-saga-vs-rtk-qa.md` — imperative vs. declarative effects, concrete saga wins, and the practical default today.

### problems/
- `01-hand-written-async-thunk-with-cancellation.md` — a fetch thunk with loading/error state and unmount cancellation, no RTK.
- `02-sequential-multi-action-thunk.md` — a four-step publish flow with distinct per-step error handling.
- `03-debounced-dispatch-thunk.md` — debounced search-as-you-type built from a plain timer and a thunk.

### assets/
- `README.md` — placeholder for original notes' images/PDFs.
