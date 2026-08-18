# Reducers as Pure Functions

A reducer has the signature `(state, action) => newState`. For Redux's guarantees (predictable updates, correct re-renders, time-travel debugging) to hold, a reducer must be a **pure function**: no mutation of its inputs, no side effects, and no non-determinism.

## Rule 1: never mutate `state` or `action`

```javascript
// WRONG — mutates the existing array/object in place
function badReducer(state = { items: [] }, action) {
  switch (action.type) {
    case 'cart/itemAdded':
      state.items.push(action.payload); // mutation!
      return state; // same reference — useSelector/connect won't detect a change
    default:
      return state;
  }
}

// RIGHT — returns new objects/arrays, leaves the originals untouched
function goodReducer(state = { items: [] }, action) {
  switch (action.type) {
    case 'cart/itemAdded':
      return { ...state, items: [...state.items, action.payload] };
    default:
      return state;
  }
}
```

Mutation is dangerous specifically because `useSelector`/`connect` decide whether to re-render by comparing *references*, not deep-comparing values by default. A mutated object has the same reference before and after, so subscribed components silently fail to update — no error, just a stale UI. See `output-based/` in this folder for worked examples.

## Rule 2: no side effects

A reducer must not make network requests, write to `localStorage`, log unconditionally to an external service, dispatch other actions, or otherwise reach outside the pure `(state, action) -> newState` computation. Side effects belong in middleware (thunks, listener middleware) that run *around* dispatch, not inside the reducer itself.

## Rule 3: no non-determinism

A reducer must not call `Date.now()`, `Math.random()`, generate a random ID, or read any other external, changing value directly — because the same `(state, action)` pair must always produce the same `newState`. If an action needs a timestamp or generated ID, compute it in the **action creator** (before the action is dispatched) and pass it in as part of the payload, so the reducer just consumes already-fixed data.

```javascript
// WRONG — non-deterministic inside the reducer
case 'log/entryAdded':
  return { ...state, entries: [...state.entries, { text: action.payload, at: Date.now() }] };

// RIGHT — timestamp fixed at action-creation time, reducer just consumes it
// action creator:
const entryAdded = (text) => ({ type: 'log/entryAdded', payload: { text, at: Date.now() } });
// reducer:
case 'log/entryAdded':
  return { ...state, entries: [...state.entries, action.payload] };
```

## Why purity specifically enables time-travel debugging

Redux DevTools' "jump to a past action" feature works by replaying the recorded sequence of actions against the initial state up to that point. This is only correct if the reducer is a pure function of `(state, action)` — if it also depended on the wall-clock time it happened to run, or mutated shared objects, replaying it later (potentially seconds, minutes, or in a bug report days later) would produce a different result than what actually happened live. Purity is what makes "replay = reproduce" a valid assumption.

## `createSlice` and purity

Redux Toolkit's `createSlice` reducers are allowed to *look* like they mutate state (`state.items.push(...)`) because Immer intercepts those operations and produces a real immutable update behind the scenes — the reducer function you write is still conceptually pure from Redux's perspective (same inputs always produce the same computed output), Immer just changes *how* you're allowed to express "produce a new state" syntactically. See `04-classic-vs-createSlice.md` for a full side-by-side.
