## What does this log, and in what order?

```javascript
function fetchData() {
  return async (dispatch) => {
    dispatch({ type: 'data/pending' });
    const data = await Promise.resolve({ id: 1, name: 'thing' });
    dispatch({ type: 'data/fulfilled', payload: data });
    return data;
  };
}

async function run(store) {
  console.log('before dispatch');
  const result = await store.dispatch(fetchData());
  console.log('after dispatch', result);
}

run(store);
console.log('after run() call');
```

**Answer:**
```
before dispatch
after run() call
after dispatch { id: 1, name: 'thing' }
```

**Why:** `run` is an async function; calling it starts executing synchronously up through the first `await`, so `'before dispatch'` logs immediately. `store.dispatch(fetchData())` — because `redux-thunk` calls the returned function and directly returns whatever that function returns — evaluates to a Promise (the `async (dispatch) => {...}` function's own return value, since it's itself an async function). `await`ing that promise suspends `run` and control returns to the caller, so the synchronous `console.log('after run() call')` on the last line runs next, before the promise settles. Only once the microtask queue processes the resolved `Promise.resolve(...)` inside the thunk does execution resume inside `run`, dispatching `data/fulfilled` and then logging `'after dispatch', result`. This is the mechanic that makes `await dispatch(someThunk())` meaningful at all: `dispatch` on a thunk returns exactly what the thunk function returns, which composes naturally with `async`/`await` at the call site.
