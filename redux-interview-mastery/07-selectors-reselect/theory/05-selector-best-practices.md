# Selector Best Practices

A few practical conventions round out everything covered so far in this topic — small decisions that consistently separate a codebase where selectors quietly do their job from one where they become a source of subtle re-render bugs.

## Only memoize when there's something to memoize

Not every selector needs `createSelector`. A selector that just does `(state) => state.user.name` returns a primitive or an existing reference straight from state — there's no new object/array being created, so there's nothing for memoization to protect against. Wrapping every selector in `createSelector` "just in case" adds indirection and a small amount of overhead (checking cached inputs) for zero benefit. Reserve `createSelector` for selectors whose result function **creates a new reference** — `.filter`, `.map`, `.sort`, object/array literals, or any nontrivial computation.

```javascript
// No memoization needed — returns an existing reference, not a new one
const selectUserName = (state) => state.user.name;

// Memoization earns its keep here — .filter allocates a new array every call
const selectActiveUsers = createSelector(
  [(state) => state.users.list],
  (users) => users.filter((u) => u.active)
);
```

## Never mutate/sort in place inside a selector

`[...items].sort(...)` is correct; `items.sort(...)` is not — `Array.prototype.sort` mutates and returns the *same* array, which means it mutates whatever's actually sitting in the Redux store. This is a real, easy-to-miss bug: it looks like it works (the sorted order is correct) but it silently corrupts the store's canonical, supposedly-immutable state, breaking time-travel debugging and potentially causing other code that expected the original order to behave incorrectly.

```javascript
// BUG: mutates the actual array reference living in the Redux store
const selectSortedItems = createSelector(
  [(state) => state.items],
  (items) => items.sort((a, b) => a.price - b.price)
);

// Correct: copy first, then sort the copy
const selectSortedItems = createSelector(
  [(state) => state.items],
  (items) => [...items].sort((a, b) => a.price - b.price)
);
```

## Keep input selectors trivial

Input selectors passed to `createSelector` should just be direct property reads (`(state) => state.cart.items`), not derivations themselves — put actual computation in the *result function*, which is the part `createSelector` knows how to skip when inputs haven't changed. If an "input selector" does real work, that work re-runs on every call regardless of memoization, since `createSelector` only caches the result *function's* output, not each individual input selector's.

## Co-locate and export selectors from the owning slice

As covered in `01-why-selectors.md`, export selectors alongside the slice reducer that owns the underlying state — `cartSlice.js` exports both `cartSlice.reducer` and `selectCartItems`/`selectCartTotal`. This keeps the slice's internal shape genuinely private to that file; nothing outside it should ever write `state.cart.items` directly.

## Don't over-normalize the selector layer to compensate for a bad state shape

If you find yourself writing increasingly convoluted composed selectors just to reassemble data that's scattered awkwardly across state, that's often a signal the underlying state shape itself needs rethinking (see normalization, covered in topic 08) — selectors are for *deriving* views of well-organized data, not for permanently working around a poorly organized store.

## Test selectors directly, without a store

Because a selector is a pure function of `state`, testing it doesn't require rendering components, dispatching actions, or standing up a real store — just construct a plain object matching the relevant shape and assert on the output. This is one of the most underused, highest-value testing techniques in a Redux codebase, and it's exactly why keeping selectors as small, focused, pure functions (rather than logic buried inline in components) pays off.
