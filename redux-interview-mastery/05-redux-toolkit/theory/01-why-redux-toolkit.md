# Why Redux Toolkit Exists

Plain Redux is a tiny library — a store, a `dispatch` function, and a rule that reducers must be pure. That minimalism was the whole point in 2015, but in practice it pushed an enormous amount of ceremony onto every team that adopted it. You had to hand-write action type constants, action creators, switch-statement reducers that manually spread previous state to avoid mutation, and a separate `combineReducers` + `applyMiddleware` + `compose` incantation just to wire up devtools and thunks. None of that boilerplate is where the actual business logic lives, yet it's where most Redux bugs used to come from — a forgotten `...state` spread, a typo in an action type string that silently no-ops a reducer, or a store configured without the thunk middleware.

Redux Toolkit (RTK) is the Redux team's own answer to "Redux has too much boilerplate and too many footguns." It's not a different state management library; it's an opinionated wrapper around the same core `createStore`/`dispatch`/reducer model, packaged with sensible defaults. The official Redux docs now say plainly: **use Redux Toolkit for all new Redux code** — the "vanilla" patterns you may have learned from older tutorials are effectively legacy.

Three things define the RTK philosophy:

**1. Opinionated defaults over configuration.** `configureStore` replaces `createStore` and automatically wires up the thunk middleware, Redux DevTools, and a set of development-only checks — you don't have to know these exist to get them.

**2. Batteries included.** RTK bundles `redux`, `redux-thunk`, and `reselect` as dependencies, so a fresh project needs exactly one package instead of assembling four separately-versioned pieces that all have to agree with each other.

**3. Less code, same guarantees.** `createSlice` lets you write reducers that *look* like they mutate state directly (`state.value += 1`) while, under the hood, Immer produces a correctly immutable update. `createAsyncThunk` collapses the pending/fulfilled/rejected boilerplate of an async operation into one function call.

```javascript
// Before RTK: three action types, three action creators, one giant reducer
const INCREMENT = 'counter/increment';
const DECREMENT = 'counter/decrement';

const increment = () => ({ type: INCREMENT });
const decrement = () => ({ type: DECREMENT });

function counterReducer(state = { value: 0 }, action) {
  switch (action.type) {
    case INCREMENT:
      return { ...state, value: state.value + 1 };
    case DECREMENT:
      return { ...state, value: state.value - 1 };
    default:
      return state;
  }
}

// After RTK: one slice, action creators and types generated for you
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
    decrement: (state) => { state.value -= 1; },
  },
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;
```

For an interview, the key framing is: RTK does not change what Redux *is* conceptually — single store, unidirectional data flow, pure reducers producing new state. It changes how much code you have to write to get there safely, and it closes off a class of bugs (missing middleware, accidental mutation, action type typos) by construction rather than by convention. If someone asks "would you still write Redux by hand today," the honest senior answer is: essentially never, unless you're maintaining a legacy codebase or teaching the underlying mechanics.
