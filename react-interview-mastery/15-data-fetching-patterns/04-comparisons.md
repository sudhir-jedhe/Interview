# Comparisons: Data Fetching Patterns

### Cleanup flag vs AbortController

| Aspect | Cancelled flag (`let cancelled = false`) | AbortController |
|---|---|---|
| What it stops | Only the `setState` call after resolution | The actual network request/response |
| Server cost | Server still does full work, response is wasted | Server can stop processing (if it respects the signal) |
| Browser support | Universal, no API needed | Native in all modern browsers, needs `fetch`/library support |
| Common mistake | Fine for correctness but leaves it looking like an unresolved perf issue in review | Forgetting to special-case `AbortError` in `.catch`, turning cancellations into false error states |

Use `AbortController` whenever you're using `fetch` directly — it's strictly better and barely more code. Use a plain cancelled flag only when your fetching function doesn't support cancellation (e.g., some older SDKs).

### Manual useEffect fetching vs React Query/SWR

| Aspect | Manual `useEffect` fetching | React Query / SWR |
|---|---|---|
| Caching | None by default — every mount refetches | Built-in cache keyed by query key/URL |
| Deduplication | Duplicate requests across components | Automatic dedup of identical in-flight requests |
| Refetch triggers | Only what you code (param change) | Window focus, reconnect, interval, manual invalidation |
| Boilerplate | Loading/error/data state written per component | Handled by the hook (`isLoading`, `isError`, `data`) |
| Common mistake | Re-implementing caching badly (e.g., a module-level object) instead of just adopting a library | Reaching for a library before understanding what problem it solves, making debugging cache issues harder |

Use manual fetching for a one-off request with no sharing/reuse needs; reach for React Query/SWR once you have more than a couple of components fetching overlapping data or need background refresh behavior.

### Waterfall vs parallel fetching

| Aspect | Waterfall | Parallel (`Promise.all`) |
|---|---|---|
| Total time | Sum of each request's latency | Max of the request latencies |
| When appropriate | Second request genuinely needs data from the first (e.g., needs an ID returned by request 1) | Requests are independent, even if they're "related" conceptually |
| Code shape | Nested `.then` / sequential `await` | `Promise.all([...])` or parallel hooks |
| Common mistake | Sequencing fetches out of habit ("fetch user, then fetch their posts") when the post fetch only needs `userId`, which was already known | Firing parallel requests when the second genuinely depends on data only the first response provides, causing a failed/undefined request |

Default to parallel; only fall back to a waterfall when there's a real data dependency.

### Pessimistic vs optimistic updates

| Aspect | Pessimistic (wait for server) | Optimistic (update UI immediately) |
|---|---|---|
| Perceived speed | Slower, UI waits for round trip | Instant |
| Complexity | Simple: render server response | Needs rollback logic and reconciliation |
| Risk | UI is always consistent with server | UI can briefly show a state the server rejects |
| Common mistake | Making every interaction feel laggy for low-risk actions (likes, toggles) | Applying it to high-stakes mutations (payments) where a silent rollback is confusing to the user |

Use optimistic updates for low-risk, easily-reversible actions; keep pessimistic updates for anything where a rollback would be jarring or costly.
