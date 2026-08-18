## What's `store.getState()` after these three dispatches?

```javascript
import { configureStore, createSlice } from '@reduxjs/toolkit';

const a = createSlice({
  name: 'a',
  initialState: { value: 1 },
  reducers: { bump: (s) => { s.value += 1; } },
});

const b = createSlice({
  name: 'b',
  initialState: { value: 1 },
  reducers: { bump: (s) => { s.value += 1; } },
});

const store = configureStore({
  reducer: { a: a.reducer, b: b.reducer },
});

store.dispatch(a.actions.bump());
store.dispatch({ type: 'b/bump' }); // hand-written plain object, same type string
store.dispatch({ type: 'a/bump' });

console.log(store.getState());
```

**Answer:** `{ a: { value: 3 }, b: { value: 2 } }`

**Why:** This tests whether you understand that RTK's generated action creators are just a convenience for *producing* `{ type, payload }` objects — the store doesn't care whether an action came from `a.actions.bump()` or was typed out by hand as `{ type: 'a/bump' }`. Both are structurally identical, so `{ type: 'a/bump' }` dispatched manually triggers `a`'s reducer exactly as if you'd called `a.actions.bump()`. Also notice each slice reducer only reacts to its own action type — `configureStore`'s combined reducer runs *every* slice reducer on *every* dispatched action (that's how `combineReducers` always worked), but `a`'s reducer returns its existing state unchanged for `b/bump` since it doesn't match any of `a`'s case reducers, so `b/bump` only increments `b.value`. Three dispatches — two matching `a`, one matching `b` — leave `a.value` at `1 + 1 + 1 = 3` and `b.value` at `1 + 1 = 2`.
