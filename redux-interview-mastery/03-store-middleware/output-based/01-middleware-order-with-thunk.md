# Output: What does a logger see when placed after thunk vs before it?

```javascript
const { createStore, applyMiddleware } = require('redux');
const { thunk } = require('redux-thunk');

const logger = (store) => (next) => (action) => {
  console.log(typeof action);
  return next(action);
};

function reducer(state = {}, action) { return state; }

const storeA = createStore(reducer, applyMiddleware(thunk, logger));
storeA.dispatch((dispatch) => dispatch({ type: 'x' }));

const storeB = createStore(reducer, applyMiddleware(logger, thunk));
storeB.dispatch((dispatch) => dispatch({ type: 'x' }));
```

**Answer:** `storeA` logs `object` (once — for the real `{ type: 'x' }` action). `storeB` logs `function` then `object` (twice — once for the thunk function itself, once for the real action it dispatches).

**Why:** `applyMiddleware(thunk, logger)` means `thunk` sees every dispatched value *first*. When `thunk` receives a function, it calls that function directly (with `dispatch`/`getState`) rather than forwarding it to `logger` via `next` — so `logger` only ever sees the real, plain-object action the thunk eventually dispatches. With the order reversed (`logger, thunk`), `logger` sits *before* `thunk` in the chain, so it sees the raw function first (logging `function`), then calls `next(action)` which reaches `thunk`, which calls the function, which calls `dispatch` again — re-entering the *entire* middleware chain from the top with the real action, so `logger` logs `object` a second time on that second pass. This is exactly why `thunk` must be listed before general-purpose middleware like a logger: middleware order is not cosmetic, it determines what shape of "action" each middleware actually observes.
