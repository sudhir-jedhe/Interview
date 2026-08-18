# How Middleware Enables Async Action Creators: Thunk

Plain Redux's `dispatch` only accepts plain objects — `dispatch(someAsyncFunction)` would throw ("Actions must be plain objects"). Async work (an API call, a `setTimeout`, reading `localStorage` asynchronously) has to happen *somewhere*, and reducers can't do it (they must be pure, synchronous, side-effect-free). Middleware is the layer where this problem gets solved.

## The core idea: let `dispatch` accept a function too

`redux-thunk` is a small middleware that checks: "is what was passed to `dispatch` a function instead of a plain object?" If so, instead of forwarding it to `next` (which would eventually hit the reducer and blow up), it **calls that function itself**, passing it `dispatch` and `getState`:

```javascript
// The actual thunk middleware, in full:
const thunk = (store) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};
```

That's the entire implementation — see `problems/02-implement-thunk-middleware.md` for a from-scratch walkthrough.

## What this unlocks: async action creators

With thunk installed, an "action creator" is no longer required to return a plain object — it can return a function that performs async work and dispatches real, plain-object actions once that work resolves:

```javascript
// A thunk action creator
function fetchUser(userId) {
  return async (dispatch, getState) => {
    dispatch({ type: 'user/fetchStarted' });
    try {
      const response = await fetch(`/api/users/${userId}`);
      const user = await response.json();
      dispatch({ type: 'user/fetchSucceeded', payload: user });
    } catch (error) {
      dispatch({ type: 'user/fetchFailed', payload: error.message, error: true });
    }
  };
}

// Usage — looks exactly like dispatching a normal action creator:
dispatch(fetchUser(42));
```

Note the three-action pattern (`pending`/`fulfilled`/`rejected`, or `Started`/`Succeeded`/`Failed`) — this is the idiomatic way to represent an async operation's lifecycle as a sequence of plain, synchronous actions, each independently handled by a reducer (e.g., setting a `loading` flag on `Started`, populating data on `Succeeded`, setting an `error` field on `Failed`). Redux Toolkit's `createAsyncThunk` automates generating exactly this three-action pattern; the manual version above shows what it does under the hood.

## Why this belongs in middleware, not the reducer or the component

- **Not the reducer**: reducers must be pure and synchronous; `await fetch(...)` is neither.
- **Could be the component**: technically a component's event handler *could* call `fetch` directly and then `dispatch` the result — and for one-off cases, that's fine. But centralizing async logic in thunk action creators means the same "fetch user and handle success/failure" logic is reusable from any dispatch site (a button, a route-change effect, another thunk), independently testable without rendering any component, and consistent regardless of which UI element triggered it.
- **Middleware is the natural home** because it's the one layer that already sits between "something wants to change state" and "the reducer," giving it the ability to intercept, delay, and eventually dispatch real actions — exactly what async orchestration needs.

## `getState` inside a thunk

Thunks receive `getState` specifically so they can make decisions based on current state before dispatching — e.g., skip a fetch if the data is already cached:

```javascript
function fetchUserIfNeeded(userId) {
  return (dispatch, getState) => {
    const existing = getState().users.byId[userId];
    if (existing) return; // already have it, skip the network call entirely
    return dispatch(fetchUser(userId));
  };
}
```

## Thunk is one option among several

Thunk is the simplest and most widely used async middleware, and Redux Toolkit includes it by default in `configureStore`. Other options exist for more complex async orchestration (Redux Saga for generator-based flows with cancellation, Redux Observable for RxJS-based streams) — those are out of scope here, but it's worth knowing in an interview that thunk is a deliberate simplicity choice, not the only possible design.
