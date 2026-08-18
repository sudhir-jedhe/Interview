## Does this correctly update a deeply nested field?

```javascript
import { createSlice } from '@reduxjs/toolkit';

const boardSlice = createSlice({
  name: 'board',
  initialState: {
    columns: [
      { id: 'todo', cards: [{ id: 1, title: 'Fix bug', done: false }] },
    ],
  },
  reducers: {
    markCardDone(state, action) {
      const { columnId, cardId } = action.payload;
      const column = state.columns.find((c) => c.id === columnId);
      const card = column.cards.find((c) => c.id === cardId);
      card.done = true;
    },
  },
});

const initial = {
  columns: [{ id: 'todo', cards: [{ id: 1, title: 'Fix bug', done: false }] }],
};
const next = boardSlice.reducer(
  initial,
  boardSlice.actions.markCardDone({ columnId: 'todo', cardId: 1 })
);

console.log(next === initial);
console.log(next.columns === initial.columns);
console.log(next.columns[0].cards[0].done);
console.log(initial.columns[0].cards[0].done);
```

**Answer:**
```
false
false
true
false
```

**Why:** This reducer *works correctly* — `card.done = true` is a mutation performed on Immer's draft proxy, several levels deep, and Immer tracks it fine no matter how deeply nested the path is. What's important to see in the output: `next !== initial` (a new top-level object was produced) and `next.columns !== initial.columns` (the array containing the modified column is also a new reference, because Immer only structurally shares *unchanged* branches). If there were a second, untouched column, `next.columns[1] === initial.columns[1]` would be `true` — Immer only clones the path from the root down to whatever you actually touched, which is exactly what gives React/`useSelector` cheap reference-equality checks for anything that didn't change. Meanwhile the *original* `initial` object is left completely untouched (`initial.columns[0].cards[0].done` is still `false`), confirming Immer never mutated the real input, only its own proxy.
