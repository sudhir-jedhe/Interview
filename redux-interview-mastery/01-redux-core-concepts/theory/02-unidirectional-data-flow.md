# Unidirectional Data Flow

Redux enforces a strict, one-way cycle for how data moves through an application. Understanding this loop cold is table stakes for any Redux interview — you should be able to draw it on a whiteboard without hesitating.

## The cycle

```
View (component) --dispatch(action)--> Store
Store --calls--> Reducer(state, action) --returns--> newState
Store --replaces state, notifies subscribers--> View re-renders
```

Concretely, for an "add to cart" click:

1. **Action**: the user clicks "Add to cart". The event handler calls `dispatch({ type: 'cart/itemAdded', payload: { id: 42, qty: 1 } })`.
2. **Reducer**: the store invokes the root reducer with `(currentState, action)`. The root reducer delegates to the `cart` slice reducer (via `combineReducers`), which computes a new `cart` object without mutating the old one.
3. **New state**: the store swaps its internal reference to the new state tree returned by the root reducer. This is the *only* place `state` changes.
4. **View**: components subscribed via `useSelector` (or legacy `connect`) compare the new selected value against the previous one. If the value is different (by reference, or by a custom equality function), React re-renders that component with the fresh data.

```javascript
// 1. Action creator
const addToCart = (item) => ({ type: 'cart/itemAdded', payload: item });

// 2. Reducer
function cartReducer(state = { items: [] }, action) {
  switch (action.type) {
    case 'cart/itemAdded':
      return { ...state, items: [...state.items, action.payload] };
    default:
      return state;
  }
}

// 3 & 4. Dispatch triggers store update -> subscribed components re-render
dispatch(addToCart({ id: 42, qty: 1 }));
```

## Why one direction, not two

Two-way data binding (common in older MVC/Angular-style frameworks) lets a view mutate a model directly, and the model can also push changes back — data flows in a loop with no fixed order. That's convenient for small forms but becomes unpredictable at scale: when *anything* can change *anything*, tracing "why did this value change" requires inspecting every binding in the app.

Redux's unidirectional flow means there is exactly one path a change can take: dispatch → reducer → new state → subscriber notification. Given any bug of the form "this value is wrong," you can always answer it by asking "what action caused this, and what did the reducer do with it" — because those are the only two places state can change.

## The loop never skips steps

A trap interviewers set: "Can a component read state and immediately write to it without going through the store?" No — even inside a `useSelector` callback or a thunk, you never mutate the selected state object. You always dispatch a new action, even if that action is computed from the current state (e.g., `dispatch(increment(currentValue + 1))`). The flow is a one-way loop, not a shortcut graph.

## Where async fits in

Plain Redux's `dispatch` only accepts plain objects. Async work (API calls) happens *before* the action reaches the reducer — typically via middleware like Redux Thunk, which lets an action creator return a function instead of an object. The function runs some async logic and then dispatches a plain action (or several: `pending`/`fulfilled`/`rejected`) when it's done. The core loop — action in, reducer computes, view re-renders — is unchanged; middleware only extends what can happen *before* a plain action reaches the reducer. This is covered fully in `03-store-middleware`.
