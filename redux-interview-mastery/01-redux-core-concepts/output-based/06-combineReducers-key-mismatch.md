# Output: combineReducers with a reducer key that never matches an action

```javascript
const { createStore, combineReducers } = require('redux');

function todos(state = [], action) {
  switch (action.type) {
    case 'todos/added':
      return [...state, action.payload];
    default:
      return state;
  }
}

function visibilityFilter(state = 'ALL', action) {
  switch (action.type) {
    case 'filter/set':
      return action.payload;
    default:
      return state;
  }
}

const rootReducer = combineReducers({ todos, visibilityFilter });
const store = createStore(rootReducer);

store.dispatch({ type: 'todos/added', payload: 'Buy milk' });

console.log(Object.keys(store.getState()));
console.log(store.getState().visibilityFilter);
```

**Answer:** `['todos', 'visibilityFilter']`, then `'ALL'`

**Why:** `combineReducers` runs **every** slice reducer on **every** dispatched action — it doesn't route actions to "the right" reducer based on the action type. `todos/added` is passed to both `todos` (which handles it) and `visibilityFilter` (which doesn't recognize it, hits `default`, returns its unchanged current state, `'ALL'`). The resulting state object always has one key per reducer passed to `combineReducers`, regardless of which reducers "cared about" the dispatched action. This is a common early misconception — people assume the action `type` somehow determines which slice reducer runs, when in fact every reducer sees every action and independently decides whether to respond via its own `switch`/`default` logic.
