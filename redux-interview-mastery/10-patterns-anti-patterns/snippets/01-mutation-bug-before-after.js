// Runnable with plain Node: `node 01-mutation-bug-before-after.js`
// Demonstrates a mutation bug in a plain reducer and its immutable fix, side by side.

function todosReducerBuggy(state, action) {
  switch (action.type) {
    case 'todos/completed': {
      const todo = state.find((t) => t.id === action.payload.id);
      todo.completed = true; // MUTATION
      return state; // same reference
    }
    default:
      return state;
  }
}

function todosReducerFixed(state, action) {
  switch (action.type) {
    case 'todos/completed':
      return state.map((todo) =>
        todo.id === action.payload.id ? { ...todo, completed: true } : todo
      );
    default:
      return state;
  }
}

const initial = [{ id: 1, text: 'Buy milk', completed: false }];

const buggyResult = todosReducerBuggy(initial, { type: 'todos/completed', payload: { id: 1 } });
console.log('buggy: state === nextState?', initial === buggyResult); // true — BAD, useSelector won't re-render

const fixedResult = todosReducerFixed(initial, { type: 'todos/completed', payload: { id: 1 } });
console.log('fixed: state === nextState?', initial === fixedResult); // false — GOOD
console.log('fixed: unrelated items share reference?', initial[0] !== fixedResult[0]); // true, this one changed
