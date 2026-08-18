# `useDispatch`

`useDispatch` is the hook counterpart to `useSelector` for the *write* side — it returns the store's `dispatch` function, letting a component trigger action dispatches.

## Basic usage

```jsx
import { useDispatch } from 'react-redux';
import { itemAdded } from './cartSlice';

function AddToCartButton({ product }) {
  const dispatch = useDispatch();
  return (
    <button onClick={() => dispatch(itemAdded(product))}>
      Add to cart
    </button>
  );
}
```

`useDispatch()` returns the *exact same* `dispatch` function reference on every render of a given `<Provider>` tree — it's read once from the store instance via Context and doesn't change, so it's safe to include in a `useCallback`/`useEffect` dependency array without causing extra re-runs.

```jsx
useEffect(() => {
  dispatch(fetchInitialData());
}, [dispatch]); // dispatch is stable — this effect only runs once on mount
```

## `useDispatch` doesn't subscribe to anything

Unlike `useSelector`, `useDispatch` doesn't set up any store subscription and doesn't cause re-renders on state changes — it purely hands you a reference to the dispatch function. A component that only calls `useDispatch()` (no `useSelector`) never re-renders due to Redux state changes at all; it re-renders only for the normal React reasons (its own props/state changing, or its parent re-rendering it).

## Dispatching thunks

If thunk middleware is installed (the default with `configureStore`), `dispatch` accepts functions too — `useDispatch` doesn't need to know or care; it's just handing you the store's real `dispatch`, whatever middleware is or isn't wired up underneath it.

```jsx
function SaveButton({ formData }) {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(saveForm(formData)); // saveForm is a thunk action creator
  };
  return <button onClick={handleClick}>Save</button>;
}
```

## A common typed-Redux convention: a custom `useAppDispatch` hook

In TypeScript codebases, it's standard to wrap `useDispatch` in a project-specific typed hook so every call site gets the correct `AppDispatch` type (including thunk support) without repeating a generic type parameter everywhere:

```typescript
// app/hooks.ts
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
// (or, pre-RTK 2.0: export const useAppDispatch = () => useDispatch<AppDispatch>();)
```

This is purely a TypeScript ergonomics convention — `useAppDispatch()` and `useDispatch()` behave identically at runtime; the wrapper only exists to make the return type more specific than react-redux's generic default.

## `useDispatch` vs the legacy `connect`'s `mapDispatchToProps`

Where `connect(null, mapDispatchToProps)` pre-bound action creators into props (`this.props.addItem(item)` instead of `this.props.dispatch(itemAdded(item))`), `useDispatch` gives you the raw `dispatch` function directly, and you call the action creator yourself at the call site (`dispatch(itemAdded(item))`). This is slightly more verbose per call but removes an indirection layer — there's no separate "props shape" to define, just plain function calls. See `03-connect-hoc-legacy.md` for the full comparison.
