// A minimal logging middleware, applied via applyMiddleware.
// Run with: node 01-logger-middleware.js  (after `npm install redux`)
const { createStore, applyMiddleware } = require('redux');

const logger = (store) => (next) => (action) => {
  console.log('prev state:', store.getState());
  console.log('action:', action);
  const result = next(action);
  console.log('next state:', store.getState());
  console.log('---');
  return result;
};

function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'incremented':
      return { count: state.count + 1 };
    default:
      return state;
  }
}

const store = createStore(counterReducer, applyMiddleware(logger));

store.dispatch({ type: 'incremented' });
store.dispatch({ type: 'incremented' });
