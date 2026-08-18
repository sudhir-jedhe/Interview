# Avoiding Unnecessary Re-renders with `useSelector`

This is the practical, performance-focused counterpart to `01-useSelector.md`'s explanation of *why* the referential-equality gotcha happens. Here, the focus is concrete techniques for keeping Redux-connected components fast as an app scales.

## Principle 1: select narrowly, not broadly

Selecting a large slice (or the whole state) and destructuring in the component body means the component re-renders whenever *anything* inside that slice changes, even fields the component doesn't render.

```jsx
// BAD: re-renders on ANY change to state.cart, even fields this component ignores
function ItemCount() {
  const cart = useSelector((state) => state.cart);
  return <span>{cart.items.length}</span>;
}

// GOOD: re-renders only when items.length itself changes
function ItemCount() {
  const itemCount = useSelector((state) => state.cart.items.length);
  return <span>{itemCount}</span>;
}
```

## Principle 2: multiple narrow `useSelector` calls beat one broad object selector

```jsx
// BAD: constructs a new object every render → always "changes" by reference
function UserSummary() {
  const { name, email } = useSelector((state) => ({
    name: state.user.name,
    email: state.user.email,
  }));
  return <div>{name} — {email}</div>;
}

// GOOD: two independent, primitive selections
function UserSummary() {
  const name = useSelector((state) => state.user.name);
  const email = useSelector((state) => state.user.email);
  return <div>{name} — {email}</div>;
}
```

Each `useSelector` call is independently compared; splitting them means a change to `email` alone doesn't force a re-render check to also worry about `name` changing (though both were "unnecessary" only in the object-construction sense — the real win is avoiding the *new object every render* problem, not the number of hooks).

## Principle 3: use `shallowEqual` (or a custom comparator) when an object/array return is unavoidable

Sometimes a selector legitimately needs to return an object or array (e.g., a list of derived items for rendering a `<ul>`). Pass `shallowEqual` as the second argument so `useSelector` compares one level deep instead of by reference:

```jsx
import { useSelector, shallowEqual } from 'react-redux';

const activeItems = useSelector(
  (state) => state.cart.items.filter((i) => i.active),
  shallowEqual
);
```

This still recomputes the filter on every dispatch (the selector function itself isn't memoized), but `useSelector` will skip the re-render if the *resulting array's contents* are shallowly equal to last time, even though the array reference itself is new.

## Principle 4: memoized selectors (`reselect`) for expensive derivations

For genuinely expensive computations (sorting, grouping, aggregating large lists), even `shallowEqual`'s per-render recomputation is wasteful. `reselect`'s `createSelector` memoizes based on its *input* selectors — it only recomputes when at least one input actually changed (by reference), and returns the exact same cached output reference otherwise:

```jsx
import { createSelector } from 'reselect';

const selectActiveItems = createSelector(
  (state) => state.cart.items,
  (items) => items.filter((i) => i.active) // only re-runs when state.cart.items itself changes
);

// in the component:
const activeItems = useSelector(selectActiveItems);
```

This is covered in full depth in `07-selectors-reselect`; the key point here is that `useSelector` + a memoized selector together solve both problems: the selector avoids redundant computation, and `useSelector` avoids redundant re-renders, because the memoized selector returns a *stable reference* when its inputs haven't changed.

## Principle 5: don't over-optimize prematurely

Splitting every possible selector into the narrowest conceivable form has a real cost too — more hooks per component, more subscriptions for `react-redux` to manage, more surface area to review. For state that changes rarely, or components that are cheap to re-render regardless, the broad-selector pattern is often fine. Treat this as a toolbox to reach for when profiling (React DevTools' Profiler, or user-visible jank) actually shows a re-render problem — not a checklist to apply blindly to every `useSelector` call in the codebase.
