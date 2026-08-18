// Modern equivalent using Redux Toolkit's configureStore + createSlice.
// Run with: node 02-configure-store-rtk.js  (after `npm install @reduxjs/toolkit`)
const { configureStore, createSlice } = require('@reduxjs/toolkit');

const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    incremented(state) {
      state.count += 1; // Immer makes this safe — see 02-actions-reducers
    },
    decremented(state) {
      state.count -= 1;
    },
  },
});

const store = configureStore({
  reducer: { counter: counterSlice.reducer },
});

store.subscribe(() => console.log('State changed:', store.getState()));

store.dispatch(counterSlice.actions.incremented());
store.dispatch(counterSlice.actions.incremented());
store.dispatch(counterSlice.actions.decremented());

console.log('Final state:', store.getState());
// -> { counter: { count: 1 } }
