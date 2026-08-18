// A selector factory: each call returns a fresh, independently-memoized selector instance.
import { createSelector } from '@reduxjs/toolkit';

const selectAllItems = (state) => state.board.items;
const selectColumnIdArg = (state, columnId) => columnId;

// The factory — call this ONCE PER component instance that needs its own cache.
export const makeSelectItemsByColumn = () =>
  createSelector(
    [selectAllItems, selectColumnIdArg],
    (items, columnId) => items.filter((item) => item.columnId === columnId)
  );

// React usage pattern (see problems/02-fix-shared-selector-factory.md for the full bug + fix):
//
// function Column({ columnId }) {
//   const selectItemsByColumn = useMemo(makeSelectItemsByColumn, []);
//   const items = useSelector((state) => selectItemsByColumn(state, columnId));
//   ...
// }

if (require.main === module) {
  const state = {
    board: {
      items: [
        { id: 1, columnId: 'todo' },
        { id: 2, columnId: 'done' },
        { id: 3, columnId: 'todo' },
      ],
    },
  };

  const selectTodoItems = makeSelectItemsByColumn();
  const selectDoneItems = makeSelectItemsByColumn(); // independent cache

  console.log(selectTodoItems(state, 'todo').length); // 2
  console.log(selectDoneItems(state, 'done').length); // 1

  // each call with its OWN columnId hits its OWN cache — no thrashing between them
  console.log(selectTodoItems(state, 'todo') === selectTodoItems(state, 'todo')); // true
}
