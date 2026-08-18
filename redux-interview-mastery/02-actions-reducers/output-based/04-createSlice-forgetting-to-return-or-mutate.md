# Output: `createSlice` reducer that both mutates AND returns a new value

```javascript
const { configureStore, createSlice } = require('@reduxjs/toolkit');

const slice = createSlice({
  name: 'demo',
  initialState: { count: 0 },
  reducers: {
    broken(state) {
      state.count += 1; // mutates the Immer draft
      return { count: 100 }; // ALSO returns a new value
    },
  },
});

const store = configureStore({ reducer: slice.reducer });

try {
  store.dispatch(slice.actions.broken());
} catch (e) {
  console.log(e.message);
}
```

**Answer:** Throws an Immer error along the lines of: `An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.`

**Why:** Immer requires a producer function to pick exactly one strategy: either mutate the `draft` (and return `undefined` implicitly) or leave the draft untouched and `return` a brand-new value to replace state entirely — never both. Mixing them is ambiguous ("which change should win, the mutation or the returned object?"), so Immer detects it and throws rather than silently picking one. This is a real trap for engineers moving from classic reducers (where `return {...}` is the *only* pattern) to `createSlice`: muscle memory to "always `return` something" from a reducer clashes with Immer's mutate-the-draft style. The fix is to commit to one style per reducer function — either `state.count += 1;` with no return statement, or `return { ...state, count: state.count + 1 };` with no draft mutation.
