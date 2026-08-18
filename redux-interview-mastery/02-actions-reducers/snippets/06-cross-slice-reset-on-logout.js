// A slice reducer reacting to an action type it doesn't own, via
// createSlice's extraReducers — the sanctioned way to react across
// slice boundaries (e.g., resetting the cart on logout).
// Run with: node 06-cross-slice-reset-on-logout.js
const { configureStore, createSlice } = require('@reduxjs/toolkit');

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null },
  reducers: {
    loggedIn(state, action) {
      state.user = action.payload;
    },
    loggedOut(state) {
      state.user = null;
    },
  },
});

const cartInitialState = { items: [{ id: 1, name: 'Book' }] };

const cartSlice = createSlice({
  name: 'cart',
  initialState: cartInitialState,
  reducers: {
    itemAdded(state, action) {
      state.items.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authSlice.actions.loggedOut, () => cartInitialState);
  },
});

const store = configureStore({
  reducer: { auth: authSlice.reducer, cart: cartSlice.reducer },
});

store.dispatch(cartSlice.actions.itemAdded({ id: 2, name: 'Pen' }));
console.log(store.getState().cart.items.length); // 2

store.dispatch(authSlice.actions.loggedOut());
console.log(store.getState().cart.items.length); // 1 — cart reset by an auth action
