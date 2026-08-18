# Interview Q&A: Selector Fundamentals

**Q1: What is a selector, and why bother writing named selector functions instead of inline `state.x.y` access?**

A: A selector is just a function `(state) => derivedValue`. Writing them as named, exported functions decouples components from the exact shape of the store — if the underlying state shape changes (renamed field, normalized structure, moved slice), only the selector's implementation needs updating, not every component that reads that data. It also centralizes derivation logic (so multiple components computing "the same thing" can't drift out of sync), makes the logic independently unit-testable without rendering anything or dispatching actions, and gives you a natural place to add memoization later without touching component code.

**Q2: Where should selectors live in an RTK-based codebase, and why?**

A: Co-located with and exported from the slice file that owns the underlying state — e.g. `cartSlice.js` exports both `cartSlice.reducer` and `selectCartItems`/`selectCartTotal`. This keeps a slice's internal state shape effectively private to that file; nothing outside it should read `state.cart.items` directly, only via the exported selector, which is what actually makes future refactors of that slice's internal shape safe.

**Q3: Is every selector automatically memoized just by being a separate function?**

A: No — a plain function like `(state) => state.cart.items` isn't memoized in any special sense; it's just a direct property read, and there's nothing to memoize since it doesn't create a new value. Memoization is a distinct concern, provided by wrapping a selector in `reselect`'s `createSelector` (bundled with and re-exported from `@reduxjs/toolkit`) — and it specifically matters when a selector's derivation creates a new object/array/computed value (filtering, mapping, sorting, aggregating) that would otherwise be a fresh reference on every call.

**Q4: How do you unit test a selector, and what does that highlight about the value of using selectors in the first place?**

A: Construct a plain JavaScript object shaped like the relevant slice of state and call the selector directly — no store, no dispatch, no component rendering needed: `expect(selectCartTotal({ cart: { items: [{ price: 10, quantity: 2 }] } })).toBe(20)`. This is possible precisely because a selector is a pure function of `state`, which is the same property that makes selectors composable and reusable — it's the same underlying design quality (purity) showing up as a testing benefit, a decoupling benefit, and a composability benefit simultaneously.
