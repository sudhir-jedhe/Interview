# 02 — Actions and Reducers

The mechanics of how state actually changes: the shape of actions, how to create them, the strict purity rules reducers must follow, and how classic hand-written reducers compare to Redux Toolkit's `createSlice`. This topic is where "I know the theory" gets tested against "I can spot a mutation bug in a code review."

## Summary

- Actions are plain objects describing **what happened**, conventionally shaped as **Flux Standard Actions**: `{ type, payload, error?, meta? }`. `type` is required; everything else is convention, but a near-universal one.
- **Action creators** are just functions returning action objects — they centralize action shape, and are a legitimate place for non-determinism (`Date.now()`, generated IDs) that must never appear inside the reducer itself.
- **Reducers must be pure**: `(state, action) => newState`, no mutation, no side effects, no non-determinism. Violating purity breaks re-renders (mutation) and/or time-travel replay (non-determinism, side effects).
- The **classic switch-statement pattern** and **Redux Toolkit's `createSlice`** produce the same runtime contract. `createSlice` wraps reducers in **Immer**, letting you write mutating-looking syntax (`state.items.push(x)`) that safely produces real immutable updates behind the scenes — but the exact same line in a hand-written reducer is a real, state-breaking bug.
- An unhandled action type must hit a `default` case returning the **exact same state reference** unchanged — not a shallow copy, not `undefined`.
- Large apps **split reducers by state-tree domain** (not by UI feature) via `combineReducers`/`configureStore`, and use cross-slice action matching (`extraReducers` or a shared `case`) — never direct reducer-to-reducer calls — to react across domain boundaries.

## Key bullets to remember for interviews

- Mutation bugs are the single most common real-world Redux bug: data looks correct in `console.log`/DevTools, but the UI doesn't re-render, because `useSelector`/`connect` rely on reference equality, not deep equality.
- Immer only makes mutation safe *inside* `createSlice`/`createReducer`'s producer function — nowhere else.
- A reducer can never both mutate the Immer draft *and* return a new value — Immer throws if you do both.
- Prefer matching `extraReducers` against an imported action creator, not a hand-typed string, so a slice rename can't silently break a cross-slice reaction.
- Non-determinism (`Math.random()`, `Date.now()`, generated IDs) belongs in the action creator/`prepare` callback, never inside the reducer.

## Index

### theory/
- [01-action-shape-and-fsa.md](theory/01-action-shape-and-fsa.md) — the `{ type, payload }` convention, Flux Standard Actions, naming conventions, what an action is not
- [02-action-creators.md](theory/02-action-creators.md) — hand-written vs `createSlice`-generated action creators, the `prepare` callback
- [03-pure-reducers.md](theory/03-pure-reducers.md) — the three purity rules and why each one specifically enables Redux's guarantees
- [04-classic-vs-createSlice.md](theory/04-classic-vs-createSlice.md) — full side-by-side comparison, and how Immer makes mutating syntax safe
- [05-splitting-and-composing-reducers.md](theory/05-splitting-and-composing-reducers.md) — domain-based splitting, `combineReducers`, and cross-slice reactions via `extraReducers`

### snippets/
- [01-fsa-action-creators.js](snippets/01-fsa-action-creators.js) — hand-written FSA-shaped action creators, including an error action
- [02-classic-switch-reducer.js](snippets/02-classic-switch-reducer.js) — a full classic reducer with manual immutable updates
- [03-createSlice-equivalent.js](snippets/03-createSlice-equivalent.js) — the same logic via `createSlice` and Immer
- [04-generic-createReducer-helper.js](snippets/04-generic-createReducer-helper.js) — a lookup-table-based reducer builder
- [05-immutable-nested-update.js](snippets/05-immutable-nested-update.js) — the pain of manual deep-nested spreads, without Immer
- [06-cross-slice-reset-on-logout.js](snippets/06-cross-slice-reset-on-logout.js) — `extraReducers` reacting to another slice's action

### output-based/
- [01-mutation-breaks-reference-equality.md](output-based/01-mutation-breaks-reference-equality.md) — direct mutation returning the same reference
- [02-spread-shallow-copy-trap.md](output-based/02-spread-shallow-copy-trap.md) — a top-level spread that leaves nested data mutated
- [03-non-deterministic-reducer.md](output-based/03-non-deterministic-reducer.md) — `Math.random()` inside a reducer breaking replay determinism
- [04-createSlice-forgetting-to-return-or-mutate.md](output-based/04-createSlice-forgetting-to-return-or-mutate.md) — mutating the draft AND returning a value in the same reducer
- [05-missing-default-case.md](output-based/05-missing-default-case.md) — a `switch` with no `default`, returning `undefined`
- [06-array-splice-in-place.md](output-based/06-array-splice-in-place.md) — `.splice()` retroactively mutating a captured "before" snapshot
- [07-extraReducers-action-creator-vs-string.md](output-based/07-extraReducers-action-creator-vs-string.md) — a hardcoded action-type string silently breaking after a rename

### scenarios/
- [01-stale-ui-after-mutation-bug.md](scenarios/01-stale-ui-after-mutation-bug.md) — diagnosing "DevTools shows the right data, the screen doesn't update"
- [02-migrating-legacy-reducers-to-createSlice.md](scenarios/02-migrating-legacy-reducers-to-createSlice.md) — incrementally migrating 40 classic reducers to Redux Toolkit
- [03-inconsistent-action-naming-across-team.md](scenarios/03-inconsistent-action-naming-across-team.md) — standardizing on FSA across three teams' divergent conventions
- [04-reducer-growing-unmanageable.md](scenarios/04-reducer-growing-unmanageable.md) — splitting an 800-line reducer to eliminate recurring merge conflicts

### interview-qa/
- [01-actions-and-conventions.md](interview-qa/01-actions-and-conventions.md) — FSA rationale, command vs event naming, what's legal to dispatch, non-determinism placement
- [02-reducer-purity-and-mutation.md](interview-qa/02-reducer-purity-and-mutation.md) — what mutation mechanically breaks, how Immer makes it safe, the mutate-or-return rule
- [03-composition-and-architecture.md](interview-qa/03-composition-and-architecture.md) — cross-slice reactions, `extraReducers` matching, domain-based splitting rationale

### problems/
- [01-todo-reducer-classic-vs-createSlice.md](problems/01-todo-reducer-classic-vs-createSlice.md) — add/remove/toggle/edit todo reducer in both styles, compared side by side
- [02-implement-createReducer-helper.md](problems/02-implement-createReducer-helper.md) — build a generic lookup-table-based `createReducer` from scratch
- [03-fix-the-mutating-reducer.md](problems/03-fix-the-mutating-reducer.md) — diagnose and fix a real mutation bug causing inconsistent re-renders

### assets/
- [README.md](assets/README.md) — placeholder for original notes' images/PDFs
