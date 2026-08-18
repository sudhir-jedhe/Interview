// A thunk that reads current state via getState() before deciding what to do —
// a classic "avoid a redundant network request" pattern.
export function fetchUserIfNeeded(id) {
  return async function (dispatch, getState) {
    const state = getState();
    const cached = state.users.byId[id];

    if (cached && cached.status === 'succeeded') {
      // already have fresh data — skip the network call entirely
      return cached;
    }

    dispatch({ type: 'users/fetchPending', payload: { id } });
    try {
      const res = await fetch(`/api/users/${id}`);
      const data = await res.json();
      dispatch({ type: 'users/fetchFulfilled', payload: { id, data } });
      return data;
    } catch (err) {
      dispatch({ type: 'users/fetchRejected', payload: { id, error: err.message } });
      throw err;
    }
  };
}

// Because the thunk returns a value/promise, callers can await it:
// const user = await store.dispatch(fetchUserIfNeeded(42));
