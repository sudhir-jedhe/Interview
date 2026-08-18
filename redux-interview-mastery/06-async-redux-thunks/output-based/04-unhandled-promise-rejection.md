## What happens in the console when the fetch fails?

```javascript
function fetchProfile(id) {
  return (dispatch) => {
    dispatch({ type: 'profile/pending' });
    fetch(`/api/users/${id}`) // no `await`, no `.catch(...)`
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'profile/fulfilled', payload: data }));
  };
}

store.dispatch(fetchProfile(999)); // this id doesn't exist -> the fetch rejects
```

**Answer:** The `profile/fulfilled` action never dispatches, `profile/pending` is the last thing the store sees, and the browser/Node logs an **unhandled promise rejection** warning — the UI is left stuck in a permanent "loading" state with no error ever surfacing to the reducer or the user.

**Why:** The thunk function itself doesn't `return` the promise chain, and there's no `.catch()` anywhere in it. If `fetch` rejects (network failure) or `res.json()` throws (malformed response) or the response is a non-2xx status that the code never checks (`res.ok` is never inspected here), the rejection propagates up the `.then()` chain with nowhere to go — it's a promise that nobody is awaiting and nobody attached a rejection handler to, so the runtime reports it as unhandled. Crucially, this fails *silently* from Redux's perspective: no `rejected`/`failed` action is ever dispatched, so the reducer has no way to know anything went wrong, and the UI (driven purely by dispatched actions) stays on `status: 'loading'` forever. The fix requires both wrapping the logic in `try/catch` (or attaching `.catch()`) and dispatching a `rejected` action from inside it — exactly the discipline `createAsyncThunk` enforces structurally, since it always dispatches `rejected` on any thrown error from the payload creator, making this specific bug much harder to write by accident.
