// redux-thunk in action: an async action creator dispatching a pending/
// fulfilled/rejected sequence. Uses a fake API to stay runnable offline.
// Run with: node 02-thunk-basic-usage.js  (after `npm install redux redux-thunk`)
const { createStore, applyMiddleware } = require('redux');
const { thunk } = require('redux-thunk'); // v3+ named export; use default export for v2

function fakeApiFetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 1) resolve({ id: 1, name: 'Ada Lovelace' });
      else reject(new Error('User not found'));
    }, 50);
  });
}

function userReducer(state = { loading: false, data: null, error: null }, action) {
  switch (action.type) {
    case 'user/fetchStarted':
      return { loading: true, data: null, error: null };
    case 'user/fetchSucceeded':
      return { loading: false, data: action.payload, error: null };
    case 'user/fetchFailed':
      return { loading: false, data: null, error: action.payload };
    default:
      return state;
  }
}

function fetchUser(id) {
  return async (dispatch) => {
    dispatch({ type: 'user/fetchStarted' });
    try {
      const user = await fakeApiFetchUser(id);
      dispatch({ type: 'user/fetchSucceeded', payload: user });
    } catch (err) {
      dispatch({ type: 'user/fetchFailed', payload: err.message });
    }
  };
}

const store = createStore(userReducer, applyMiddleware(thunk));
store.subscribe(() => console.log(store.getState()));

store.dispatch(fetchUser(1));
// logs: { loading: true, ... } then, ~50ms later: { loading: false, data: {...} }
