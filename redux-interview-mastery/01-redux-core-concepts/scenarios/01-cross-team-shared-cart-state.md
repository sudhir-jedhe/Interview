# Scenario: Cart badge, mini-cart, and checkout page all drift out of sync

**Problem:** Your e-commerce app has a cart icon with an item-count badge in the header, a "mini-cart" dropdown, and a full checkout page — three components in completely different parts of the tree. Each was originally built independently, holding its own local `useState` for cart items, and syncing them via a mix of prop drilling and a homegrown event emitter. Product managers keep filing bugs: "I added an item, the header badge didn't update," or "the mini-cart shows different items than checkout."

**Approach:**
1. Identify that cart data is a textbook case for centralized state per `04-when-to-use-redux.md`: it's needed by multiple, distant components, has shared update logic (add/remove/update quantity must behave identically regardless of which UI triggered it), and bugs from it are exactly the "state is out of sync somewhere" class that a single source of truth eliminates by construction.
2. Introduce a single `cart` slice as the one source of truth for cart data, and delete the local `useState` copies and the event emitter entirely — every add/remove goes through `dispatch`.
3. Each component reads from the same store via `useSelector`, so there is no possibility of the badge, mini-cart, and checkout page disagreeing — they're all deriving from the same object at the same instant.

```javascript
// features/cart/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    itemAdded(state, action) {
      state.items.push(action.payload);
    },
    itemRemoved(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
  },
});
export const { itemAdded, itemRemoved } = cartSlice.actions;
export default cartSlice.reducer;

// Header.jsx
function CartBadge() {
  const count = useSelector((state) => state.cart.items.length);
  return <span className="badge">{count}</span>;
}

// MiniCart.jsx / CheckoutPage.jsx both read state.cart.items the same way —
// there is structurally no way for them to disagree, because there's only
// one array in memory, not three separate copies.
```

The fix isn't "use Redux because it's popular" — it's that centralizing the single piece of state that multiple distant components share removes the entire class of "components disagree about the same logical data" bugs by making disagreement structurally impossible.
