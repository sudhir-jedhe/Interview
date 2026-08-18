# Parameterized Selectors — and the Memoization Pitfall They Cause

Many selectors need more than just `state` — e.g., "give me the to-do item with this specific id." `useSelector` supports this trivially by wrapping the call in an inline arrow function:

```javascript
const selectTodoById = (state, id) => state.todos.entities[id];

function TodoItem({ id }) {
  const todo = useSelector((state) => selectTodoById(state, id));
  // ...
}
```

That's fine for a plain, non-memoized selector — there's nothing to memoize, it's just a lookup. The trouble starts when you want a *memoized*, parameterized derivation, and naively wrap it with `createSelector` the same way you would a non-parameterized one:

```javascript
// A memoized selector that filters a list by a parameter (e.g., items belonging to one column)
const selectItemsByColumn = createSelector(
  [(state) => state.board.items, (state, columnId) => columnId],
  (items, columnId) => items.filter((item) => item.columnId === columnId)
);
```

This looks correct, and works fine **if only one component ever calls it with one particular `columnId`**. The problem: `createSelector`'s default cache holds exactly **one** entry — one remembered set of inputs, one remembered result. If a board page renders five columns, each calling `useSelector((state) => selectItemsByColumn(state, columnId))` with a *different* `columnId`, all five component instances share the exact same underlying memoized selector function (since it's one module-level `const`). Every render, each component's call evicts the previous component's cached result, because the `columnId` input differs from whichever call happened right before it. By the time the fifth column's component calls it, the cache has already been invalidated four times in a row — **the memoization never actually hits**, defeating the entire point of using `createSelector`, and the result function runs on every single render for every column, exactly as if no memoization existed at all.

## The fix: a selector factory

Instead of one shared memoized selector instance, export a **factory function** that creates a fresh `createSelector` instance — with its own independent cache — per component instance that needs one:

```javascript
// A factory: calling this returns a NEW memoized selector, with its own cache
const makeSelectItemsByColumn = () =>
  createSelector(
    [(state) => state.board.items, (state, columnId) => columnId],
    (items, columnId) => items.filter((item) => item.columnId === columnId)
  );
```

```jsx
import { useMemo } from 'react';

function Column({ columnId }) {
  // useMemo ensures this component instance keeps the SAME selector instance
  // (and therefore the same cache) across re-renders, but a DIFFERENT instance
  // than any other <Column> on the page.
  const selectItemsByColumn = useMemo(makeSelectItemsByColumn, []);
  const items = useSelector((state) => selectItemsByColumn(state, columnId));
  // ...
}
```

Now each `<Column>` instance owns its own selector instance and its own cache of size 1 — since a given column's `columnId` never changes across re-renders of that same component instance, its selector's single-entry cache reliably hits every time, and different columns no longer fight over one shared cache slot. This is precisely the fix demonstrated end-to-end in `../problems/02-fix-shared-selector-factory.md`.

The general rule worth internalizing: **module-level `createSelector` calls are safe to share across the app when there's only ever one logical "instance" of the derived data** (e.g., "the current user's cart total"). The moment a selector takes a parameter that varies *per rendered component instance* — an id, an index — sharing one selector instance across all of them is a memoization bug waiting to happen, and a factory (paired with `useMemo` to keep one instance per component) is the standard fix.
