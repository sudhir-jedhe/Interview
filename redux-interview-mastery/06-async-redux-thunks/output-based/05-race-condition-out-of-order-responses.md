## Which search result ends up displayed?

```javascript
function search(query) {
  return async (dispatch) => {
    dispatch({ type: 'search/pending', payload: query });
    const results = await api.search(query); // response time varies per query!
    dispatch({ type: 'search/fulfilled', payload: { query, results } });
  };
}

function reducer(state = { query: '', results: [] }, action) {
  if (action.type === 'search/fulfilled') {
    return { query: action.payload.query, results: action.payload.results };
  }
  return state;
}

// user types quickly:
store.dispatch(search('re'));   // simulated response time: 800ms
store.dispatch(search('red'));  // simulated response time: 100ms
store.dispatch(search('redu')); // simulated response time: 500ms
```

**Answer:** Whichever call's `fulfilled` action is dispatched **last in time** wins and overwrites `state.results`, regardless of which query was typed last. Given the simulated response times (`'red'` at 100ms, `'redu'` at 500ms, `'re'` at 800ms), the dispatch order is `'red'` fulfilled → `'redu'` fulfilled → `'re'` fulfilled — so the final displayed results are for the query `'re'`, even though the user's actual last keystroke was `'redu'`.

**Why:** Each `search(query)` dispatch fires an independent, concurrent async request; nothing in this code cancels or supersedes the earlier ones when a new one starts, and nothing checks whether a response is still "the current one" before dispatching `fulfilled`. Because network response time isn't correlated with dispatch order, results can — and here, do — arrive out of order relative to when the requests were made, and the reducer just naively applies whichever `fulfilled` action shows up last, with no concept of "is this stale." The fix is a staleness guard: either compare the fulfilled query against the *current* input value in state before applying it (`if (getState().search.currentQuery !== query) return;` inside the thunk), or track a monotonically increasing request id and ignore any response whose id isn't the latest one dispatched — the same `requestId` pattern `createAsyncThunk` provides via `action.meta.requestId`. Debouncing the dispatch (not firing a request on every keystroke) reduces how often this happens but doesn't eliminate the race — it's still possible for two debounced requests to resolve out of order.
