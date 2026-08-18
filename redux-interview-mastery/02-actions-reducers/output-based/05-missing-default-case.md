# Output: A reducer missing its `default` case

```javascript
const { createStore } = require('redux');

function reducer(state = { value: 1 }, action) {
  switch (action.type) {
    case 'value/set':
      return { value: action.payload };
    // no default case!
  }
}

const store = createStore(reducer);
console.log(store.getState());
```

**Answer:** Throws (or, depending on Redux version, logs a dev warning and then produces `state = undefined`, cascading into errors downstream) — specifically because the very first thing `createStore` does is dispatch an internal `@@redux/INIT` action, which doesn't match `'value/set'`, so the `switch` falls through with no matching case and no `default`, and the function implicitly returns `undefined`.

**Why:** Without a `default: return state;` branch, any action type the `switch` doesn't explicitly list — including Redux's own internal bootstrap action, and any action belonging to a completely different slice once you're inside `combineReducers` — causes the reducer to return `undefined`. Redux explicitly checks for this and throws a descriptive error (`Reducer "x" returned undefined during initialization...`) specifically to catch this mistake early, because a silent `undefined` state would otherwise cause confusing crashes far away from the actual bug, the first time any component tries to read a property off of `undefined` state. The rule "every reducer must handle unknown action types via a `default` that returns the existing state" isn't just style — it's required for the reducer to be well-defined for the full space of possible actions, not just the ones you happened to enumerate.
