# Loading and Error State Patterns Worth Knowing

Beyond the basic pending/fulfilled/rejected triplet, there are a handful of loading/error modeling patterns that come up constantly in real apps and in interviews.

## Per-resource vs. global loading state

A single global `isLoading` flag shared across every async operation in the app looks tempting but breaks the moment two requests can be in flight at once — one finishing turns the spinner off while the other is still loading. The fix is to scope loading state to the thing being loaded: `state.orders.status`, `state.profile.status`, each independent. If you need an aggregate "is anything loading" indicator (e.g., a top-level progress bar), derive it with a selector that reads multiple statuses, rather than storing one shared flag that reducers race to write.

```javascript
// Bad: shared, ambiguous
{ isLoading: false } // loading *what*, exactly?

// Better: scoped per resource
{
  orders: { status: 'loading', error: null, data: null },
  profile: { status: 'succeeded', error: null, data: {...} },
}
```

## Stale request protection

If a user can trigger the same async action multiple times before the first resolves (searching, paginating quickly, switching tabs), you need to guard against an *older* request's response overwriting a *newer* one. The standard technique is a request id: stamp each dispatch with a unique identifier, remember which one is "current," and ignore any `fulfilled`/`rejected` whose id doesn't match.

```javascript
let latestRequestId = 0;

function search(query) {
  return async (dispatch) => {
    const requestId = ++latestRequestId;
    dispatch({ type: 'search/pending', meta: { requestId } });
    const results = await fetchResults(query);
    if (requestId !== latestRequestId) return; // a newer search superseded this one
    dispatch({ type: 'search/fulfilled', payload: results, meta: { requestId } });
  };
}
```

`createAsyncThunk` gives you this for free via `action.meta.requestId`, generated automatically for every dispatch.

## Distinguishing "no data yet" from "empty result"

`data: null` (never fetched, or currently loading) and `data: []` (fetched successfully, genuinely empty) are different states that render differently — one shows a spinner or nothing, the other shows "No results found." Initializing `data` to `null` rather than `[]` and only ever setting it in the `fulfilled` case keeps this distinction intact; defaulting to `[]` from the start makes "empty because nothing loaded yet" indistinguishable from "empty because the search genuinely found nothing."

## Error shape: string vs. structured object

A plain `error: string` is fine for a single generic message, but real apps often need the HTTP status code (to branch UI — 401 means "log in again," 404 means "not found," 500 means "try again later"), a field-level validation map (for forms), or a retry affordance. Standardizing on a structured error object from day one (`{ status, message, fields? }`) avoids a painful later migration once you need more than a string can hold.

```javascript
// A structured error shape scales better than a bare string
{ status: 422, message: 'Validation failed', fields: { email: 'Invalid format' } }
```

## Resetting error state on retry

A subtle but common bug: dispatching `pending` without clearing the previous `error`. If a first request fails and a retry is dispatched, forgetting `error: null` in the `pending` case means the UI can briefly (or permanently, if the reducer never clears it elsewhere) show both a loading spinner and a stale error message simultaneously — a state that should be unreachable if `pending` always resets `error` back to `null`.
