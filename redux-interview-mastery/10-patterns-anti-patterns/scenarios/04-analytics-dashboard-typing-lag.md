# Scenario: An Analytics Dashboard Lags While Typing in a Search Box

A dashboard has a search/filter input at the top of the page, unrelated to a large, separate "top metrics" table rendered below it. Typing in the search box feels laggy — each keystroke visibly delays before the character appears — even though the search box itself has almost no rendering work to do. The metrics table, meanwhile, does nontrivial work: it sorts and aggregates a large dataset.

## Approach:

**1. Confirm the lag is a re-render problem, not an input-handling problem, using React DevTools' Profiler.** Record a keystroke and check what re-rendered. Likely finding: the metrics table component re-renders on every keystroke, despite the keystroke only updating `state.search.query`, which the metrics table doesn't read.

**2. Inspect the metrics table's selector.** Find something like:
```javascript
const metrics = useSelector((state) =>
  state.rawEvents
    .filter((e) => e.type === 'conversion')
    .reduce((acc, e) => { /* expensive aggregation */ }, {})
);
```
This is an inline, unmemoized selector doing `.filter()` and `.reduce()` — both allocate new results every call. `useSelector` re-runs it on every dispatched action, including the search box's `queryChanged` action, and since the selector always returns a new object reference regardless of whether `state.rawEvents` changed, `useSelector`'s reference check concludes "this changed" and forces the expensive table to re-render and recompute its aggregation, once per keystroke.

**3. Fix by wrapping the selector in `createSelector`**, with `state.rawEvents` as the sole input selector:
```javascript
const selectRawEvents = (state) => state.rawEvents;
const selectMetrics = createSelector([selectRawEvents], (events) =>
  events.filter((e) => e.type === 'conversion').reduce((acc, e) => { /* ... */ }, {})
);
```
Now, on each search-box keystroke, `createSelector` checks whether `state.rawEvents` changed by reference (it doesn't — the search action never touches `rawEvents`), and short-circuits to the cached result without re-running the filter/reduce or allocating a new object — so `useSelector` correctly detects no change and the metrics table skips re-rendering entirely.

**4. Verify with the Profiler again**, confirming the metrics table no longer appears in the "what re-rendered" list for a search-box keystroke, and that typing now feels instant. This before/after Profiler comparison is the concrete evidence the fix worked, not just an assumption.

**5. Search the codebase for the same shape of bug elsewhere.** Any `useSelector` call with an inline function body containing `.filter`, `.map`, `.sort`, `.reduce`, or an object/array literal is a candidate for the same fix — this is a mechanical, greppable pattern once you know what to look for, and worth a dedicated cleanup pass rather than fixing only the one reported instance.

**Result:** the search box's typing lag disappears because the unrelated, expensive metrics computation is no longer re-running on every keystroke, and the team has a repeatable diagnostic process (Profiler → find the inline selector → wrap in `createSelector`) for the next report of this shape.
