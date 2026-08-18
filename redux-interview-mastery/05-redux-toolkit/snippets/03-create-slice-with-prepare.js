// Using the { reducer, prepare } notation to shape a payload before it reaches the reducer.
import { createSlice, nanoid } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    todoAdded: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(text) {
        // generate the id/timestamp here so every dispatch site doesn't have to
        return {
          payload: {
            id: nanoid(),
            text,
            completed: false,
            createdAt: Date.now(),
          },
        };
      },
    },
    todoToggled(state, action) {
      const todo = state.find((t) => t.id === action.payload);
      if (todo) todo.completed = !todo.completed; // mutating a nested item is fine via Immer
    },
  },
});

export const { todoAdded, todoToggled } = todosSlice.actions;
export default todosSlice.reducer;

if (require.main === module) {
  const action = todoAdded('Write RTK notes');
  console.log(action);
  // { type: 'todos/todoAdded', payload: { id: '...', text: 'Write RTK notes', completed: false, createdAt: ... } }
}
