# Anti-Patterns: Overly Nested State, and Too Many Fine-Grained Actions

## Overly nested state shape

Covered in full depth in `08-normalizing-state`, but worth restating here as one entry in the broader anti-pattern list, because it's frequently the *first* anti-pattern that leads teams to notice they need this whole topic: deeply nested state (a post embedding its comments embedding their authors) causes duplicate data, fragile multi-level immutable updates, and unnecessary re-renders when unrelated nested data changes a shared ancestor's reference.

```javascript
// Anti-pattern: nested, denormalized
const state = { posts: [{ id: 'p1', comments: [{ id: 'c1', author: { id: 'u1', name: 'Ada' } }] }] };

// Fix: flat, normalized, referenced by ID — see 08-normalizing-state for the full pattern
const state = {
  posts: { byId: { p1: { id: 'p1', commentIds: ['c1'] } }, allIds: ['p1'] },
  comments: { byId: { c1: { id: 'c1', authorId: 'u1' } }, allIds: ['c1'] },
  authors: { byId: { u1: { id: 'u1', name: 'Ada' } }, allIds: ['u1'] },
};
```

The short version, cross-referenced here so this topic's anti-pattern list is complete: flatten relational collections into `byId`/`allIds` tables referencing each other by ID, and reach for `createEntityAdapter` to get the CRUD reducers and selectors generated rather than hand-written.

## Dispatching too many fine-grained actions for one logical operation

A different anti-pattern: modeling a single logical user operation as a sequence of separately-dispatched, narrowly-scoped actions, when one well-designed action (carrying all the relevant data) would be clearer, more atomic, and easier to reason about.

```javascript
// BEFORE: one logical operation ("submit the checkout form") fragmented into 4 dispatches
dispatch(setShippingAddress(address));
dispatch(setBillingAddress(billingAddress));
dispatch(setPaymentMethod(paymentMethod));
dispatch(setCheckoutStatus('submitted'));
// Four separate reducer runs, four separate re-render cycles (unless batched),
// and a DevTools action log that shows 4 unrelated-looking entries for what
// was, conceptually, one user action: "submitted checkout."
```

```javascript
// AFTER: one action, one atomic state transition, one clear entry in the action log
dispatch(checkoutSubmitted({ shippingAddress: address, billingAddress, paymentMethod }));

// Reducer:
checkoutSubmitted(state, action) {
  state.shippingAddress = action.payload.shippingAddress;
  state.billingAddress = action.payload.billingAddress;
  state.paymentMethod = action.payload.paymentMethod;
  state.status = 'submitted';
}
```

Beyond the reduced re-render churn (React 18's automatic batching makes the raw re-render count less of a concern than it used to be, but it's still four separate state transitions in the action log instead of one), the deeper problem with the fragmented version is *intermediate inconsistent states*: between the first and fourth dispatch, if any code reads state (a `useEffect`, a `useSelector` somewhere), it can observe a "half-submitted" checkout — shipping set, billing not yet set — that never should have been a valid, observable state in the first place. Combining related field updates that represent one logical event into a single action eliminates that window entirely, since a reducer handling one action always transitions state atomically from one fully-valid shape to the next.

The judgment call is knowing where the line is: not every multi-field update needs collapsing into one action (typing in two independent, unrelated form fields is fine as two dispatches) — the signal to consolidate is when the fields conceptually represent *one event* and observing them out of sync would be meaningless or incorrect.
