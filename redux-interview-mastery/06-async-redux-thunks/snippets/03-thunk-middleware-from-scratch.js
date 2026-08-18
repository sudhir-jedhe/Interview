// The entire redux-thunk middleware, reimplemented, to show there's no magic.
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === 'function') {
      // it's a thunk: call it directly instead of forwarding to reducers
      return action(dispatch, getState, extraArgument);
    }
    // plain action object: forward down the middleware chain as normal
    return next(action);
  };
}

const thunkMiddleware = createThunkMiddleware();
export default thunkMiddleware;

// Wiring it up with plain Redux (no RTK):
// import { createStore, applyMiddleware } from 'redux';
// const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

// Without this middleware registered, dispatching a function throws:
// "Error: Actions must be plain objects. Instead, the actual type was: 'function'."
