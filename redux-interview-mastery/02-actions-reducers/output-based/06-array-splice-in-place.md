# Output: `splice` inside a reducer that "looks" immutable

```javascript
const { createStore } = require('redux');

function reducer(state = { items: ['a', 'b', 'c'] }, action) {
  switch (action.type) {
    case 'item/removedAt': {
      const newItems = state.items; // NOTE: not a copy, just another reference
      newItems.splice(action.payload, 1);
      return { ...state, items: newItems };
    }
    default:
      return state;
  }
}

const store = createStore(reducer);
const before = store.getState();
const beforeItems = before.items;

store.dispatch({ type: 'item/removedAt', payload: 1 });

console.log(beforeItems);
console.log(store.getState().items);
console.log(beforeItems === store.getState().items);
```

**Answer:** `['a', 'c']`, then `['a', 'c']`, then `true`

**Why:** `const newItems = state.items` does not copy the array — it just creates a second variable name pointing at the *same* array object. `.splice()` then mutates that array in place, removing the element at index 1. Because `newItems` and `state.items` (and therefore `beforeItems`) are all the same reference, the "before" snapshot you captured earlier is retroactively changed too — logging `beforeItems` after the dispatch shows the *already-mutated* array, not what it looked like before the action ran. The outer `{ ...state, items: newItems }` creates a new top-level object, which can mislead you into thinking the whole update is immutable, but the array itself was never copied. The fix: `const newItems = [...state.items]; newItems.splice(...)`, or more idiomatically, `state.items.filter((_, i) => i !== action.payload)` which never mutates the source array at all.
