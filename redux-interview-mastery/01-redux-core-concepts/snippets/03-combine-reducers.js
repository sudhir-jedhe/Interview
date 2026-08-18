// combineReducers: merging independent slices into one root state tree.
// Run with: node 03-combine-reducers.js  (after `npm install redux`)
const { createStore, combineReducers } = require('redux');

function userReducer(state = { name: null }, action) {
  switch (action.type) {
    case 'user/loggedIn':
      return { name: action.payload };
    default:
      return state;
  }
}

function cartReducer(state = { items: [] }, action) {
  switch (action.type) {
    case 'cart/itemAdded':
      return { items: [...state.items, action.payload] };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
});

const store = createStore(rootReducer);

store.dispatch({ type: 'user/loggedIn', payload: 'Ada' });
store.dispatch({ type: 'cart/itemAdded', payload: { id: 1, name: 'Book' } });

console.log(store.getState());
// -> { user: { name: 'Ada' }, cart: { items: [{ id: 1, name: 'Book' }] } }
