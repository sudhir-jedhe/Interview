# Output: Does `subscribe` fire for unrelated actions?

```javascript
const { createStore } = require('redux');

function reducer(state = { a: 0, b: 0 }, action) {
  switch (action.type) {
    case 'a/incremented':
      return { ...state, a: state.a + 1 };
    default:
      return state; // note: no 'b' case at all
  }
}

const store = createStore(reducer);
let calls = 0;
store.subscribe(() => { calls += 1; });

store.dispatch({ type: 'a/incremented' });
store.dispatch({ type: 'totally/unknown/action' });
store.dispatch({ type: 'another/unknown/action' });

console.log(calls);
```

**Answer:** `3`

**Why:** `store.subscribe` registers a listener that runs after *every* dispatch, unconditionally — Redux's store has no concept of "did the relevant slice change." Even actions the reducer doesn't recognize still go through the full dispatch cycle: the reducer runs (hits `default`, returns the same `state` reference), the store commits that returned value as the new state, and then every subscriber is notified regardless of whether the reference actually changed. This is precisely why `react-redux`'s `useSelector` exists as a layer on top of `subscribe`: it does the reference-equality check that the raw store deliberately does not.
