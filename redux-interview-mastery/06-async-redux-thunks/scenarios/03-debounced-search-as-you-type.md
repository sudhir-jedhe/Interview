# Scenario: Search-As-You-Type Is Hammering the API and Flickering Results

A product search box dispatches a fetch on every `onChange` keystroke. With no debouncing, a five-character query fires five requests, most of which are wasted (superseded almost immediately by the next keystroke), and because requests don't reliably resolve in the order they were sent, users occasionally see results for `"sho"` flash up after they've already typed `"shoe"` — a visible flicker back to a shorter, less relevant result set.

**Approach:** Debounce the dispatch that triggers the network request (not the dispatch that updates the visible input text, which must stay instant), and add a staleness guard so an out-of-order response can't overwrite newer results even if debouncing alone doesn't fully prevent the race.

```javascript
let debounceHandle = null;

export function searchInputChanged(query) {
  return (dispatch, getState) => {
    // update the input box's displayed value immediately — this must never feel delayed
    dispatch({ type: 'search/queryChanged', payload: query });

    if (debounceHandle) clearTimeout(debounceHandle);

    if (query.trim() === '') {
      dispatch({ type: 'search/cleared' });
      return;
    }

    debounceHandle = setTimeout(() => {
      dispatch(runSearch(query));
    }, 300);
  };
}

function runSearch(query) {
  return async (dispatch, getState) => {
    // if the input has already moved on since this debounce fired, skip the request entirely
    if (getState().search.query !== query) return;

    dispatch({ type: 'search/pending', payload: query });
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const results = await res.json();
      // staleness guard: only apply results if this is still the current query
      if (getState().search.query !== query) return;
      dispatch({ type: 'search/fulfilled', payload: { query, results } });
    } catch (err) {
      if (getState().search.query !== query) return;
      dispatch({ type: 'search/rejected', payload: err.message });
    }
  };
}
```

```jsx
function SearchBox() {
  const dispatch = useDispatch();
  const query = useSelector((state) => state.search.query);

  return (
    <input
      value={query}
      onChange={(e) => dispatch(searchInputChanged(e.target.value))}
      placeholder="Search products..."
    />
  );
}
```

Two guards are doing different jobs and both matter: the `setTimeout`/`clearTimeout` debounce reduces the *number* of requests fired (the main cost/performance win), while the `getState().search.query !== query` checks — both before firing the request and again after it resolves — protect against the *residual* race that debouncing alone doesn't eliminate: even with debouncing, two distinct debounced requests (for two different queries typed with a pause between them) can still resolve out of order over a slow or variable-latency connection. Debouncing narrows the window for a race; the staleness check closes it. This is exactly the pattern `createAsyncThunk`'s `requestId` mechanism (or a saga's `takeLatest`/`debounce` effect) automates — see `../theory/05-redux-saga-comparison.md` for how a saga expresses the same guarantee in one line.
