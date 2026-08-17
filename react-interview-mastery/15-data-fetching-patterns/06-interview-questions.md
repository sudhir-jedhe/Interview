# Interview Questions: Data Fetching Patterns

**Q: Why is fetching data directly in the component body (not inside `useEffect`) a problem?**
Fetching during render runs on every render, including re-renders caused by unrelated state changes, and can trigger infinite loops if the fetch eventually causes a state update, which triggers another render, which fetches again. `useEffect` scopes the fetch to specific dependency changes (mount, or when specified values change), giving you control over when it actually fires. Data fetching is a side effect, and side effects belong in `useEffect` (or an event handler for user-triggered actions), not in the render function which should stay pure.

**Q: What causes a race condition in `useEffect` data fetching, and how do you fix it?**
It happens when a dependency (like an `id` prop) changes before a prior request for the old value resolves, and responses arrive out of order — the UI ends up showing data for a value it's no longer displaying. Fix it by cancelling the previous request when the effect re-runs, using `AbortController` passed into `fetch`'s `signal` option, or a simpler boolean "cancelled" flag checked before calling `setState` in the `.then`.

**Q: What does the cleanup function returned from `useEffect` do in the context of fetching?**
It runs before the effect re-runs (when dependencies change) and when the component unmounts. For fetching, you use it to abort the in-flight request (`controller.abort()`) or set a flag so a late-arriving response is ignored, preventing both race conditions and wasted state updates.

**Q: What's the difference between an `AbortError` and other fetch errors, and why does it matter?**
When you call `AbortController.abort()`, the corresponding `fetch` promise rejects with a `DOMException` whose `name` is `"AbortError"`. This isn't a real failure — it's an intentional cancellation, usually because the component moved on. You need to catch and special-case it (`if (err.name !== "AbortError")`) so you don't incorrectly show an error UI for a request you cancelled on purpose.

**Q: Why do libraries like React Query or SWR exist when `useEffect` + `fetch` "already works"?**
They solve cross-cutting problems that manual fetching re-implements badly or not at all: caching so the same data isn't refetched unnecessarily, deduplication of identical in-flight requests across components, background refetching on window focus/reconnect, and declarative loading/error states. The core idea is stale-while-revalidate — show cached data instantly while quietly checking the server for updates — which is hard to get right by hand across an entire app.

**Q: What is stale-while-revalidate?**
It's a caching strategy where the UI immediately renders the last known (possibly stale) data from cache while a background request checks for fresher data; if the fresh data differs, the UI updates. This avoids the loading-spinner flash on every navigation back to previously-seen data, trading strict correctness for perceived speed.

**Q: What's a data-fetching waterfall, and how do you avoid one?**
A waterfall is when requests are sequenced unnecessarily — a child's fetch waits for a parent's fetch to finish even though it doesn't actually depend on that parent's data. Avoid it by identifying true dependencies (does request B actually need a value from request A's response?) and firing independent requests together with `Promise.all`, or by fetching all needed data at a common ancestor level.

**Q: What is an optimistic update, and what's the risk?**
It's updating the UI as if a mutation already succeeded before the server confirms it, to make the interaction feel instant. The risk is that the mutation can fail, requiring a rollback to the previous state (and ideally a user-visible indication that it failed) — so you need to keep a snapshot of the prior state and handle the error path deliberately, not just assume success.

**Q: How would you handle loading and error states for a fetch that depends on two other fetches finishing first?**
Track each fetch's status independently or combine them into a single derived status: loading if any are still pending, error if any failed, success only once all have resolved. Using `Promise.all` for the "fetch all three in parallel" case and one shared `status` state (`'idle' | 'loading' | 'success' | 'error'`) usually keeps this cleaner than three separate booleans that can get out of sync.

**Q: Why might `setLoading(true)` at the top of an effect cause a bug when `userId` changes quickly?**
If you don't also handle stale responses, setting `loading` back to `true` on every dependency change is fine for the spinner, but the underlying race condition (an old, slow request resolving after a newer, fast one) still exists — the loading indicator disappearing doesn't mean the *correct* data was the one that arrived. Loading state and correctness are separate problems; fixing the spinner doesn't fix the race.

**Q: In what scenario is a waterfall actually the correct choice over parallel fetching?**
When the second request genuinely needs data only available from the first response — e.g., you need a `teamId` returned by `/api/me` before you can call `/api/teams/:teamId`. Forcing that into `Promise.all` doesn't work because the second call has no valid input yet; the dependency is real, not incidental.
