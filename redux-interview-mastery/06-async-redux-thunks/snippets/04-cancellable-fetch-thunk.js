// A thunk supporting cancellation via AbortController, for use in a component's
// useEffect cleanup so an in-flight request doesn't dispatch after unmount.
export function fetchSearchResults(query, { signal } = {}) {
  return async function (dispatch) {
    dispatch({ type: 'search/pending' });
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal });
      const data = await res.json();
      dispatch({ type: 'search/fulfilled', payload: data });
    } catch (err) {
      if (err.name === 'AbortError') {
        dispatch({ type: 'search/cancelled' }); // not a real error — just cleanup
        return;
      }
      dispatch({ type: 'search/rejected', payload: err.message });
    }
  };
}

// Usage inside a React component:
//
// useEffect(() => {
//   const controller = new AbortController();
//   dispatch(fetchSearchResults(query, { signal: controller.signal }));
//   return () => controller.abort(); // cancels the fetch if the component unmounts first
// }, [query]);
