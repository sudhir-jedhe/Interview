## After these three dispatches, what does `state.totalPrice` equal — and is it correct?

```javascript
function cartReducer(state = { items: [], totalPrice: 0 }, action) {
  switch (action.type) {
    case 'itemAdded':
      return {
        items: [...state.items, action.payload],
        totalPrice: state.totalPrice + action.payload.price * action.payload.quantity,
      };
    case 'itemRemoved':
      // BUG: forgot to subtract the removed item's contribution from totalPrice
      return {
        items: state.items.filter((i) => i.id !== action.payload.id),
        totalPrice: state.totalPrice,
      };
    default:
      return state;
  }
}

let state = cartReducer(undefined, {});
state = cartReducer(state, { type: 'itemAdded', payload: { id: 1, price: 10, quantity: 2 } }); // +20
state = cartReducer(state, { type: 'itemAdded', payload: { id: 2, price: 5, quantity: 1 } });  // +5
state = cartReducer(state, { type: 'itemRemoved', payload: { id: 1 } }); // should be -20

console.log(state);
```

**Answer:**
```javascript
{ items: [ { id: 2, price: 5, quantity: 1 } ], totalPrice: 25 }
```
`totalPrice` is `25`, but the cart now only contains item 2 (price 5, quantity 1) — the correct total is `5`. The stored `totalPrice` is wrong by exactly the removed item's contribution (20).

**Why:** This is the derived-data anti-pattern in action: `totalPrice` is stored and manually kept in sync by every reducer case, and `itemRemoved` simply forgot to update it — a bug that's completely invisible from reading `itemAdded` in isolation, and one that no type checker or runtime error will catch, because `totalPrice` staying at its old value is a perfectly valid-looking number, just the wrong one. The fix, per `theory/02-derived-data-in-state.md`, is to delete the `totalPrice` field from state entirely and compute it in a memoized selector (`items.reduce(...)`) — at which point this exact bug becomes structurally impossible, because there's no second value to forget to update; the total is recomputed fresh from `items` every time, and `items` itself (the `itemRemoved` filter) is correct.
