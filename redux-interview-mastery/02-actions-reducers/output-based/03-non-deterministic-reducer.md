# Output: Same action, different results, twice in a row

```javascript
const { createStore } = require('redux');

function reducer(state = { entries: [] }, action) {
  switch (action.type) {
    case 'entry/added':
      return { entries: [...state.entries, { text: action.payload, id: Math.random() }] };
    default:
      return state;
  }
}

const store1 = createStore(reducer);
store1.dispatch({ type: 'entry/added', payload: 'note' });

const store2 = createStore(reducer);
store2.dispatch({ type: 'entry/added', payload: 'note' });

console.log(store1.getState().entries[0].id === store2.getState().entries[0].id);
```

**Answer:** `false` (near-certainly — two independent `Math.random()` calls essentially never collide)

**Why:** The reducer generates a random `id` *inside* itself, violating the "no non-determinism" rule for pure reducers. Given the exact same initial state and the exact same dispatched action, two separate runs produce *different* resulting state — which is precisely what a pure function must never do. This isn't just a style nitpick: Redux DevTools' time-travel and action-replay features assume that replaying a captured action log against the initial state reproduces the exact same state that occurred live. With `Math.random()` (or `Date.now()`, or `crypto.randomUUID()`) called inside the reducer, replay produces a *different* id every time, breaking any test, DevTools session, or debugging replay that relies on reproducibility. The fix: generate the id in the action creator (or a `prepare` callback in `createSlice`) before dispatch, so the reducer just consumes an already-fixed value from `action.payload`.
