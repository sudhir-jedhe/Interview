# Anti-Patterns: Mutating State Directly, and Storing Non-Serializable Data

These two anti-patterns are grouped together because they're both violations of Redux's second principle — "state is read-only" — just in different ways: one mutates data that should be replaced, the other stores data that was never safe to put in a serializable tree in the first place.

## Mutating state directly in a classic reducer

Outside of `createSlice`/`createReducer` (which wrap your reducer body in Immer), a plain reducer must return a new object/array rather than mutating its input.

```javascript
// BEFORE: mutates the array in place — a genuine bug in a plain (non-Immer) reducer
function todosReducer(state = [], action) {
  switch (action.type) {
    case 'todos/completed':
      const todo = state.find((t) => t.id === action.payload.id);
      todo.completed = true; // mutates an object still referenced by the OLD state too
      return state; // same reference returned — useSelector won't detect a change
    default:
      return state;
  }
}

// AFTER: immutable update
function todosReducer(state = [], action) {
  switch (action.type) {
    case 'todos/completed':
      return state.map((todo) =>
        todo.id === action.payload.id ? { ...todo, completed: true } : todo
      );
    default:
      return state;
  }
}
```

The "before" version is dangerous for two independent reasons: `state === nextState` in this dispatch, so `useSelector`-driven components subscribed to the whole array won't re-render even though the data changed underneath them; and because the mutated `todo` object is the *same reference* the previous state snapshot also points to, Redux DevTools' "jump to previous state" now shows the *already-mutated* data for supposedly-earlier points in history, corrupting time-travel debugging retroactively. The fix — returning a new array via `.map()`, replacing only the changed item with a new object — is the standard immutable-update pattern covered in depth in `02-actions-reducers`.

## Storing non-serializable data in state

Redux (and RTK's dev-mode `serializableCheck` middleware, on by default) assumes state and actions are plain, JSON-serializable data: primitives, plain objects, plain arrays. Storing a `Date`, a class instance, a `Promise`, or a function violates that assumption.

```javascript
// BEFORE: non-serializable values in state
const state = {
  createdAt: new Date(),        // Date object — not plain JSON
  onComplete: () => {...},       // function — cannot be serialized at all
  pendingRequest: fetch('/api'), // Promise — represents in-flight async work, not data
};

// AFTER: serializable equivalents
const state = {
  createdAt: Date.now(),         // epoch milliseconds — a plain number
  // onComplete: don't store callbacks in state; dispatch an action when the "complete"
  // event happens instead, and let a component/thunk decide what to do
  requestStatus: 'pending',      // a plain string describing status, not the Promise itself
};
```

Why this actually matters, beyond "RTK warns about it": DevTools serializes state to display and persist it for time-travel; a function or `Promise` can't be meaningfully serialized, so DevTools either crashes, silently drops the value, or shows `[object Object]`/similar — breaking the very debugging tooling that's one of Redux's core selling points. A `Date` object is subtler: it's technically JSON-serializable via `.toJSON()`, but two different `Date` instances representing the same instant are never `===` equal and don't compare correctly with simple equality checks the way a millisecond number does, causing spurious "changed" detections in selectors and re-render logic. The fix is almost always the same shape: store primitives (timestamps as numbers, statuses as strings/enums) and keep the actual non-serializable objects (a `Promise`, a callback) transient — in a component, a ref, or middleware — never inside the state tree itself.

See `10-patterns-anti-patterns/output-based` for a worked example of finding and fixing exactly this bug in a real reducer.
