# Problem: Todo List Reducer — Classic Switch vs `createSlice`, Side by Side

## Task

Implement a reducer for a todo list supporting add, remove, toggle-complete, and edit-text operations, in **both** the classic switch-statement style and Redux Toolkit's `createSlice` style, so the two can be directly compared.

## Requirements

- State shape: `{ todos: [{ id, text, completed }] }`.
- `add(text)` — appends a new todo with a generated id and `completed: false`.
- `remove(id)` — removes the todo with that id.
- `toggle(id)` — flips that todo's `completed` flag.
- `edit(id, text)` — updates that todo's text.
- Both versions must produce equivalent behavior and equivalent resulting state shape.

## Solution — classic switch style

```javascript
// todosReducer.js
let nextId = 1;

const initialState = { todos: [] };

export const todoAdded = (text) => ({ type: 'todos/todoAdded', payload: { id: nextId++, text } });
export const todoRemoved = (id) => ({ type: 'todos/todoRemoved', payload: id });
export const todoToggled = (id) => ({ type: 'todos/todoToggled', payload: id });
export const todoEdited = (id, text) => ({ type: 'todos/todoEdited', payload: { id, text } });

export function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todoAdded':
      return {
        todos: [...state.todos, { id: action.payload.id, text: action.payload.text, completed: false }],
      };
    case 'todos/todoRemoved':
      return { todos: state.todos.filter((t) => t.id !== action.payload) };
    case 'todos/todoToggled':
      return {
        todos: state.todos.map((t) =>
          t.id === action.payload ? { ...t, completed: !t.completed } : t
        ),
      };
    case 'todos/todoEdited':
      return {
        todos: state.todos.map((t) =>
          t.id === action.payload.id ? { ...t, text: action.payload.text } : t
        ),
      };
    default:
      return state;
  }
}
```

## Solution — `createSlice` style

```javascript
// todosSlice.js
import { createSlice, nanoid } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: { todos: [] },
  reducers: {
    todoAdded: {
      reducer(state, action) {
        state.todos.push(action.payload);
      },
      prepare(text) {
        return { payload: { id: nanoid(), text, completed: false } };
      },
    },
    todoRemoved(state, action) {
      state.todos = state.todos.filter((t) => t.id !== action.payload);
    },
    todoToggled(state, action) {
      const todo = state.todos.find((t) => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    todoEdited(state, action) {
      const todo = state.todos.find((t) => t.id === action.payload.id);
      if (todo) todo.text = action.payload.text;
    },
  },
});

export const { todoAdded, todoRemoved, todoToggled, todoEdited } = todosSlice.actions;
export default todosSlice.reducer;
```

## Side-by-side comparison

| Aspect | Classic | `createSlice` |
|---|---|---|
| Lines of code | ~30 (plus separate action creators) | ~25, action creators included |
| `remove`/`toggle`/`edit` update style | `.filter`/`.map` returning new arrays | `.filter` (reassigned) / direct mutation of the found item via Immer |
| ID generation | Manual module-level counter (a code smell — see follow-ups) | `nanoid()` inside `prepare`, still outside the reducer itself |
| Risk of forgetting a spread somewhere | Real — easy to accidentally mutate deeply nested state | Eliminated for the parts Immer manages |

## Interview follow-ups this problem invites

- "Why is the classic version's `let nextId = 1;` module-level counter a code smell?" It's mutable shared state living outside Redux entirely, breaks in a multi-instance/SSR context (each server request could get a fresh module instance, colliding IDs across requests, or persisting IDs across unrelated requests depending on module caching), and isn't deterministic for replay/testing purposes — `nanoid()` (or a UUID) generated in `prepare`/an action creator has none of these problems, since it's fixed at action-creation time and doesn't depend on any external counter state.
- "In the `createSlice` version, why does `todoRemoved` reassign `state.todos = state.todos.filter(...)` instead of mutating in place, while `todoToggled` does mutate the found item directly?" Both are valid Immer usage — `.filter()` naturally produces a new array, and assigning it to `state.todos` (a property of the draft) is a recorded "mutation" from Immer's perspective; there's no in-place-removal method that would be simpler here, so reassignment is idiomatic. `todoToggled`, in contrast, is mutating one property of an existing object it found via `.find()` — also valid, because that object is itself a proxied draft.
