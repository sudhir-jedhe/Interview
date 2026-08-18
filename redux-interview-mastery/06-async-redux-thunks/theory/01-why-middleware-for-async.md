# Why Redux Needs Middleware for Async Work

Redux's reducer contract is deliberately strict: `(state, action) => newState`, and it must be a **pure function** — no side effects, no async work, no randomness, no reading the clock, no network calls. Given the same `state` and `action`, a reducer must always produce the same `newState`. This isn't an arbitrary rule; it's what makes the entire Redux mental model work — predictable state transitions, time-travel debugging, and reliably replaying a sequence of actions to reproduce a bug all depend on reducers being pure.

But real apps need to fetch data, and a network request is the textbook definition of an impure, asynchronous operation: it takes time, it can fail, and its result isn't a deterministic function of your current state. So where does that logic go?

`dispatch` by default only accepts a plain action object — `{ type, payload }` — and immediately, synchronously, runs it through every reducer. There's no built-in way to say "dispatch this action, but only after this promise resolves" using the base `createStore`/`dispatch` API alone. If you tried to put async logic inside a reducer, you'd break purity and Redux would have no way to know when the async work finishes or what to do with the result.

```javascript
// This does NOT work — reducers can't be async, and can't dispatch
function userReducer(state, action) {
  if (action.type === 'user/fetchRequested') {
    fetch(`/api/users/${action.payload}`).then((res) => res.json()); // side effect in a reducer — wrong
    return state; // and there's no way to get the result back into state from here
  }
  return state;
}
```

The fix is **middleware**: a function that sits between `dispatch` and the reducer, intercepting every dispatched action before it reaches the reducers, with the ability to inspect it, delay it, transform it, dispatch other actions, or block it entirely. Middleware is where Redux's "escape hatch" for side effects lives — it's the layer that's allowed to be impure, precisely so the reducer layer doesn't have to be.

```javascript
// The core middleware signature: store => next => action => result
const exampleMiddleware = (store) => (next) => (action) => {
  // can inspect `action`, call store.getState(), dispatch more actions,
  // delay calling next(action), or skip it entirely
  return next(action); // passes the action further down the chain, eventually to the reducer
};
```

`redux-thunk` is the simplest, most widely used middleware for this exact problem: it lets an action creator return a *function* (instead of a plain object), and the middleware recognizes that function and calls it with `dispatch` and `getState`, letting that function orchestrate as much async work and as many subsequent dispatches as it needs. That's the subject of the next file — but the important framing for an interview is: **Redux doesn't have "built-in async support" — thunks (or sagas, or RTK Query, or any other async middleware) are how the community filled that intentional gap**, and Redux itself was designed to stay minimal and let this be solved at the middleware layer rather than baked into the core.
