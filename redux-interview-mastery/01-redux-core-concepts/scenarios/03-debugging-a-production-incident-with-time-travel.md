# Scenario: Reproducing a rare production bug report

**Problem:** Support escalates a bug: "Sometimes, after applying a discount code and then removing an item from the cart, the total shown is wrong — but only sometimes, and we can't reproduce it locally." You have no stack trace, just a fuzzy user report and a session ID.

**Approach:**
1. Because the app dispatches every state change through Redux, and you already log every dispatched action (type + payload + timestamp) to your analytics/logging pipeline keyed by session ID, you can pull the exact ordered sequence of actions for that user's session: `cart/itemAdded`, `discount/codeApplied`, `cart/itemAdded`, `cart/itemRemoved`, ...
2. Replay that exact action sequence against the app's initial state in a local Redux store (or paste it into Redux DevTools' "import state" / action replay feature) — because reducers are pure functions, the same sequence of actions against the same initial state deterministically reproduces the same final state, regardless of timing, network conditions, or which machine runs it.
3. Step through the replay one action at a time in DevTools, inspecting the state diff after each dispatch, until you find the exact action where the total goes wrong — in this case, discovering that `discount/codeApplied` stores an absolute discount amount rather than a percentage, and `cart/itemRemoved` recomputes the total from item prices without re-validating that the flat discount still makes sense once the cart's subtotal has shrunk.

```javascript
// Debugging harness: replay a captured action log against a fresh store
import { createStore } from 'redux';
import rootReducer from './rootReducer';

const capturedActions = [
  { type: 'cart/itemAdded', payload: { id: 1, price: 20 } },
  { type: 'discount/codeApplied', payload: { code: 'SAVE10', amount: 10 } },
  { type: 'cart/itemAdded', payload: { id: 2, price: 15 } },
  { type: 'cart/itemRemoved', payload: 1 },
];

const store = createStore(rootReducer);
for (const action of capturedActions) {
  store.dispatch(action);
  console.log(action.type, '->', store.getState().cart);
}
```

This is the concrete payoff of "changes are made with pure functions" and a single, inspectable action log: a bug that was unreproducible by trying to click around the UI becomes trivially reproducible by replaying the exact recorded action sequence, because Redux guarantees that sequence + initial state fully determines the outcome.
