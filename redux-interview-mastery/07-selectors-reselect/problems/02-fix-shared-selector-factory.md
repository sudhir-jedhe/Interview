# Problem 2: Fix the Shared-Selector-Instance Memoization Bug

## Task

The code below renders a Kanban board with multiple columns. Each `<Column>` reads its own items via a shared, module-level memoized selector. Diagnose why memoization isn't actually helping (verify it by observing how often the result function runs), then fix it using the selector factory pattern.

## Buggy starting point

```javascript
import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

// BUG: one shared instance, used by every <Column>, regardless of columnId
const selectItemsByColumn = createSelector(
  [(state) => state.board.items, (state, columnId) => columnId],
  (items, columnId) => {
    console.log('recomputing for', columnId); // fires far more than expected
    return items.filter((item) => item.columnId === columnId);
  }
);

function Column({ columnId, title }) {
  const items = useSelector((state) => selectItemsByColumn(state, columnId));
  return (
    <div>
      <h3>{title}</h3>
      <ul>{items.map((i) => <li key={i.id}>{i.text}</li>)}</ul>
    </div>
  );
}

function Board() {
  return (
    <>
      <Column columnId="todo" title="To Do" />
      <Column columnId="doing" title="In Progress" />
      <Column columnId="done" title="Done" />
    </>
  );
}
```

With three columns rendering in sequence, every single render pass logs `'recomputing for todo'`, `'recomputing for doing'`, `'recomputing for done'` — three recomputations per render pass, on every dispatch anywhere in the app, even ones with no relation to `board.items` (because each column's call evicts the previous column's cached entry before that previous column gets a chance to reuse it on the next pass).

## Fixed version

```javascript
import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

// A factory: each call produces a fresh, independently-cached selector
const makeSelectItemsByColumn = () =>
  createSelector(
    [(state) => state.board.items, (state, columnId) => columnId],
    (items, columnId) => {
      console.log('recomputing for', columnId);
      return items.filter((item) => item.columnId === columnId);
    }
  );

function Column({ columnId, title }) {
  // one selector instance, and one cache, per <Column> component instance —
  // created once and kept stable across this component's own re-renders
  const selectItemsByColumn = useMemo(makeSelectItemsByColumn, []);
  const items = useSelector((state) => selectItemsByColumn(state, columnId));
  return (
    <div>
      <h3>{title}</h3>
      <ul>{items.map((i) => <li key={i.id}>{i.text}</li>)}</ul>
    </div>
  );
}
```

After the fix, `'recomputing for ...'` logs only once per column, on mount (or whenever `state.board.items` actually changes) — a re-render triggered by unrelated state (say, a page-level counter) causes zero recomputation for any column, because each column's own selector instance sees its own two inputs (`board.items`, and its own fixed `columnId`) as unchanged and returns its cached result.

## How to verify the fix actually worked

```javascript
// Simulated render pass (outside React, to make the caching behavior explicit)
const selectorA = makeSelectItemsByColumn();
const selectorB = makeSelectItemsByColumn();

const state = { board: { items: [{ id: 1, columnId: 'todo', text: 'x' }] } };

const resultA1 = selectorA(state, 'todo');
const resultB1 = selectorB(state, 'doing');
const resultA2 = selectorA(state, 'todo'); // same state, same columnId as resultA1

console.log(resultA1 === resultA2); // true — selectorA's own cache hit, unaffected by selectorB's call
```
