// A plain selector function: an implementation detail of "how do components
// read from the single state tree" without coupling every component to the
// shape of the state.
// Run with: node 06-derived-selector.js
const { createStore, combineReducers } = require('redux');

function cartReducer(state = { items: [] }, action) {
  switch (action.type) {
    case 'cart/itemAdded':
      return { items: [...state.items, action.payload] };
    default:
      return state;
  }
}

const store = createStore(combineReducers({ cart: cartReducer }));

// Selectors centralize "how do I read this piece of state" so components
// (or, here, plain calling code) don't need to know the exact shape.
const selectCartItems = (state) => state.cart.items;
const selectCartTotal = (state) =>
  selectCartItems(state).reduce((sum, item) => sum + item.price * item.qty, 0);

store.dispatch({ type: 'cart/itemAdded', payload: { id: 1, price: 10, qty: 2 } });
store.dispatch({ type: 'cart/itemAdded', payload: { id: 2, price: 5, qty: 1 } });

console.log('Items:', selectCartItems(store.getState()));
console.log('Total:', selectCartTotal(store.getState())); // 25
