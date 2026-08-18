# 10 — Patterns & Anti-Patterns

The recurring mistakes that show up in real Redux codebases — mutation bugs, derived-data drift, non-serializable state, fragmented actions, hand-rolled server caches, unmemoized selectors, and over-nested state — each with a concrete before/after fix.

## Summary

- **Mutating state directly in a plain reducer** breaks `useSelector`'s reference-equality re-render detection and can retroactively corrupt Redux DevTools' time-travel history, since DevTools typically holds references (not deep clones) to past snapshots. Inside `createSlice`/`createReducer`, "mutating" code is actually safe because Immer intercepts it and produces a correctly new, structurally-shared state — the danger is only in plain, non-Immer reducers.
- **Storing derived/computed data in state** (a `totalPrice`, an `itemCount`) creates a second copy of a fact that every relevant reducer case must remember to keep in sync — and forgetting even one case silently drifts it wrong, with no error or warning. Compute it in a memoized selector instead; there's then nothing to forget.
- **Storing non-serializable data** (functions, class instances, `Date` objects, `Promise`s) breaks Redux DevTools' state serialization and RTK's dev-mode `serializableCheck` middleware exists specifically to catch this — store plain primitives (epoch-ms timestamps, status strings) and keep genuinely non-serializable objects (timer handles, `File`s) outside Redux state entirely.
- **Over-nested state shape** duplicates data and requires fragile multi-level immutable updates — this topic cross-references `08-normalizing-state`'s full treatment and includes its own worked flattening example.
- **Dispatching too many fine-grained actions for one logical operation** creates observable, briefly-invalid intermediate states that other code can react to incorrectly — consolidate related fields representing one real-world event into a single, well-designed action.
- **Putting server-cache data in hand-rolled Redux** reimplements caching, deduplication, and invalidation poorly and per-slice — RTK Query (or React Query) solves this generically; see also `09-redux-vs-alternatives`.
- **Forgetting to memoize selectors** causes re-render storms: an inline selector doing `.filter()`/`.map()`/`.sort()` allocates a new reference on every call regardless of whether the underlying data changed, forcing unrelated re-renders on every dispatched action — wrap it in `createSelector`.

## theory/
1. [`01-mutating-state-and-non-serializable-values.md`](theory/01-mutating-state-and-non-serializable-values.md) — direct mutation in plain reducers, and non-serializable values in state.
2. [`02-derived-data-in-state.md`](theory/02-derived-data-in-state.md) — the stored-`totalPrice` failure mode and its selector-based fix.
3. [`03-overly-nested-state-and-fine-grained-actions.md`](theory/03-overly-nested-state-and-fine-grained-actions.md) — nested state (cross-ref 08) and fragmented multi-dispatch operations.
4. [`04-server-cache-in-redux.md`](theory/04-server-cache-in-redux.md) — what a hand-rolled fetch slice is missing, and the RTK Query fix.
5. [`05-unmemoized-selectors-and-rerender-storms.md`](theory/05-unmemoized-selectors-and-rerender-storms.md) — how unmemoized selectors cause re-render storms, and how `createSelector` fixes it.

## snippets/
1. [`01-mutation-bug-before-after.js`](snippets/01-mutation-bug-before-after.js) — a mutation bug and its immutable fix, with reference-equality checks.
2. [`02-non-serializable-value-detector.js`](snippets/02-non-serializable-value-detector.js) — a dependency-free scanner for non-serializable values in a state tree.
3. [`03-derived-total-selector.js`](snippets/03-derived-total-selector.js) — a cart slice with no stored total, plus a memoized selector.
4. [`04-consolidated-action-vs-fragmented.js`](snippets/04-consolidated-action-vs-fragmented.js) — one well-designed `checkoutSubmitted` action.
5. [`05-rtk-query-replacing-handrolled-cache.js`](snippets/05-rtk-query-replacing-handrolled-cache.js) — an RTK Query endpoint with tag-based invalidation.
6. [`06-memoized-vs-unmemoized-selector.js`](snippets/06-memoized-vs-unmemoized-selector.js) — reference-stability comparison between the two.

## output-based/
1. [`01-immer-draft-vs-plain-mutation.md`](output-based/01-immer-draft-vs-plain-mutation.md) — identical-looking "mutation" code, safe in one context and broken in another.
2. [`02-serializablecheck-warning-source.md`](output-based/02-serializablecheck-warning-source.md) — which lines trigger RTK's serializability warning, and why.
3. [`03-derived-total-drifts-out-of-sync.md`](output-based/03-derived-total-drifts-out-of-sync.md) — a forgotten `totalPrice` update produces a silently wrong number.
4. [`04-fragmented-dispatch-intermediate-state.md`](output-based/04-fragmented-dispatch-intermediate-state.md) — an observable, briefly-invalid intermediate state between two dispatches.
5. [`05-handrolled-cache-staleness.md`](output-based/05-handrolled-cache-staleness.md) — a mutation succeeds but the cached list never updates.
6. [`06-inline-selector-rerender-storm.md`](output-based/06-inline-selector-rerender-storm.md) — an expensive component re-rendering on unrelated dispatches.
7. [`07-nested-mutation-through-shared-reference.md`](output-based/07-nested-mutation-through-shared-reference.md) — a shallow-only spread that still mutates a shared nested object.

## scenarios/
1. [`01-devtools-time-travel-lies.md`](scenarios/01-devtools-time-travel-lies.md) — diagnosing and fixing a mutation bug that corrupts DevTools history.
2. [`02-dashboard-totals-disagree.md`](scenarios/02-dashboard-totals-disagree.md) — two UI locations disagreeing because of duplicated derived-total logic.
3. [`03-devtools-crash-on-file-upload.md`](scenarios/03-devtools-crash-on-file-upload.md) — a `File` and a `Promise` stored in state crashing DevTools.
4. [`04-analytics-dashboard-typing-lag.md`](scenarios/04-analytics-dashboard-typing-lag.md) — diagnosing and fixing an unmemoized-selector re-render storm with the Profiler.

## interview-qa/
1. [`01-mutation-and-serializability.md`](interview-qa/01-mutation-and-serializability.md) — Immer-wrapped vs plain mutation, why non-serializable values matter.
2. [`02-derived-data-and-action-design.md`](interview-qa/02-derived-data-and-action-design.md) — the derived-data test, and when to consolidate fine-grained actions.
3. [`03-server-cache-and-selectors.md`](interview-qa/03-server-cache-and-selectors.md) — spotting a cache-shaped slice, and how `createSelector` memoization works mechanically.
4. [`04-spotting-antipatterns-in-review.md`](interview-qa/04-spotting-antipatterns-in-review.md) — a code-review checklist and a prioritization framework for fixing a codebase with several of these at once.

## problems/
1. [`01-refactor-derived-total-to-selector.md`](problems/01-refactor-derived-total-to-selector.md) — refactor a stored, manually-maintained `totalPrice` into a memoized selector.
2. [`02-find-and-fix-non-serializable-value.md`](problems/02-find-and-fix-non-serializable-value.md) — find and fix a `Date`, a function, and a timer handle stored in state.
3. [`03-flatten-over-nested-state-shape.md`](problems/03-flatten-over-nested-state-shape.md) — flatten a nested projects/tasks/assignees shape into normalized tables.

## assets/
See [`assets/README.md`](assets/README.md).
