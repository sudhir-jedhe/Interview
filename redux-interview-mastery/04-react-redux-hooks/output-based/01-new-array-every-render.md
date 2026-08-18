# Output: How many times does this component render after 5 unrelated dispatches?

```jsx
function ActiveItems() {
  const activeItems = useSelector((state) =>
    state.cart.items.filter((item) => item.active)
  );
  console.log('render');
  return <span>{activeItems.length}</span>;
}

// Elsewhere, 5 dispatches happen, none touching state.cart at all:
dispatch({ type: 'ui/themeToggled' });
dispatch({ type: 'user/nameChanged', payload: 'Ada' });
dispatch({ type: 'notifications/cleared' });
dispatch({ type: 'ui/sidebarToggled' });
dispatch({ type: 'user/nameChanged', payload: 'Grace' });
```

**Answer:** `'render'` logs 5 additional times (once per dispatch) — 6 total including the initial mount — even though none of those actions touch `state.cart`.

**Why:** `.filter(...)` constructs a brand-new array every time the selector runs, regardless of whether `state.cart.items` actually changed. `useSelector`'s default comparison is `===` (reference equality); a freshly constructed array is never `===` to the previous render's freshly constructed array, even when both contain logically identical elements. Since `useSelector` re-runs the selector after *every* dispatch (not just ones relevant to this data), and the result is always "different" by this selector's construction, the component re-renders on every single dispatch in the entire app — a correctness-neutral but potentially serious performance bug at scale, and the textbook version of the referential-equality gotcha.
