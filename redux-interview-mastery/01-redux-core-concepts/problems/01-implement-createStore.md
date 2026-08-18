# Problem: Implement `createStore` From Scratch

## Task

Implement a minimal version of Redux's `createStore(reducer)` supporting `getState`, `dispatch`, and `subscribe` — no middleware, no enhancers, just the core mechanics. This is one of the most common "show me you understand Redux internals" whiteboard exercises.

## Requirements

- `getState()` returns the current state.
- `dispatch(action)` runs the reducer with `(currentState, action)`, stores the result, then notifies all subscribers. It should throw if `action` isn't a plain object with a `type` property (mirroring real Redux's validation).
- `subscribe(listener)` registers a listener to be called after every dispatch, and returns an `unsubscribe` function.
- On creation, the store should dispatch an internal init action so reducers populate their default state immediately (so `getState()` right after `createStore` reflects reducer defaults, not `undefined`).

## Solution

```javascript
function createStore(reducer) {
  let state;
  let listeners = [];

  function getState() {
    return state;
  }

  function dispatch(action) {
    if (typeof action !== 'object' || action === null || Array.isArray(action)) {
      throw new Error('Actions must be plain objects.');
    }
    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property.');
    }

    state = reducer(state, action);

    // Iterate over a snapshot so that a listener unsubscribing itself (or
    // another listener) mid-notification doesn't skip/duplicate calls.
    const currentListeners = listeners.slice();
    for (const listener of currentListeners) {
      listener();
    }

    return action;
  }

  function subscribe(listener) {
    listeners.push(listener);
    let isSubscribed = true;

    return function unsubscribe() {
      if (!isSubscribed) return;
      isSubscribed = false;
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  // Populate initial state via each reducer's default parameter.
  dispatch({ type: '@@my-redux/INIT' });

  return { getState, dispatch, subscribe };
}

module.exports = { createStore };
```

## Quick verification

```javascript
const { createStore } = require('./01-implement-createStore.js'); // if split into its own file

function counter(state = 0, action) {
  switch (action.type) {
    case 'inc': return state + 1;
    case 'dec': return state - 1;
    default: return state;
  }
}

const store = createStore(counter);
console.log(store.getState()); // 0 — populated by the init dispatch

const unsubscribe = store.subscribe(() => console.log('changed:', store.getState()));
store.dispatch({ type: 'inc' }); // logs "changed: 1"
store.dispatch({ type: 'inc' }); // logs "changed: 2"
unsubscribe();
store.dispatch({ type: 'dec' }); // no log, state is now 1
console.log(store.getState()); // 1
```

## Interview follow-ups this problem invites

- "What happens if `dispatch` is called from inside the reducer?" (Real Redux throws — see `output-based/03-dispatch-inside-reducer.md`. This minimal version doesn't guard against it; a strong candidate should notice and add an `isDispatching` flag as a stretch goal.)
- "Why snapshot `listeners` into `currentListeners` before iterating?" Without it, a listener that calls `unsubscribe()` on itself during notification would mutate the array being iterated, potentially skipping the next listener in line.
