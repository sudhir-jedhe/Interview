# Output: What does an unhandled action type produce?

```javascript
const { createStore } = require('redux');

function reducer(state = { value: 1 }, action) {
  switch (action.type) {
    case 'value/set':
      return { value: action.payload };
    default:
      return state;
  }
}

const store = createStore(reducer);
const before = store.getState();

store.dispatch({ type: '@@totally/made/up' });

const after = store.getState();

console.log(before === after);
console.log(after);
```

**Answer:** `true`, then `{ value: 1 }`

**Why:** The `default` branch returns the exact same `state` reference it received — it doesn't clone or rebuild the object. Since the reducer returns the identical reference for an action it doesn't recognize, `before === after` is `true`. This is the correct, required pattern: every reducer must handle unknown action types by returning existing state unchanged, both because Redux dispatches internal bookkeeping actions (like `@@redux/INIT`) that your reducer will never explicitly handle, and because returning the same reference lets `useSelector`/`connect` correctly skip re-rendering — if you accidentally returned a *new* object with the same contents in the default case, every action dispatched anywhere in the app would cause spurious re-renders of every component reading that slice.
