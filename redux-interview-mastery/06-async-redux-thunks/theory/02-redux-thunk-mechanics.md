# redux-thunk Mechanics: Action Creators That Return Functions

`redux-thunk` is a genuinely tiny library — its entire implementation is a handful of lines — but understanding exactly what it does is a common interview probe, because it's easy to use it correctly without ever seeing how it works.

Normal Redux: `dispatch` expects a plain object with a `type` field. `redux-thunk`'s job is to intercept anything that *isn't* a plain object — specifically, a function — before it reaches the reducers, and instead of forwarding it to `next`, call that function directly, passing it `dispatch` and `getState`.

```javascript
// The actual implementation is roughly this:
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === 'function') {
      // it's a thunk — call it instead of passing it to the reducers
      return action(dispatch, getState, extraArgument);
    }
    // it's a normal action object — pass it through as usual
    return next(action);
  };
}

const thunk = createThunkMiddleware();
export default thunk;
```

This is the entire mechanism. When you write:

```javascript
function fetchUser(id) {
  // this is a "thunk" — a function, not a plain action object
  return async function (dispatch, getState) {
    dispatch({ type: 'user/fetchStarted' });
    try {
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      dispatch({ type: 'user/fetchSucceeded', payload: data });
    } catch (err) {
      dispatch({ type: 'user/fetchFailed', payload: err.message });
    }
  };
}

// component code:
dispatch(fetchUser(42));
```

`dispatch(fetchUser(42))` calls `fetchUser(42)`, which returns the inner `async function`. That returned function is itself what gets passed to `dispatch` — and because `redux-thunk` is registered as middleware, it intercepts it, sees it's a function (not a plain object), and calls it as `thunkFn(dispatch, getState)` instead of forwarding it toward the reducers. The inner function is free to dispatch as many additional plain actions as it wants, in sequence, over any span of time, using the exact same `dispatch` the rest of the app uses.

A few mechanical details worth internalizing:

- **The thunk function itself is never seen by any reducer.** Reducers only ever receive plain `{ type, ... }` objects — thunks are consumed entirely by the middleware layer.
- **`getState` lets a thunk make decisions based on current state** before dispatching — e.g., bail out early if data is already cached, or read an auth token to attach to a request.
- **The thunk middleware must be registered**, or dispatching a function throws `Actions must be plain objects` — there is no "async support" without it. `configureStore` from Redux Toolkit adds it automatically; with plain `createStore`, you must `applyMiddleware(thunk)` yourself.
- **A thunk can return a value**, typically the promise itself, which lets calling code `await dispatch(fetchUser(42))` and know when the whole operation (including all the dispatches inside it) has completed.

The mental model to walk an interviewer through: middleware is a chain, `redux-thunk` is one link in that chain whose entire job is "if this dispatched thing is a function, call it with dispatch/getState instead of sending it to the reducers" — everything else about async Redux (loading states, error handling, sequencing) is just application code written inside that function, not anything the library itself prescribes.
