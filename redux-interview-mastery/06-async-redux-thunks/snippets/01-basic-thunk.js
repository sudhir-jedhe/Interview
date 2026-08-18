// A minimal hand-written thunk: an action creator returning a function.
export function fetchUser(id) {
  return async function (dispatch, getState) {
    dispatch({ type: 'user/fetchPending' });
    try {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      dispatch({ type: 'user/fetchFulfilled', payload: data });
    } catch (err) {
      dispatch({ type: 'user/fetchRejected', payload: err.message });
    }
  };
}

// Usage (requires redux-thunk middleware to be registered on the store):
// store.dispatch(fetchUser(42));
