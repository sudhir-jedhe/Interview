# The Three Principles of Redux

Redux is built on three principles that, once internalized, explain almost every design decision in the library. Interviewers use them as a quick calibration check — if you can explain *why* each principle exists, not just recite it, you signal real experience rather than memorized docs.

## 1. Single source of truth

The entire state of your application lives in one object tree, held inside a single store. This doesn't mean you can't organize state into logical slices (`user`, `cart`, `ui`, etc.) — it means there is exactly one store, and every slice lives under that one root object, not scattered across component instances or multiple stores.

The practical payoff: any part of the app — a component, a piece of middleware, a server-rendering routine — can read the full application state from one place. Debugging tools like Redux DevTools can serialize the entire state at any point in time because there's only one tree to serialize.

```javascript
// The whole app's state is one object, e.g.:
const state = {
  user: { id: 1, name: 'Ada' },
  cart: { items: [], total: 0 },
  ui: { theme: 'dark' },
};
```

## 2. State is read-only

The only way to change state is to dispatch an action — a plain object describing *what happened*, not *how the state should change*. Components, event handlers, and network callbacks never mutate state directly; they emit an intention.

```javascript
// Not allowed: state.cart.items.push(newItem)
// Instead:
store.dispatch({ type: 'cart/itemAdded', payload: newItem });
```

This constraint is what makes state changes traceable. Every mutation in your app's history corresponds to exactly one dispatched action, which means you can log, replay, or time-travel through them. If mutations could happen anywhere (a random `onClick` mutating a shared object), there'd be no single choke point to intercept, log, or undo.

## 3. Changes are made with pure functions

To specify how the state tree is transformed by actions, you write pure reducers: `(state, action) => newState`. A reducer must not mutate its arguments, must not perform side effects (network calls, `Date.now()`, `Math.random()`), and must return the same output for the same input every time.

```javascript
function cartReducer(state = initialState, action) {
  switch (action.type) {
    case 'cart/itemAdded':
      return { ...state, items: [...state.items, action.payload] };
    default:
      return state;
  }
}
```

Purity is what enables time-travel debugging: since a reducer is deterministic, replaying the same sequence of actions against the same initial state always reproduces the same final state, regardless of when or how many times you run it.

## Why interviewers probe this

A common follow-up is: "What breaks if you violate principle 2 or 3?" The honest answer is that nothing throws at runtime in plain Redux — React-Redux's `useSelector`/`connect` rely on **reference equality** to decide whether to re-render. If you mutate state in place, the reference doesn't change, so subscribed components silently fail to re-render, and time-travel/DevTools replay produces incorrect results because the "before" and "after" snapshots are the same object. This is one of the most common real-world Redux bugs, and it's covered in depth in `02-actions-reducers`.
