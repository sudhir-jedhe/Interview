# Output: Reference identity after a "no-op" style update

```javascript
const { createStore } = require('redux');

function reducer(state = { list: [1, 2, 3] }, action) {
  switch (action.type) {
    case 'sort':
      return { list: state.list.sort() }; // .sort() mutates AND returns the same array
    default:
      return state;
  }
}

const store = createStore(reducer);
const before = store.getState();
const beforeList = before.list;

store.dispatch({ type: 'sort' });

const after = store.getState();

console.log(before === after);
console.log(beforeList === after.list);
```

**Answer:** `false`, then `true`

**Why:** `{ list: state.list.sort() }` creates a *new outer object* every time, so `before === after` is `false` — this looks correct at a glance. But `Array.prototype.sort()` mutates the array **in place** and returns the same reference, so `state.list` and `after.list` are the literal same array object: `beforeList === after.list` is `true`. This is a classic "looks immutable, isn't" bug: the reducer appears to follow the "always return a new object" pattern, but a component doing `useSelector((s) => s.list)` would not re-render correctly if something elsewhere also held a reference to the old array and compared it — and worse, if `before.list` was captured anywhere (e.g., in a previous render, in a DevTools snapshot for time-travel), that array has now silently changed underneath it. The fix is `[...state.list].sort()`, which copies before sorting.
