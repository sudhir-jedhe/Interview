// A middleware that catches errors thrown by later middleware or the
// reducer itself, and dispatches a reportable error action instead of
// crashing the whole dispatch call.
// Run with: node 03-error-catching-middleware.js
const { createStore, applyMiddleware } = require('redux');

const crashReporterMiddleware = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (err) {
    console.error('Caught an exception during dispatch!', err.message);
    store.dispatch({ type: 'error/reported', payload: { message: err.message, action } });
    // Deliberately not re-throwing here — see the file's discussion below.
    return undefined;
  }
};

function reducer(state = { value: 0, lastError: null }, action) {
  switch (action.type) {
    case 'value/divided':
      if (action.payload === 0) throw new Error('Division by zero');
      return { ...state, value: state.value / action.payload };
    case 'error/reported':
      return { ...state, lastError: action.payload.message };
    default:
      return state;
  }
}

const store = createStore(reducer, applyMiddleware(crashReporterMiddleware));

store.dispatch({ type: 'value/divided', payload: 0 }); // throws inside reducer, caught by middleware
console.log(store.getState());
// -> { value: 0, lastError: 'Division by zero' }
// The app keeps running instead of the whole dispatch call throwing uncaught.
