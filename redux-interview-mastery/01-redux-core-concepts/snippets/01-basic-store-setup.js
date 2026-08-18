// Basic classic-Redux store setup: reducer, store creation, dispatch, subscribe.
// Run with: node 01-basic-store-setup.js  (after `npm install redux`)
const { createStore } = require('redux');

const initialState = { count: 0 };

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'counter/incremented':
      return { count: state.count + 1 };
    case 'counter/decremented':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

const store = createStore(counterReducer);

const unsubscribe = store.subscribe(() => {
  console.log('State changed:', store.getState());
});

store.dispatch({ type: 'counter/incremented' }); // { count: 1 }
store.dispatch({ type: 'counter/incremented' }); // { count: 2 }
store.dispatch({ type: 'counter/decremented' }); // { count: 1 }

console.log('Final state:', store.getState());
unsubscribe();
