# Output: Dispatching a function without thunk installed

```javascript
const { createStore } = require('redux');

function reducer(state = {}, action) { return state; }

const store = createStore(reducer); // no middleware at all

try {
  store.dispatch((dispatch) => {
    dispatch({ type: 'x' });
  });
} catch (e) {
  console.log(e.message);
}
```

**Answer:** Throws: `Actions must be plain objects. Instead, the actual type was: 'function'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions.`

**Why:** Plain Redux's `dispatch` validates that whatever it's given is a plain object with a `type` property — it has no built-in concept of "a function that will dispatch things later." Dispatching a function only works when middleware explicitly intercepts it, checks `typeof action === 'function'`, and calls it directly instead of forwarding it toward the reducer — that's the entire mechanism `redux-thunk` provides. Without thunk (or an equivalent) installed via `applyMiddleware`/`configureStore`'s middleware array, `dispatch(someFunction)` fails at the validation step, with an error message that (helpfully) names `redux-thunk` directly, because this is such a common first encounter.
