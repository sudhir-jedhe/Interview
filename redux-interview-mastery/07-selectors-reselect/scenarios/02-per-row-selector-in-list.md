# Scenario: A Large Table Re-Renders Every Row on Every Keystroke Elsewhere

A data-grid page renders 200 rows, each an independent `<Row rowId={id} />` component that reads its own row's computed "status" (derived from several fields plus a cross-referenced lookup table) via a memoized selector. A completely unrelated text input elsewhere on the page (a page-level notes field, stored in the same Redux store) causes all 200 rows to visibly re-render on every keystroke, based on React DevTools' profiler — even though none of their underlying data changed.

**Approach:** Diagnose whether this is the classic shared-selector-instance memoization bug (one `createSelector` instance being called with 200 different `rowId`s) before assuming the fix is something else, since that's the most common cause of exactly this symptom.

```javascript
// THE BUG — one shared, module-level memoized selector
const selectRowStatus = createSelector(
  [(state) => state.rows.entities, (state) => state.lookups.statusRules, (state, rowId) => rowId],
  (entities, statusRules, rowId) => computeStatus(entities[rowId], statusRules) // expensive-ish
);

function Row({ rowId }) {
  const status = useSelector((state) => selectRowStatus(state, rowId));
  // ...
}
```

With 200 `<Row>` instances all calling into the *same* `selectRowStatus`, the cache (size 1) thrashes on every render pass — row 2's call evicts row 1's cached result, row 3's evicts row 2's, and so on, so by the time all 200 rows have rendered once, none of them actually got a cache hit, and the *next* render pass (triggered by the unrelated notes-field keystroke) recomputes every single row's status from scratch, then re-renders every row because each one's `useSelector` call returns a "new" (in this case, actually freshly recomputed but often literally different) value.

```javascript
// THE FIX — a selector factory, one instance per Row
const makeSelectRowStatus = () =>
  createSelector(
    [(state) => state.rows.entities, (state) => state.lookups.statusRules, (state, rowId) => rowId],
    (entities, statusRules, rowId) => computeStatus(entities[rowId], statusRules)
  );

function Row({ rowId }) {
  const selectRowStatus = useMemo(makeSelectRowStatus, []); // one cache per Row instance
  const status = useSelector((state) => selectRowStatus(state, rowId));
  // ...
}
```

With this fix, each `<Row>` owns an independent selector instance whose single-entry cache is dedicated entirely to that row's own `rowId`, which never changes across re-renders of that same row (React reuses the component instance as long as its `key` doesn't change). Now, when the notes field updates, `state.rows.entities` and `state.lookups.statusRules` are both unchanged references (the notes reducer doesn't touch either), so every row's selector call is a clean cache hit, `useSelector` sees the same reference as before, and none of the 200 rows re-render — exactly the outcome expected, and confirmable in React DevTools' profiler by seeing zero highlighted rows on that keystroke afterward.
