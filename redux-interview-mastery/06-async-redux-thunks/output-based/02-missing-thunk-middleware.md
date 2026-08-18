## What happens when this runs?

```javascript
import { createStore } from 'redux';

function reducer(state = { count: 0 }, action) {
  if (action.type === 'increment') return { count: state.count + 1 };
  return state;
}

const store = createStore(reducer); // no middleware applied at all

function incrementAsync() {
  return (dispatch) => {
    setTimeout(() => dispatch({ type: 'increment' }), 100);
  };
}

store.dispatch(incrementAsync());
```

**Answer:** It throws synchronously, immediately, on the `store.dispatch(incrementAsync())` line: `Error: Actions must be plain objects. Instead, the actual type was: 'function'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions.` The `setTimeout` callback inside never runs because the thunk function itself is never called.

**Why:** `createStore(reducer)` with no middleware means `dispatch` is Redux's bare, default implementation, which validates that every dispatched value is a plain object with a `type` property (via `isPlainObject`) and throws otherwise. `incrementAsync()` returns a function, not a plain object — without `redux-thunk` (or equivalent) registered via `applyMiddleware`, there's nothing in the dispatch pipeline that recognizes "this is a thunk, call it instead of validating it as an action." This is the single most common "async isn't working" bug in a hand-rolled Redux setup: the thunk code is written correctly, but the store was configured with `createStore(reducer)` alone, forgetting `applyMiddleware(thunkMiddleware)`. Notably, `configureStore` from Redux Toolkit sidesteps this entire class of bug by including the thunk middleware by default, which is one of the concrete reasons RTK is recommended over plain `createStore`.
