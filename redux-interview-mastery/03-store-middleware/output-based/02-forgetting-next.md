# Output: A middleware that forgets to call `next`

```javascript
const { createStore, applyMiddleware } = require('redux');

const brokenMiddleware = (store) => (next) => (action) => {
  console.log('saw action:', action.type);
  // forgot: return next(action);
};

function reducer(state = { count: 0 }, action) {
  if (action.type === 'increment') return { count: state.count + 1 };
  return state;
}

const store = createStore(reducer, applyMiddleware(brokenMiddleware));

store.dispatch({ type: 'increment' });
store.dispatch({ type: 'increment' });

console.log(store.getState());
```

**Answer:** Logs `saw action: increment` twice, then `{ count: 0 }`.

**Why:** Without calling `next(action)`, the action never reaches the next middleware in the chain — and since this is the only middleware, it never reaches the reducer at all. `dispatch` completes "successfully" (no error is thrown; `brokenMiddleware`'s function just implicitly returns `undefined`), which is what makes this bug particularly dangerous: there's no crash, no warning, just a store that silently never updates. This is one of the most common real bugs when writing custom middleware from scratch, especially under interview time pressure — always double-check that every code path in a middleware either calls `next(action)` (or `store.dispatch(...)` with a transformed/new action) or deliberately intends to block the action.
