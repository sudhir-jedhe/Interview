// replaceReducer: swap the root reducer at runtime — used for code-splitting
// feature reducers or hot-module-reloading during development.
// Run with: node 05-replace-reducer.js
const { createStore } = require('redux');

function initialReducer(state = { version: 1 }, action) {
  if (action.type === 'ping') return { ...state, pings: (state.pings || 0) + 1 };
  return state;
}

const store = createStore(initialReducer);
store.dispatch({ type: 'ping' });
console.log('Before replace:', store.getState()); // { version: 1, pings: 1 }

function upgradedReducer(state = { version: 2 }, action) {
  if (action.type === 'ping') return { ...state, pings: (state.pings || 0) + 1 };
  return state;
}

// NOTE: replaceReducer does NOT reset state — it keeps whatever the store
// currently holds and just swaps which function computes future updates.
store.replaceReducer(upgradedReducer);
store.dispatch({ type: 'ping' });
console.log('After replace:', store.getState()); // { version: 1, pings: 2 } — old state preserved
