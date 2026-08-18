# Output: An uncaught error thrown inside a reducer, with no error-handling middleware

```javascript
const { createStore, applyMiddleware } = require('redux');

const logger = (store) => (next) => (action) => {
  console.log('before dispatch');
  const result = next(action);
  console.log('after dispatch'); // will this line run?
  return result;
};

function reducer(state = { value: 0 }, action) {
  if (action.type === 'divide') {
    if (action.payload === 0) throw new Error('Division by zero');
    return { value: state.value / action.payload };
  }
  return state;
}

const store = createStore(reducer, applyMiddleware(logger));

try {
  store.dispatch({ type: 'divide', payload: 0 });
} catch (e) {
  console.log('caught at call site:', e.message);
}
```

**Answer:** Logs `before dispatch`, then `caught at call site: Division by zero` — **`after dispatch` never logs.**

**Why:** `next(action)` synchronously calls into the reducer; when the reducer throws, that exception propagates back up through `next(action)`'s call frame, meaning `logger`'s own code never reaches the line after `const result = next(action);` — the exception unwinds straight out of `logger`'s inner function too, all the way to wherever `dispatch` was originally called. `store.dispatch(...)` itself doesn't catch anything on your behalf; whoever calls `dispatch` is responsible for handling any exception a reducer throws, unless some middleware in the chain specifically wraps `next(action)` in a `try/catch` (as in `03-store-middleware/snippets/03-error-catching-middleware.js`) to intercept it before it reaches the call site. This is precisely the gap an error-catching/crash-reporting middleware is designed to close — see `problems/03-implement-error-handling-middleware.md`.
