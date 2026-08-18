// A classic hand-written reducer with manual immutable updates.
// Run with: node 02-classic-switch-reducer.js
const { createStore } = require('redux');

const initialState = { items: [] };

function cartReducer(state = initialState, action) {
  switch (action.type) {
    case 'cart/itemAdded':
      return { ...state, items: [...state.items, action.payload] };
    case 'cart/itemRemoved':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case 'cart/quantityChanged':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i
        ),
      };
    default:
      return state;
  }
}

const store = createStore(cartReducer);
store.dispatch({ type: 'cart/itemAdded', payload: { id: 1, name: 'Book', qty: 1 } });
store.dispatch({ type: 'cart/quantityChanged', payload: { id: 1, qty: 3 } });
console.log(store.getState());
// -> { items: [{ id: 1, name: 'Book', qty: 3 }] }
