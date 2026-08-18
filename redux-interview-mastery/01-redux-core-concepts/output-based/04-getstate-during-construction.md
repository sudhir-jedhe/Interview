# Output: Initial state before any action is dispatched

```javascript
const { createStore, combineReducers } = require('redux');

function counter(state = 0, action) {
  switch (action.type) {
    case 'inc':
      return state + 1;
    default:
      return state;
  }
}

function flag(state = false, action) {
  switch (action.type) {
    case 'toggle':
      return !state;
    default:
      return state;
  }
}

const store = createStore(combineReducers({ counter, flag }));

console.log(store.getState());
```

**Answer:** `{ counter: 0, flag: false }`

**Why:** `createStore` immediately dispatches an internal bootstrap action (something like `{ type: '@@redux/INIT<random>' }`) to populate the initial state — you never have to dispatch anything yourself for `getState()` to return a real object. Each slice reducer receives `state = undefined` for this internal action, falls through to its `default` case (since it doesn't recognize the init action type), and the `state = <default value>` parameter default kicks in, producing each slice's declared default (`0` for `counter`, `false` for `flag`). `combineReducers` then assembles those into `{ counter: 0, flag: false }`. This is exactly why every reducer *must* supply a default value for its `state` parameter — without it, the initial state for that slice would be `undefined`.
