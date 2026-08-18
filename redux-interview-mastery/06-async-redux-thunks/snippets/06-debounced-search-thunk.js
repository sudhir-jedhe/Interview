// Debounced dispatch using a thunk + a module-level timer handle.
let debounceTimer = null;

export function searchAsYouType(query, delayMs = 300) {
  return function (dispatch, getState) {
    // reflect the raw input immediately so the text field feels responsive
    dispatch({ type: 'search/queryChanged', payload: query });

    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      // only the actual network-triggering dispatch is debounced
      dispatch(performSearch(query));
    }, delayMs);
  };
}

function performSearch(query) {
  return async function (dispatch, getState) {
    if (getState().search.query !== query) return; // superseded by newer input already

    dispatch({ type: 'search/pending', payload: query });
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const results = await res.json();
      if (getState().search.query !== query) return; // stale by the time it resolved
      dispatch({ type: 'search/fulfilled', payload: results });
    } catch (err) {
      dispatch({ type: 'search/rejected', payload: err.message });
    }
  };
}

// Usage: dispatch(searchAsYouType(inputValue)) on every keystroke's onChange.
