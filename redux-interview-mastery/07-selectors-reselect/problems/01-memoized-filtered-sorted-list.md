# Problem 1: A Memoized Selector for a Filtered + Sorted List

## Task

Given state shaped as:

```javascript
{
  tasks: {
    list: [
      { id: 1, title: 'Write report', priority: 'high', done: false },
      { id: 2, title: 'Review PR', priority: 'medium', done: true },
      { id: 3, title: 'Fix bug', priority: 'high', done: false },
      // ...
    ],
    filters: { status: 'all', priority: 'all' }, // status: 'all' | 'done' | 'pending'
  },
}
```

Write a memoized `selectVisibleTasks` selector that: filters by `status` and `priority` according to `state.tasks.filters`, then sorts the result with high-priority tasks first, alphabetically by title within each priority group. It must not mutate `state.tasks.list`, and must not recompute when unrelated state changes.

## Reference solution

```javascript
import { createSelector } from '@reduxjs/toolkit';

const selectTaskList = (state) => state.tasks.list;
const selectStatusFilter = (state) => state.tasks.filters.status;
const selectPriorityFilter = (state) => state.tasks.filters.priority;

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

export const selectVisibleTasks = createSelector(
  [selectTaskList, selectStatusFilter, selectPriorityFilter],
  (tasks, statusFilter, priorityFilter) => {
    let result = tasks;

    if (statusFilter !== 'all') {
      const wantDone = statusFilter === 'done';
      result = result.filter((t) => t.done === wantDone);
    }

    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    // copy before sorting — never mutate the array coming from the store
    return [...result].sort((a, b) => {
      const rankDiff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      if (rankDiff !== 0) return rankDiff;
      return a.title.localeCompare(b.title);
    });
  }
);
```

## Verification

```javascript
const state = {
  tasks: {
    list: [
      { id: 1, title: 'Write report', priority: 'high', done: false },
      { id: 2, title: 'Review PR', priority: 'medium', done: true },
      { id: 3, title: 'Fix bug', priority: 'high', done: false },
    ],
    filters: { status: 'pending', priority: 'all' },
  },
};

const visible = selectVisibleTasks(state);
console.log(visible.map((t) => t.title)); // ['Fix bug', 'Write report'] — both high priority, alphabetical, done excluded

console.log(state.tasks.list.map((t) => t.title)); // unchanged original order — proves no mutation

// memoization check: an unrelated field change shouldn't cause recomputation
const unrelatedChange = { tasks: state.tasks, otherSlice: { count: 1 } };
console.log(selectVisibleTasks(unrelatedChange) === visible); // true — cache hit
```

## Why this satisfies "genuinely memoized"

`selectTaskList`, `selectStatusFilter`, and `selectPriorityFilter` are all trivial property reads — none of them derive anything, so their outputs only change when the actual underlying reducer replaces `tasks.list` or `tasks.filters`. Because the filtering and sorting both live inside the *result function*, they only ever run when at least one of those three genuinely relevant inputs changes; any other part of the app dispatching unrelated actions leaves this selector's cached result — and its reference — untouched, which is exactly what a component reading `selectVisibleTasks` via `useSelector` needs to avoid unnecessary re-renders.
