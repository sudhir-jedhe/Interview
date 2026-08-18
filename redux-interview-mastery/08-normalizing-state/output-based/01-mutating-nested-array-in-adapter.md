## What does this log?

```javascript
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const postsAdapter = createEntityAdapter();

const postsSlice = createSlice({
  name: 'posts',
  initialState: postsAdapter.getInitialState(),
  reducers: {
    commentIdAdded(state, action) {
      // NOTE: mutating directly, not via adapter.updateOne
      const post = state.entities[action.payload.postId];
      post.commentIds.push(action.payload.commentId);
    },
  },
});

const state0 = postsAdapter.addOne(postsSlice.getInitialState(), {
  id: 'p1',
  commentIds: ['c1'],
});

const state1 = postsSlice.reducer(state0, {
  type: 'posts/commentIdAdded',
  payload: { postId: 'p1', commentId: 'c2' },
});

console.log(state0.entities.p1.commentIds);
console.log(state1.entities.p1.commentIds);
console.log(state0 === state1);
console.log(state0.entities.p1 === state1.entities.p1);
```

**Answer:**
```
[ 'c1', 'c2' ]
[ 'c1', 'c2' ]
false
false
```
Both logs show the updated array `['c1', 'c2']`, `state0 !== state1`, and `state0.entities.p1 !== state1.entities.p1`.

**Why:** Every reducer function passed to `createSlice`'s `reducers` map is automatically wrapped by Immer (RTK does this for you). Inside an Immer "producer," `state` is a Proxy-backed draft — pushing into `post.commentIds` looks like a direct mutation, but Immer intercepts it and produces a new, structurally-shared object behind the scenes without you writing any spreads. That's *why* this code, despite looking like a Rule-2 violation ("state is read-only"), is actually safe and idiomatic inside RTK's `createSlice`/`createReducer`. The trap: this exact code, if run through a *plain* `combineReducers`/`createStore` reducer without Immer, would mutate `state0.entities.p1` in place, both logs would show `['c1', 'c2']` still, but `state0 === state1` would be `true` and `state0.entities.p1 === state1.entities.p1` would also be `true` — silently breaking `useSelector`'s reference-equality re-render check. Knowing which of these two worlds you're in (Immer-wrapped `createSlice` vs. a raw switch-based reducer) is exactly what interviewers probe with this kind of snippet.
