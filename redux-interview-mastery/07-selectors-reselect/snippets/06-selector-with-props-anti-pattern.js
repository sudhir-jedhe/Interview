// Demonstrates the shared-instance memoization bug, and contrasts it with the factory fix.
import { createSelector } from '@reduxjs/toolkit';

const selectAllItems = (state) => state.board.items;
const selectColumnIdArg = (state, columnId) => columnId;

// ANTI-PATTERN: one shared module-level instance, called with different columnId
// values by different component instances -> cache thrashes, memoization never hits.
const selectItemsByColumnShared = createSelector(
  [selectAllItems, selectColumnIdArg],
  (items, columnId) => {
    console.log(`recomputing for column: ${columnId}`); // will log EVERY call, proving no cache hit
    return items.filter((item) => item.columnId === columnId);
  }
);

if (require.main === module) {
  const state = {
    board: {
      items: [
        { id: 1, columnId: 'todo' },
        { id: 2, columnId: 'doing' },
        { id: 3, columnId: 'done' },
      ],
    },
  };

  console.log('--- simulating 3 <Column> components sharing ONE selector instance ---');
  selectItemsByColumnShared(state, 'todo');   // recomputes
  selectItemsByColumnShared(state, 'doing');  // recomputes (columnId input differs -> cache miss)
  selectItemsByColumnShared(state, 'done');   // recomputes (columnId input differs again)
  selectItemsByColumnShared(state, 'todo');   // recomputes AGAIN — 'done' evicted the 'todo' entry
  // Every single call logs "recomputing" — memoization never actually helped.
}
