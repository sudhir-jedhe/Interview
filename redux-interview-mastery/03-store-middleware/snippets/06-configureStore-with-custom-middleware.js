// Wiring a custom middleware into Redux Toolkit's configureStore, preserving
// the default middleware (thunk + dev-mode checks) rather than replacing it.
// Run with: node 06-configureStore-with-custom-middleware.js
const { configureStore, createSlice } = require('@reduxjs/toolkit');

const logger = (store) => (next) => (action) => {
  console.log('dispatch:', action.type);
  return next(action);
};

const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    incremented(state) {
      state.count += 1;
    },
  },
});

const store = configureStore({
  reducer: { counter: counterSlice.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

store.dispatch(counterSlice.actions.incremented());
console.log(store.getState());
// -> logs "dispatch: counter/incremented" then { counter: { count: 1 } }
