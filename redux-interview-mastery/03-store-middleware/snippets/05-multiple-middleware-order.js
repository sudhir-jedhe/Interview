// Demonstrates that middleware order determines execution order, and why
// thunk must come before a plain logger for the logger to see real actions.
// Run with: node 05-multiple-middleware-order.js
const { createStore, applyMiddleware } = require('redux');
const { thunk } = require('redux-thunk');

const logger = (store) => (next) => (action) => {
  console.log('logger saw:', typeof action === 'function' ? '[function]' : action.type);
  return next(action);
};

function reducer(state = { count: 0 }, action) {
  if (action.type === 'increment') return { count: state.count + 1 };
  return state;
}

console.log('--- thunk BEFORE logger (correct order) ---');
const store1 = createStore(reducer, applyMiddleware(thunk, logger));
store1.dispatch((dispatch) => dispatch({ type: 'increment' }));
// logger saw: 'increment'  <- thunk resolved the function into a real action first

console.log('--- logger BEFORE thunk (wrong order) ---');
const store2 = createStore(reducer, applyMiddleware(logger, thunk));
store2.dispatch((dispatch) => dispatch({ type: 'increment' }));
// logger saw: '[function]'  <- logger sees the raw thunk function, not a real action
