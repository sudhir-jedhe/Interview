# Output: Two separate `useSelector` calls vs one combined object selector

```jsx
// Version A: two separate calls
function StatsA() {
  const count = useSelector((state) => state.cart.items.length);
  const total = useSelector((state) => state.cart.total);
  console.log('A render');
  return <span>{count} items, ${total}</span>;
}

// Version B: one combined object selector
function StatsB() {
  const { count, total } = useSelector((state) => ({
    count: state.cart.items.length,
    total: state.cart.total,
  }));
  console.log('B render');
  return <span>{count} items, ${total}</span>;
}

// A single dispatch happens that changes state.user.name, touching
// neither state.cart.items nor state.cart.total.
dispatch({ type: 'user/nameChanged', payload: 'Ada' });
```

**Answer:** `'A render'` does **not** log again (both of `StatsA`'s selectors return unchanged primitive values). `'B render'` **does** log again, with the same displayed content as before.

**Why:** `StatsA`'s two `useSelector` calls each return a primitive (`number`), compared by value — since neither `state.cart.items.length` nor `state.cart.total` changed, both comparisons report "unchanged," and React skips re-rendering `StatsA` entirely. `StatsB`'s single selector constructs a brand-new object literal `{ count, total }` on every single call, regardless of whether the underlying values changed — a fresh object is never `===` the previous one, so `useSelector`'s default reference-equality check always reports "changed," forcing a re-render on every dispatch app-wide, even ones (like this one) that are completely irrelevant to cart data. This is the concrete, worked-out version of the "narrow selectors" principle from `theory/05-avoiding-unnecessary-rerenders.md` — the fix for `StatsB` is either splitting into separate `useSelector` calls (matching `StatsA`), or passing `shallowEqual` as the second argument.
