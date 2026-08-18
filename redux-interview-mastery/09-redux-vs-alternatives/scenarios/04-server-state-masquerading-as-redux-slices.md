# Scenario: A Codebase Has 12 Nearly-Identical Redux Slices, All Just Fetching Data

A code audit reveals a Redux store with 12 slices — `users`, `products`, `orders`, `invoices`, and so on — each following the identical hand-rolled pattern: a `createAsyncThunk`, a `status: 'idle' | 'loading' | 'succeeded' | 'failed'` field, a `data` field, and an `error` field. None of these slices have any client-only logic; every one of them is purely "fetch this resource and store the response." The team spends real time in every sprint on bugs like stale data after a mutation, duplicate in-flight requests when two components mount simultaneously, and manually-written cache invalidation that's often forgotten after a create/update/delete action.

## Approach:

**1. Name this precisely as the "server-cache data in hand-rolled Redux" anti-pattern**, covered in depth in `10-patterns-anti-patterns`. All 12 slices are solving the same problem (cache a server response, track its loading state) with 12 independent, slightly-drifted implementations of the same `pending`/`fulfilled`/`rejected` boilerplate.

**2. Make the case for RTK Query with the team's own bug list, not abstractly.** Each of the three recurring bug categories maps directly to a feature RTK Query provides out of the box: stale-after-mutation is solved by tag-based cache invalidation (`invalidatesTags`/`providesTags`), duplicate in-flight requests are solved by RTK Query's automatic request deduplication by cache key, and manual invalidation-after-mutation logic is replaced by declaring which tags a mutation invalidates, once, rather than remembering to dispatch a refetch after every relevant mutation site.

**3. Migrate the highest-bug-count slice first as a proof of concept.** Pick whichever of the 12 slices (likely `orders` or `invoices`, if those are where the stale-data bugs concentrate) has the most reported issues, convert it to an RTK Query `createApi` endpoint, and let the team directly compare bug reports before/after over the following sprint — a concrete, measurable case rather than an architectural argument alone.

**4. Establish a going-forward rule, not just a one-time migration.** Add a lightweight team convention: "if a new Redux slice's `reducers` are dominated by `pending`/`fulfilled`/`rejected` cases with no client-only logic mixed in, it should be an RTK Query endpoint, not a hand-rolled slice" — catching this pattern in code review before slice #13 gets written the old way.

**5. Keep genuinely client-only slices as plain Redux.** Not everything migrates — a `ui` slice controlling which modal is open, or an `undoHistory` slice tracking document edits, has no server-cache component and should stay exactly as it is; the migration target is specifically the 12 fetch-and-store slices, not the whole store.

**Result:** the three recurring bug categories are structurally addressed by RTK Query's built-in cache invalidation and deduplication rather than more manually-written thunk logic, and the team gains an explicit rule for preventing the same anti-pattern from being reintroduced in future slices.
