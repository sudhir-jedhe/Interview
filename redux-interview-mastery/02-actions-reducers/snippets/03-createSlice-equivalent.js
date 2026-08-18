// The same cart logic as 02-classic-switch-reducer.js, via createSlice + Immer.
// Run with: node 03-createSlice-equivalent.js  (after `npm install @reduxjs/toolkit`)
const { configureStore, createSlice } = require('@reduxjs/toolkit');

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    itemAdded(state, action) {
      state.items.push(action.payload);
    },
    itemRemoved(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    quantityChanged(state, action) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) item.qty = action.payload.qty; // safe "mutation" via Immer
    },
  },
});

const { itemAdded, itemRemoved, quantityChanged } = cartSlice.actions;
const store = configureStore({ reducer: cartSlice.reducer });

store.dispatch(itemAdded({ id: 1, name: 'Book', qty: 1 }));
store.dispatch(quantityChanged({ id: 1, qty: 3 }));
console.log(store.getState());
// -> { items: [{ id: 1, name: 'Book', qty: 3 }] }
