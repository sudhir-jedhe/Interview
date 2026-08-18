# `useSelector`

`useSelector` is how a function component reads data from the Redux store. It's the hook that replaced most uses of the legacy `connect(mapStateToProps)` pattern, and it's also the single most common source of subtle performance bugs in modern Redux + React code.

## Basic usage

```jsx
import { useSelector } from 'react-redux';

function CartBadge() {
  const itemCount = useSelector((state) => state.cart.items.length);
  return <span className="badge">{itemCount}</span>;
}
```

`useSelector` takes a selector function `(state) => selectedValue`, subscribes the component to the store, and re-runs the selector after every dispatch. If the newly computed value differs from the previous render's value, the component re-renders with the new value; if not, React skips the re-render for this component.

## How the "differs" check works: reference equality by default

By default, `useSelector` compares the previous and new selector results using **strict reference equality** (`===`), the same as `Object.is`. This is fast (`O(1)`, no deep traversal) but means the selector's *return value's identity* matters, not just its logical content.

```jsx
// Fine: primitives compare by value, so this only "changes" when the count actually changes
const count = useSelector((state) => state.cart.items.length);

// PROBLEM: returns a brand-new array every single render, regardless of
// whether the underlying data actually changed
const items = useSelector((state) => state.cart.items.map((i) => i.name));
```

## The referential-equality gotcha, explained

If a selector returns a **newly constructed object or array** (via `.map`, `.filter`, a spread, an object literal `{...}`), that return value is a *new reference* every time the selector runs — even if its contents are identical to last time. Since `useSelector`'s default comparison is `===`, a new reference always looks "different," so the component re-renders on **every single dispatch anywhere in the app**, not just dispatches relevant to this data. This is one of the most common real-world Redux performance bugs, and it's silent — nothing errors, the component just re-renders far more than it needs to.

```jsx
// BAD: derives a new array every render → component re-renders on every dispatch
function ExpensiveList() {
  const activeItemNames = useSelector((state) =>
    state.cart.items.filter((i) => i.active).map((i) => i.name)
  );
  return <ul>{activeItemNames.map((name) => <li key={name}>{name}</li>)}</ul>;
}
```

## Fixing it: three standard approaches

1. **Select primitives / already-stable references** where possible — select the raw array (`state.cart.items`) and do filtering/mapping in the component body or via `useMemo`, rather than inside the selector.
2. **Pass a custom equality function** as `useSelector`'s second argument — commonly `shallowEqual` from `react-redux`, which compares one level deep instead of by reference:
   ```jsx
   import { useSelector, shallowEqual } from 'react-redux';
   const activeItemNames = useSelector(
     (state) => state.cart.items.filter((i) => i.active).map((i) => i.name),
     shallowEqual
   );
   ```
3. **Use a memoized selector** (via `reselect`'s `createSelector`), which caches its result and only recomputes (returning a new reference) when its actual input dependencies change — covered in depth in `07-selectors-reselect`.

## `useSelector` and multiple `useSelector` calls per component

It's idiomatic — and often better for performance — to call `useSelector` multiple times for multiple independent pieces of state, rather than one call selecting a large object:

```jsx
// Preferred: narrow, independent selections
const name = useSelector((state) => state.user.name);
const itemCount = useSelector((state) => state.cart.items.length);

// Less ideal: one selection of a combined object — re-renders if EITHER changes,
// and (worse) constructs a new object every render unless memoized
const { name, itemCount } = useSelector((state) => ({
  name: state.user.name,
  itemCount: state.cart.items.length,
}));
```

This "narrow selectors" principle is expanded on in `05-avoiding-unnecessary-rerenders.md`.
