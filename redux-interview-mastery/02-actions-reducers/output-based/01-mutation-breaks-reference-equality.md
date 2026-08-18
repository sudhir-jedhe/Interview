# Output: Mutating state directly in a plain reducer

```javascript
const { createStore } = require('redux');

function reducer(state = { items: [] }, action) {
  switch (action.type) {
    case 'itemAdded':
      state.items.push(action.payload); // mutation
      return state; // same reference
    default:
      return state;
  }
}

const store = createStore(reducer);
const before = store.getState();

store.dispatch({ type: 'itemAdded', payload: 'apple' });

const after = store.getState();

console.log(before === after);
console.log(before.items);
```

**Answer:** `true`, then `['apple']`

**Why:** `state.items.push(...)` mutates the array in place and `return state` returns the exact same object reference the reducer was given — so `before === after` is `true`, and worse, `before.items` *also* now contains `'apple'`, because `before` and `after` are literally the same object in memory. Any component doing `useSelector((s) => s)` (or comparing the top-level state reference) would see no change and skip re-rendering, even though the underlying data did change — a classic "works when you `console.log` it, silently fails in the UI" bug, because logging `store.getState()` after the fact shows the mutated data, masking that the *reference* never changed for anything that already held onto `before`.
