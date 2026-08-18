# Output: Does `dispatch(thunk)` return a promise you can `await`?

```javascript
const { createStore, applyMiddleware } = require('redux');
const { thunk } = require('redux-thunk');

function reducer(state = { value: null }, action) {
  if (action.type === 'set') return { value: action.payload };
  return state;
}

const store = createStore(reducer, applyMiddleware(thunk));

function delayedSet(value) {
  return async (dispatch) => {
    await new Promise((resolve) => setTimeout(resolve, 10));
    dispatch({ type: 'set', payload: value });
    return 'done'; // the thunk's own return value
  };
}

async function main() {
  const result = await store.dispatch(delayedSet(42));
  console.log(result);
  console.log(store.getState());
}

main();
```

**Answer:** Logs `'done'`, then `{ value: 42 }` — in that order, after roughly a 10ms delay.

**Why:** The thunk middleware's implementation is `return action(store.dispatch, store.getState);` — it directly returns whatever the thunk function itself returns. Since `delayedSet(42)` returns an `async` function, calling it produces a `Promise`, and thunk's `return` propagates that promise straight back out through `store.dispatch(...)`. This is why `await store.dispatch(someAsyncThunk())` works as expected: `dispatch`'s return value, for a thunk action, is *whatever the thunk function returns*, not some special Redux-provided value — for a plain synchronous action it would just be the action object itself (Redux's default `dispatch` behavior), but middleware is free to change what gets returned, and thunk deliberately does so to let calling code `await` async completion and read whatever value the thunk chose to return (here, `'done'`).
