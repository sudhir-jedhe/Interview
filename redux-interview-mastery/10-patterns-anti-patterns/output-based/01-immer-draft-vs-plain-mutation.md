## Both of these reducers "mutate" state. Which is safe, and what logs?

```javascript
import { createSlice } from '@reduxjs/toolkit';
import { createStore, combineReducers } from 'redux';

// Reducer A: inside createSlice (Immer-wrapped)
const sliceA = createSlice({
  name: 'a',
  initialState: { count: 0 },
  reducers: {
    incremented(state) { state.count += 1; }, // looks like mutation
  },
});

// Reducer B: plain function passed to a classic createStore/combineReducers
function reducerB(state = { count: 0 }, action) {
  if (action.type === 'b/incremented') {
    state.count += 1; // ALSO looks like mutation — but is it the same thing?
    return state;
  }
  return state;
}

const storeA = createStore(sliceA.reducer);
const before = storeA.getState();
storeA.dispatch(sliceA.actions.incremented());
console.log('A: before === after?', before === storeA.getState());

const storeB = createStore(reducerB);
const beforeB = storeB.getState();
storeB.dispatch({ type: 'b/incremented' });
console.log('B: before === after?', beforeB === storeB.getState());
```

**Answer:**
```
A: before === after? false
B: before === after? true
```

**Why:** Reducer A's function body runs inside an Immer "producer" (this is what `createSlice`'s `reducers` map sets up automatically) — `state.count += 1` is intercepted by Immer's Proxy and turned into a correct, structurally-new object under the hood. It only *looks* like a mutation; the actual returned state is a new reference, so `before === after` is `false`, which is what `useSelector` needs to detect the change. Reducer B is a plain function with no Immer wrapping — `state.count += 1` genuinely mutates the object in place and then returns that same, now-mutated reference. `before === after` is `true`, meaning Redux (and any `useSelector`-based component) cannot tell a change happened at all, since reference equality is the entire detection mechanism. This is precisely why "just mutate it, Immer will handle it" is a dangerous rule of thumb without qualification — it's only true inside Immer-wrapped reducers (RTK's `createSlice`/`createReducer`), never inside a plain reducer function passed directly to `createStore` or `combineReducers`.
