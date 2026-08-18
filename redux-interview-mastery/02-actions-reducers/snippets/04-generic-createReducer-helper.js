// A small, hand-rolled createReducer(initialState, handlers) helper —
// a lighter-weight alternative to a raw switch statement, and a simplified
// cousin of Redux Toolkit's own createReducer.
// Run with: node 04-generic-createReducer-helper.js
function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
      return handlers[action.type](state, action);
    }
    return state;
  };
}

const cartReducer = createReducer(
  { items: [] },
  {
    'cart/itemAdded': (state, action) => ({
      ...state,
      items: [...state.items, action.payload],
    }),
    'cart/itemRemoved': (state, action) => ({
      ...state,
      items: state.items.filter((i) => i.id !== action.payload),
    }),
  }
);

console.log(cartReducer(undefined, { type: '@@INIT' })); // { items: [] }
console.log(
  cartReducer(undefined, { type: 'cart/itemAdded', payload: { id: 1, name: 'Book' } })
);
// -> { items: [{ id: 1, name: 'Book' }] }
