# Output: "Mutating" state inside createSlice — safe or not?

```javascript
const { configureStore, createSlice } = require('@reduxjs/toolkit');

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    added(state, action) {
      state.push(action.payload); // looks like a mutation
    },
  },
});

const store = configureStore({ reducer: todosSlice.reducer });
const before = store.getState();

store.dispatch(todosSlice.actions.added('Buy milk'));

const after = store.getState();

console.log(before === after);
console.log(before);
console.log(after);
```

**Answer:** `false`, then `[]`, then `['Buy milk']`

**Why:** Inside a `createSlice` reducer, Redux Toolkit wraps your reducer function with Immer's `produce`. `state.push(...)` isn't mutating the real state object at all — Immer gives you a `Proxy` that *records* the mutation-style operations you perform, then Immer produces a brand-new, structurally-shared state object based on those recorded operations, leaving the original `before` object completely untouched (which is why it's still `[]`). This is the key selling point of `createSlice`: you get to *write* mutating-looking code for developer ergonomics, while Immer guarantees the actual objects handed to reducers and read via `getState()` remain immutable under the hood — so time-travel debugging and reference-equality-based re-renders still work correctly. Outside of `createSlice`/`createReducer` (i.e., in a plain hand-written reducer with no Immer), the exact same `state.push(...)` line would mutate the real array and silently break re-renders — see `02-actions-reducers/output-based` for that failure mode in isolation.
