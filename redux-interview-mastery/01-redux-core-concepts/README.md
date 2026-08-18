# 01 — Redux Core Concepts

The foundation everything else builds on: what Redux actually is, why it exists, and how data moves through a Redux application. Interviewers use this topic to separate candidates who memorized the API from candidates who understand the design rationale — expect "why," not just "what," questions.

## Summary

- Redux centers on **three principles**: single source of truth (one store holds the whole app's state tree), state is read-only (the only way to change it is dispatching an action describing what happened), and changes happen via pure reducer functions (`(state, action) => newState`, no mutation, no side effects, no non-determinism).
- Data flows in one direction only: **action → reducer → new state → view re-render**. There is no shortcut path where a view mutates state directly; every change traces back to exactly one dispatched action.
- Redux exists to make state **predictable and debuggable** in complex apps with shared state across distant components — it buys time-travel debugging, a single inspectable action log, and freedom from prop drilling, at the cost of added indirection and boilerplate.
- The **store** is a small, framework-agnostic object (`getState`, `dispatch`, `subscribe`, `replaceReducer`) — not a React concept. `Provider`/`useSelector` are a convenience layer on top of it, not the thing itself.
- The most commonly tested judgment call: **Redux vs local/component state**. Default to local state; centralize only when state is shared across distant components, has non-trivial shared update logic, or needs traceability/middleware/persistence.

## Key bullets to remember for interviews

- `combineReducers` runs every slice reducer on every action; each slice decides independently (via its own `switch`/`default`) whether to respond.
- An unhandled action type must return the *same* state reference in the `default` case — this preserves reference equality for `useSelector`/`connect`.
- `store.subscribe` fires on every dispatch regardless of whether "relevant" state changed; `useSelector` adds the reference-equality filtering on top.
- Reducers may not call `dispatch` — real Redux throws if you try; side effects (including triggering more actions) don't belong in reducers.
- `createSlice`'s "mutating" syntax is safe only because of Immer producing new immutable state under the hood — the same code without `createSlice`/Immer would be a real, state-breaking mutation.

## Index

### theory/
- [01-three-principles.md](theory/01-three-principles.md) — single source of truth, read-only state, pure-function updates, and why interviewers probe violations
- [02-unidirectional-data-flow.md](theory/02-unidirectional-data-flow.md) — the action → reducer → state → view loop, traced through an "add to cart" example, and where async fits in
- [03-why-redux-exists.md](theory/03-why-redux-exists.md) — the problems Redux solves (shared state, complex updates, debuggability) and what it costs
- [04-when-to-use-redux.md](theory/04-when-to-use-redux.md) — the decision framework for Redux vs local state vs Context, with a concrete checklist
- [05-the-store.md](theory/05-the-store.md) — the store's public API, what it is/isn't, and how it relates to component state structurally

### snippets/
- [01-basic-store-setup.js](snippets/01-basic-store-setup.js) — classic `createStore`, dispatch, subscribe
- [02-configure-store-rtk.js](snippets/02-configure-store-rtk.js) — modern `configureStore` + `createSlice` equivalent
- [03-combine-reducers.js](snippets/03-combine-reducers.js) — merging independent slices into one root tree
- [04-subscribe-and-unsubscribe.js](snippets/04-subscribe-and-unsubscribe.js) — listener lifecycle and the "fires on every dispatch" behavior
- [05-replace-reducer.js](snippets/05-replace-reducer.js) — swapping the root reducer at runtime without losing state
- [06-derived-selector.js](snippets/06-derived-selector.js) — plain selector functions for reading derived data from the tree

### output-based/
- [01-subscribe-fires-on-every-dispatch.md](output-based/01-subscribe-fires-on-every-dispatch.md) — does `subscribe` fire for actions unrelated to any reducer case?
- [02-unknown-action-default-case.md](output-based/02-unknown-action-default-case.md) — reference identity after an unhandled action type
- [03-dispatch-inside-reducer.md](output-based/03-dispatch-inside-reducer.md) — what happens when a reducer calls `dispatch`
- [04-getstate-during-construction.md](output-based/04-getstate-during-construction.md) — initial state before any app action is dispatched
- [05-object-identity-after-noop-action.md](output-based/05-object-identity-after-noop-action.md) — a "looks immutable" update that isn't (`Array.prototype.sort`)
- [06-combineReducers-key-mismatch.md](output-based/06-combineReducers-key-mismatch.md) — every slice reducer runs on every action, not just "its" actions
- [07-immer-mutation-in-rtk.md](output-based/07-immer-mutation-in-rtk.md) — why `state.push(...)` is safe inside `createSlice` but not in a plain reducer

### scenarios/
- [01-cross-team-shared-cart-state.md](scenarios/01-cross-team-shared-cart-state.md) — three components disagreeing about cart contents, fixed by a single source of truth
- [02-overusing-redux-for-a-modal.md](scenarios/02-overusing-redux-for-a-modal.md) — code-review pushback on putting purely local UI state into Redux
- [03-debugging-a-production-incident-with-time-travel.md](scenarios/03-debugging-a-production-incident-with-time-travel.md) — reproducing an "unreproducible" bug by replaying a captured action log
- [04-migrating-a-legacy-jquery-widget.md](scenarios/04-migrating-a-legacy-jquery-widget.md) — subscribing a non-React widget directly to the same store

### interview-qa/
- [01-principles-and-philosophy.md](interview-qa/01-principles-and-philosophy.md) — the three principles, what violating each one breaks in practice
- [02-data-flow-and-store-mechanics.md](interview-qa/02-data-flow-and-store-mechanics.md) — the full click-to-render pipeline, multi-dispatcher ordering, initial state, `replaceReducer` use cases
- [03-redux-vs-local-state-judgment.md](interview-qa/03-redux-vs-local-state-judgment.md) — pushing back on "always use Redux," Context vs Redux, code-review tells for misplaced state

### problems/
- [01-implement-createStore.md](problems/01-implement-createStore.md) — build a minimal `createStore` with `getState`/`dispatch`/`subscribe` from scratch
- [02-implement-combineReducers.md](problems/02-implement-combineReducers.md) — build `combineReducers` from scratch, including the reference-equality optimization
- [03-trace-add-to-cart-data-flow.md](problems/03-trace-add-to-cart-data-flow.md) — full written + diagrammed trace of an "add to cart" dispatch through to re-render

### assets/
- [README.md](assets/README.md) — placeholder for original notes' images/PDFs
