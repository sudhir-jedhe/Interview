# Problem 3: Debounced Dispatch for Search-As-You-Type

## Task

Implement a debounced search feature using only a thunk and a plain timer (no external debounce library):

- Typing updates the visible input value on every keystroke, instantly.
- The actual search request fires only after the user pauses typing for 300ms.
- If the user clears the input, cancel any pending debounced request and reset results immediately.
- An in-flight request that resolves after the user has since changed the query must not overwrite newer results.

## Reference solution

```javascript
// searchThunks.js
let debounceHandle = null;

export function searchInputChanged(rawQuery) {
  return (dispatch, getState) => {
    const query = rawQuery.trim();

    dispatch({ type: 'search/queryChanged', payload: rawQuery }); // instant, unconditional

    if (debounceHandle) {
      clearTimeout(debounceHandle);
      debounceHandle = null;
    }

    if (query === '') {
      dispatch({ type: 'search/cleared' });
      return;
    }

    debounceHandle = setTimeout(() => {
      debounceHandle = null;
      dispatch(runSearch(query));
    }, 300);
  };
}

function runSearch(query) {
  return async (dispatch, getState) => {
    // the debounce already fired, but double-check the input hasn't changed since
    if (getState().search.query.trim() !== query) return;

    dispatch({ type: 'search/pending', payload: query });
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const results = await res.json();

      if (getState().search.query.trim() !== query) return; // stale by the time it resolved
      dispatch({ type: 'search/fulfilled', payload: { query, results } });
    } catch (err) {
      if (getState().search.query.trim() !== query) return;
      dispatch({ type: 'search/rejected', payload: err.message });
    }
  };
}

// searchReducer.js
const initialState = { query: '', status: 'idle', results: [], error: null };

export default function searchReducer(state = initialState, action) {
  switch (action.type) {
    case 'search/queryChanged':
      return { ...state, query: action.payload };
    case 'search/cleared':
      return { ...state, status: 'idle', results: [], error: null };
    case 'search/pending':
      return { ...state, status: 'loading', error: null };
    case 'search/fulfilled':
      return { ...state, status: 'succeeded', results: action.payload.results };
    case 'search/rejected':
      return { ...state, status: 'failed', error: action.payload };
    default:
      return state;
  }
}
```

## Why there are three separate places checking "is this still current"

1. **Clearing the debounce timer on every keystroke** (`clearTimeout(debounceHandle)`) ensures only the *last* pause-in-typing within 300ms actually schedules a search — this is the debounce mechanism itself, and it alone eliminates the vast majority of wasted requests.
2. **The check at the start of `runSearch`** guards against a narrow timing edge case where the timer fired right as another change happened (defense in depth; rarely triggers in practice given step 1, but cheap to include).
3. **The check after the response resolves** is the one that actually matters most: network latency is not guaranteed to preserve request order, so even a single, correctly-debounced request can resolve *after* the user has cleared the box or typed something new that triggered a different, later request — without this final guard, an old response could still silently overwrite newer, more relevant results.

Clearing the timer handle on both `clearTimeout` and after it naturally fires (`debounceHandle = null`) avoids ever calling `clearTimeout` on a stale/already-fired handle, which is harmless in this case but is good hygiene generally.
