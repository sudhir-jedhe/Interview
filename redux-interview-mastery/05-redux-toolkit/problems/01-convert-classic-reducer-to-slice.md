# Problem 1: Convert a Hand-Written Reducer Module to `createSlice`

## Task

Below is a classic, pre-RTK Redux module for managing a to-do list. Convert it to a single `createSlice` call that preserves the exact same external behavior (same action creator names, same state shape), while removing the manual action type constants and manual immutable spreading.

## Starting point (classic Redux)

```javascript
// actionTypes.js
export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const REMOVE_TODO = 'REMOVE_TODO';
export const SET_FILTER = 'SET_FILTER';

// actions.js
import { ADD_TODO, TOGGLE_TODO, REMOVE_TODO, SET_FILTER } from './actionTypes';
let nextId = 1;

export const addTodo = (text) => ({ type: ADD_TODO, payload: { id: nextId++, text, done: false } });
export const toggleTodo = (id) => ({ type: TOGGLE_TODO, payload: id });
export const removeTodo = (id) => ({ type: REMOVE_TODO, payload: id });
export const setFilter = (filter) => ({ type: SET_FILTER, payload: filter });

// reducer.js
import { ADD_TODO, TOGGLE_TODO, REMOVE_TODO, SET_FILTER } from './actionTypes';

const initialState = { items: [], filter: 'all' };

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      return { ...state, items: [...state.items, action.payload] };
    case TOGGLE_TODO:
      return {
        ...state,
        items: state.items.map((t) =>
          t.id === action.payload ? { ...t, done: !t.done } : t
        ),
      };
    case REMOVE_TODO:
      return { ...state, items: state.items.filter((t) => t.id !== action.payload) };
    case SET_FILTER:
      return { ...state, filter: action.payload };
    default:
      return state;
  }
}
```

## Requirements

- Single `todosSlice.js` file, exporting the same four action creators (`addTodo`, `toggleTodo`, `removeTodo`, `setFilter`) and a default-exported reducer.
- Use `nanoid` (from `@reduxjs/toolkit`) instead of a module-level `nextId` counter, via a `prepare` callback.
- No manual spreading — use Immer-style "mutation."

## Reference solution

```javascript
import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = { items: [], filter: 'all' };

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare(text) {
        return { payload: { id: nanoid(), text, done: false } };
      },
    },
    toggleTodo(state, action) {
      const todo = state.items.find((t) => t.id === action.payload);
      if (todo) todo.done = !todo.done;
    },
    removeTodo(state, action) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
  },
});

export const { addTodo, toggleTodo, removeTodo, setFilter } = todosSlice.actions;
export default todosSlice.reducer;
```

## Why this is a fair migration

- `nextId++` in module scope is itself a latent bug (it resets on hot-reload/module re-eval and isn't serializable/replayable); `nanoid()` inside `prepare` is the RTK-idiomatic replacement and doesn't require external mutable state.
- `TOGGLE_TODO`'s old immutable `.map` that clones every item just to toggle one is now a direct, safe, targeted mutation (`todo.done = !todo.done`) — same outcome, less code, and it's clearer about intent (only one item changes).
- The action creators' call signatures are unchanged (`addTodo(text)`, `toggleTodo(id)`, etc.), so every existing `dispatch(addTodo('Buy milk'))` call site in the app keeps working without modification.
