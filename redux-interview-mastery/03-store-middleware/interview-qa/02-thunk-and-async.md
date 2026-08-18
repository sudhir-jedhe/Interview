# Interview Q&A: Thunk and Async Patterns

**Q: Implement the entire `redux-thunk` middleware from memory.**
A:
```javascript
const thunk = (store) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};
```
That's the complete implementation — roughly 5 meaningful lines. It checks whether the dispatched value is a function; if so, it calls that function directly with `dispatch` and `getState`, bypassing `next` entirely (the function itself is responsible for eventually calling `dispatch` with real plain-object actions); otherwise, it passes the action through unchanged.

**Q: Why does a thunk action creator receive `getState` as a second argument? Give a concrete use case.**
A: So async logic can make decisions based on current state before dispatching — e.g., skipping a redundant network request if the needed data is already cached (`if (getState().users.byId[id]) return;`), or reading an auth token to attach to an outgoing request. Without `getState`, a thunk would only be able to act on the arguments it was called with, not on the app's actual current state at the moment it runs (which might differ from when the thunk was originally dispatched, especially after any `await`).

**Q: What's the idiomatic pattern for representing a single async operation's lifecycle as Redux actions?**
A: A three-action pattern — commonly `pending`/`fulfilled`/`rejected` (Redux Toolkit's `createAsyncThunk` convention) or `Started`/`Succeeded`/`Failed`. `pending` typically sets a loading flag; `fulfilled` stores the result and clears loading/error; `rejected` stores an error message and clears loading. Each is a plain, synchronous action independently handled by the reducer — the thunk's job is just to dispatch the right one at the right time based on how the async work resolves.

**Q: Is thunk the only way to handle async logic in Redux? When would you reach for something else?**
A: No — thunk is the simplest, most common option (and Redux Toolkit's default), suited to straightforward "fetch and dispatch the result" flows. For more complex orchestration — cancellation, sequencing/debouncing overlapping requests, complex retry logic — Redux Saga (generator-based effects) or RTK Query (a purpose-built data-fetching/caching layer) are often better fits, because they provide primitives for those specific problems instead of requiring you to hand-roll them with `AbortController`s and manual flags inside a thunk.
