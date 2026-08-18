# Output: `getState()` called before vs after `next(action)`

```javascript
const { createStore, applyMiddleware } = require('redux');

const middleware = (store) => (next) => (action) => {
  const before = store.getState().count;
  const result = next(action);
  const after = store.getState().count;
  console.log({ before, after });
  return result;
};

function reducer(state = { count: 0 }, action) {
  if (action.type === 'increment') return { count: state.count + 1 };
  return state;
}

const store = createStore(reducer, applyMiddleware(middleware));
store.dispatch({ type: 'increment' });
```

**Answer:** `{ before: 0, after: 1 }`

**Why:** `next(action)` is what actually drives the action the rest of the way to the reducer (directly, if this is the last/only middleware, or through the remaining chain otherwise) — the reducer runs, and the store commits the new state, *synchronously, inside that call to `next(action)`*. So `store.getState()` called before `next(action)` reflects the state prior to this dispatch, and calling it again after `next(action)` returns reflects the state the reducer just produced. This before/after pattern is the entire mechanism a logging middleware relies on, and it only works because `next` is a plain synchronous function call for synchronous actions — if the action were itself asynchronous (e.g., you're inside a thunk awaiting a promise before dispatching), the "after" read would need to happen after that async work resolves, not immediately after the synchronous `next` call.
