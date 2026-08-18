// A middleware that conditionally swallows actions instead of forwarding
// them — demonstrates that calling next() is optional, not automatic.
// Run with: node 04-conditional-blocking-middleware.js
const { createStore, applyMiddleware } = require('redux');

const blockWhileReadOnly = (store) => (next) => (action) => {
  const state = store.getState();
  if (state.readOnly && action.type.startsWith('data/')) {
    console.warn(`Blocked "${action.type}" — app is in read-only mode.`);
    return; // next() never called; reducer never sees this action
  }
  return next(action);
};

function reducer(state = { readOnly: false, items: [] }, action) {
  switch (action.type) {
    case 'mode/setReadOnly':
      return { ...state, readOnly: action.payload };
    case 'data/added':
      return { ...state, items: [...state.items, action.payload] };
    default:
      return state;
  }
}

const store = createStore(reducer, applyMiddleware(blockWhileReadOnly));

store.dispatch({ type: 'data/added', payload: 'first' });
console.log(store.getState().items); // ['first']

store.dispatch({ type: 'mode/setReadOnly', payload: true });
store.dispatch({ type: 'data/added', payload: 'second' }); // blocked, logs a warning
console.log(store.getState().items); // still ['first']
