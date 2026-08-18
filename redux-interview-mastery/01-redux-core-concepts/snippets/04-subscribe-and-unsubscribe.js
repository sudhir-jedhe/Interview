// subscribe() returns an unsubscribe function; listeners fire on every dispatch,
// not just ones that changed "their" slice — Redux itself does no diffing.
// Run with: node 04-subscribe-and-unsubscribe.js
const { createStore } = require('redux');

function reducer(state = { a: 0, b: 0 }, action) {
  switch (action.type) {
    case 'a/incremented':
      return { ...state, a: state.a + 1 };
    case 'b/incremented':
      return { ...state, b: state.b + 1 };
    default:
      return state;
  }
}

const store = createStore(reducer);
let callCount = 0;

const unsubscribe = store.subscribe(() => {
  callCount += 1;
  console.log(`listener call #${callCount}, state:`, store.getState());
});

store.dispatch({ type: 'a/incremented' }); // listener fires (call #1)
store.dispatch({ type: 'b/incremented' }); // listener fires even though "a" logic is untouched (call #2)

unsubscribe();

store.dispatch({ type: 'a/incremented' }); // no log — listener was removed
console.log('Final state (after unsubscribe):', store.getState());
