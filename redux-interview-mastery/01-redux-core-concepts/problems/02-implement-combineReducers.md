# Problem: Implement `combineReducers` From Scratch

## Task

Implement `combineReducers(reducersMap)` that takes an object mapping slice names to slice reducer functions, and returns a single root reducer function suitable for passing to `createStore`.

## Requirements

- The returned root reducer, given `(state, action)`, calls each slice reducer with `(state[sliceKey], action)` and assembles the results into a new object keyed by the same slice names.
- If none of the slice reducers actually changed their value (every one returned the same reference it was given), the root reducer should return the *same* top-level state object it received, not a new one — this preserves reference equality for `useSelector`/`connect` when nothing actually changed.
- (Bonus, matches real Redux) Warn if a slice reducer returns `undefined` for the init action, since that usually means a missing default parameter.

## Solution

```javascript
function combineReducers(reducersMap) {
  const reducerKeys = Object.keys(reducersMap);

  return function rootReducer(state = {}, action) {
    let hasChanged = false;
    const nextState = {};

    for (const key of reducerKeys) {
      const sliceReducer = reducersMap[key];
      const previousSliceState = state[key];
      const nextSliceState = sliceReducer(previousSliceState, action);

      if (typeof nextSliceState === 'undefined') {
        throw new Error(
          `Reducer for key "${key}" returned undefined for action type "${action.type}". ` +
          `Reducers must always return a value — did you forget a default state parameter?`
        );
      }

      nextState[key] = nextSliceState;
      hasChanged = hasChanged || nextSliceState !== previousSliceState;
    }

    // Also treat a change in the *set* of keys as a change (rare, but matches real Redux).
    hasChanged = hasChanged || reducerKeys.length !== Object.keys(state).length;

    return hasChanged ? nextState : state;
  };
}

module.exports = { combineReducers };
```

## Quick verification

```javascript
const { createStore } = require('./01-implement-createStore.js');
const { combineReducers } = require('./02-implement-combineReducers.js');

function todos(state = [], action) {
  switch (action.type) {
    case 'todos/added': return [...state, action.payload];
    default: return state;
  }
}

function visibilityFilter(state = 'ALL', action) {
  switch (action.type) {
    case 'filter/set': return action.payload;
    default: return state;
  }
}

const store = createStore(combineReducers({ todos, visibilityFilter }));

const s0 = store.getState();
console.log(s0); // { todos: [], visibilityFilter: 'ALL' }

store.dispatch({ type: 'todos/added', payload: 'Buy milk' });
const s1 = store.getState();
console.log(s1); // { todos: ['Buy milk'], visibilityFilter: 'ALL' }
console.log(s0 === s1); // false — todos slice changed, so root object is new

store.dispatch({ type: 'unrelated/action' });
const s2 = store.getState();
console.log(s1 === s2); // true — no slice reducer changed its value, same reference returned
```

## Interview follow-ups this problem invites

- "Why does it matter that `combineReducers` returns the *same* reference when nothing changed?" Because `useSelector`/`connect` (and even manual `subscribe` listeners doing their own diffing) rely on reference equality to decide whether to re-render — if the root reducer always returned a brand-new object regardless, every dispatch would look like a change to every top-level selector, causing unnecessary re-renders app-wide.
- "What happens if two slices need to read *each other's* state to compute an update?" `combineReducers` deliberately doesn't support this — each slice reducer only sees its own previous slice state, not the full tree. Cross-slice logic belongs either in a "listener middleware" / thunk that dispatches follow-up actions, or in a selector that combines multiple slices at read time (see `07-selectors-reselect`), not inside `combineReducers` itself.
