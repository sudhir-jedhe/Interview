# Output: Dispatching from inside a reducer

```javascript
const { createStore } = require('redux');

function reducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'increment':
      if (state.count === 0) {
        store.dispatch({ type: 'increment' }); // dispatching from within the reducer
      }
      return { count: state.count + 1 };
    default:
      return state;
  }
}

const store = createStore(reducer);

try {
  store.dispatch({ type: 'increment' });
} catch (e) {
  console.log(e.message);
}
```

**Answer:** Throws: `Reducers may not dispatch actions.`

**Why:** Redux explicitly guards against reducers calling `dispatch`. Dispatch is not reentrant — while a dispatch is in progress, the store is mid-way through computing the next state, and its internal "is dispatching" flag is `true`. Calling `dispatch` again during that window would mean running the reducer against a state tree that hasn't finished being computed yet, which breaks the guarantee that each dispatch corresponds to exactly one clean, atomic transition. This is also a strong signal of a design smell: reducers must be pure — no side effects, and triggering another action *is* a side effect. If you need "when X happens, also do Y," that belongs in a thunk, a saga, or middleware — not inside the reducer itself.
