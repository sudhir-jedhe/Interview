# Scenario: A Shopping Cart's Quantity Stepper Re-Renders the Whole Cart

An e-commerce app's cart state is `{ items: [{ productId, product: {...fullProductObject}, quantity }] }`. Clicking the "+" quantity stepper on one line item causes a visible flicker across the entire cart summary — shipping estimate, every other line item's row, and the order total all seem to re-render, even though only one item's quantity changed. There's also a recurring bug where the "recently viewed products" widget and the cart show slightly different product prices for the same product, because both fetched and cached the product data independently at different times.

## Approach:

**1. Separate "product catalog data" from "what's in the cart."** The root problem is embedding a full product object (name, price, images, description) inside each cart line item. Product data is really its own entity — shared between the cart, a product detail page, and the "recently viewed" widget — and should be normalized into its own `products.byId` table, populated once (e.g., via RTK Query's cache) whenever a product is fetched anywhere in the app.

```javascript
// Before: duplicated, can drift out of sync
cart: { items: [{ productId: 'sku1', product: { id: 'sku1', name: '...', price: 19.99 }, quantity: 2 }] }

// After: cart only stores the relationship + quantity; product data lives once
cart: { items: { byId: { sku1: { productId: 'sku1', quantity: 2 } }, allIds: ['sku1'] } }
products: { byId: { sku1: { id: 'sku1', name: '...', price: 19.99 } }, allIds: ['sku1'] }
```

**2. This immediately fixes the price-drift bug.** Since `products.byId.sku1` is the single source of truth for that product's price, both the cart line item and the "recently viewed" widget read the same object — if RTK Query refetches and the price changed, both surfaces update together, because there's only one copy to update.

**3. Fix the re-render storm with a normalized cart plus per-row selectors.** Bumping quantity on `sku1` becomes `cart.items.byId.sku1 = { ...cart.items.byId.sku1, quantity: 3 }` — a single-key patch that leaves every other line item's object reference untouched. Each cart row component should select only its own line item (`selectCartItemById(state, productId)`) joined with its product (`selectProductById(state, productId)`) via a memoized selector, so only the row whose quantity changed re-renders.

**4. Compute the order total in a selector, not in state.** Resist the temptation to store `cart.total` as a field updated by every reducer that touches quantity — that's derived data (covered in depth in `10-patterns-anti-patterns`), and keeping it in a memoized `createSelector` that multiplies `quantity × products.byId[id].price` across `cart.items.allIds` means it's always correct and never needs its own update logic (and can't drift out of sync with the line items, which is exactly the class of bug a hand-maintained "total" field invites).

**5. Verify the fix addresses the actual flicker.** After migrating, use React DevTools' "highlight updates" to confirm only the single quantity-changed row and (if using a memoized total selector) the total re-render, not the whole cart tree — this is the concrete, checkable success criterion for this refactor, not just "it feels faster."

**Result:** one shared product table eliminates price drift by construction, cart line items become independently-updatable normalized entities, and the total becomes a derived, always-correct selector rather than a field someone has to remember to keep in sync.
