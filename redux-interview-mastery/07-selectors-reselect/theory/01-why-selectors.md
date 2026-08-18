# Selector Functions: Decoupling Components from State Shape

A selector is nothing more than a function that takes the Redux store's `state` and returns some derived piece of it: `const selectCartTotal = (state) => state.cart.total`. That's the entire concept at its simplest — but treating "reading from the store" as a first-class, named function rather than inline property access at every call site is one of the highest-leverage conventions in a Redux codebase, for reasons that go well beyond typing less.

```javascript
// Without selectors: every component reaches directly into state's exact shape
function CartSummary() {
  const total = useSelector((state) => state.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0));
  // ...
}

// With selectors: the shape and the derivation logic live in one place
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);

function CartSummary() {
  const total = useSelector(selectCartTotal);
  // ...
}
```

## Why this matters

**1. Decoupling from state shape.** If `state.cart.items` is later renamed, moved into a normalized `state.cart.itemIds` + `state.entities.cartItems` structure, or the total switches from being computed on the fly to being stored directly, only `selectCartTotal`'s implementation needs to change — every component calling `useSelector(selectCartTotal)` is unaffected. Without selectors, that refactor means hunting down every inline `state.cart.items...` expression scattered across the component tree.

**2. Encapsulating derived data.** Some values genuinely shouldn't be stored — a cart total, a filtered/sorted list, a "logged in" boolean derived from `state.auth.token !== null` — these are computed from other state, and storing them separately risks them going out of sync with their source. A selector computes them fresh, on demand, from the single source of truth.

**3. Reusability and testability.** A selector is a pure function of `state` — it's trivially unit-testable in isolation (`expect(selectCartTotal({ cart: { items: [...] } })).toBe(42)`) without rendering a component or dispatching any actions, and the same selector can be reused across multiple components that need the same derived value, guaranteeing they agree.

**4. A natural home for memoization.** Because a selector is just a function, it's the natural place to apply memoization when a derivation is expensive (filtering/sorting a large list) or when returning a stable reference matters for avoiding unnecessary re-renders — which is exactly what `reselect`'s `createSelector` is for, covered in the next file.

## Convention: co-locate selectors with their slice

The idiomatic RTK convention is to export selectors from the same file as the slice they read from:

```javascript
// cartSlice.js
const cartSlice = createSlice({ name: 'cart', /* ... */ });

export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) => state.cart.items.length;

export default cartSlice.reducer;
```

This keeps "what does `state.cart` look like" and "how do you read from it" defined in exactly one place, which is precisely the decoupling this file opened with — components never need to know the slice's internal shape, only which selector to call. `useSelector(selectCartItemCount)` reads exactly the same regardless of whether `cart.items` is an array, a normalized map, or anything else the slice's author later chooses.
