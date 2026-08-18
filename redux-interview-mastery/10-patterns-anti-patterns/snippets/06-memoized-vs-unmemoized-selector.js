// Requires: @reduxjs/toolkit (for createSelector)
// Demonstrates reference stability: unmemoized selector vs createSelector-wrapped selector.

import { createSelector } from '@reduxjs/toolkit';

const state = {
  todos: [
    { id: 1, text: 'Buy milk', completed: true },
    { id: 2, text: 'Walk dog', completed: false },
  ],
};

// Unmemoized: allocates a new array every call, even with identical input.
function selectCompletedUnmemoized(state) {
  return state.todos.filter((t) => t.completed);
}

// Memoized: caches by input reference; same input -> same output reference.
const selectTodos = (state) => state.todos;
const selectCompletedMemoized = createSelector([selectTodos], (todos) =>
  todos.filter((t) => t.completed)
);

console.log('unmemoized, same state, called twice, same reference?',
  selectCompletedUnmemoized(state) === selectCompletedUnmemoized(state)); // false

console.log('memoized, same state, called twice, same reference?',
  selectCompletedMemoized(state) === selectCompletedMemoized(state)); // true

// This reference stability is exactly what lets useSelector skip a re-render
// when the underlying data hasn't actually changed.
