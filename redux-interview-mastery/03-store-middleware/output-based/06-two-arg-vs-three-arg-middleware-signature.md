# Output: A middleware written with the wrong arity

```javascript
const { createStore, applyMiddleware } = require('redux');

// WRONG: two arguments in the outer function instead of curried single-arg calls
const brokenMiddleware = (store, next) => (action) => {
  console.log('action:', action.type);
  return next(action);
};

function reducer(state = { count: 0 }, action) {
  return state;
}

try {
  const store = createStore(reducer, applyMiddleware(brokenMiddleware));
  store.dispatch({ type: 'test' });
} catch (e) {
  console.log(e.message);
}
```

**Answer:** Throws a `TypeError`, roughly: `next is not a function` (or similar, depending on the exact Redux version's internals) — the process crashes when `dispatch` is called.

**Why:** `applyMiddleware` calls each middleware with exactly **one** argument — the restricted store object (`{ getState, dispatch }`) — and expects the return value to be a function that itself takes exactly one argument, `next`. Here, `brokenMiddleware(store, next)` is called as `brokenMiddleware(store)` (JavaScript silently allows calling a two-parameter function with one argument — the second parameter, `next`, is simply `undefined`), so the returned inner function is `(action) => { ...; return next(action); }` where `next` is closed over as `undefined`, not the real "next" function. Calling `next(action)` therefore throws, because `undefined` is not callable. This is a very easy typo to make from memory under interview pressure — the correct signature is strictly `(store) => (next) => (action) => {...}`, three separate single-argument arrow functions chained, never combining `store` and `next` into one function's parameter list.
