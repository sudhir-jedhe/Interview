// Side-by-side pseudo-comparison: the same debounced search, as a thunk vs. a saga.
// (Saga syntax shown for conceptual comparison — see theory/05-redux-saga-comparison.md)

// --- Thunk version: manual timer + manual "is this still current" check ---
let timer = null;
export function searchThunk(query) {
  return (dispatch, getState) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      dispatch({ type: 'search/pending' });
      const results = await api.search(query);
      if (getState().search.query !== query) return; // manual staleness guard
      dispatch({ type: 'search/fulfilled', payload: results });
    }, 300);
  };
}

// --- Saga version: debounce + cancellation are built-in effect creators ---
//
// import { call, put, debounce } from 'redux-saga/effects';
//
// function* handleSearch(action) {
//   yield put({ type: 'search/pending' });
//   const results = yield call(api.search, action.payload.query);
//   yield put({ type: 'search/fulfilled', payload: results });
// }
//
// function* watchSearch() {
//   // debounce(ms, actionType, saga) — automatically cancels any in-flight
//   // handleSearch task if a newer 'search/queryChanged' arrives first.
//   // No manual timer bookkeeping, no manual staleness check.
//   yield debounce(300, 'search/queryChanged', handleSearch);
// }

// The saga's `debounce` effect subsumes both the setTimeout/clearTimeout dance
// AND the staleness guard the thunk has to implement by hand — that's the
// concrete "better for debouncing/cancellation" claim made in the theory notes.
