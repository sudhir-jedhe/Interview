# Output: A spread that only shallow-copies

```javascript
const { createStore } = require('redux');

const initialState = { user: { name: 'Ada', tags: ['admin'] } };

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'tag/added':
      const newState = { ...state }; // shallow copy of top level only
      newState.user.tags.push(action.payload); // mutates the nested array in place!
      return newState;
    default:
      return state;
  }
}

const store = createStore(reducer);
const before = store.getState();
const beforeTags = before.user.tags;

store.dispatch({ type: 'tag/added', payload: 'editor' });

const after = store.getState();

console.log(before === after);
console.log(before.user === after.user);
console.log(beforeTags === after.user.tags);
console.log(beforeTags);
```

**Answer:** `false`, then `true`, then `true`, then `['admin', 'editor']`

**Why:** `{ ...state }` only copies the *top-level* keys — `newState.user` still points to the exact same `user` object (and its `tags` array) as `state.user`. So the top-level `before !== after` (a new outer object), which can trick you into thinking the update is "immutable" — but `before.user === after.user` is `true`, and the nested `.push()` mutated the shared `tags` array, which is why `beforeTags` itself now contains `'editor'` even though nothing should have changed the "old" snapshot. Any component selecting `state.user` (not the whole state) would fail to re-render, since `user`'s reference never changed. The fix requires spreading at *every* level you're changing: `{ ...state, user: { ...state.user, tags: [...state.user.tags, action.payload] } }`.
