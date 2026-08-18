## Does memoization actually help here?

```javascript
const selectItemsByCategory = createSelector(
  [(state) => state.products, (state, category) => category],
  (products, category) => {
    console.log('filtering for', category);
    return products.filter((p) => p.category === category);
  }
);

function CategorySection({ category }) {
  const items = useSelector((state) => selectItemsByCategory(state, category));
  return <div>{items.length} items in {category}</div>;
}

function ProductPage() {
  return (
    <>
      <CategorySection category="electronics" />
      <CategorySection category="books" />
      <CategorySection category="clothing" />
    </>
  );
}
```

**Answer:** No — despite `selectItemsByCategory` being wrapped in `createSelector`, `'filtering for ...'` logs on **every render of every `<CategorySection>`**, for every category, every time. The memoization provides essentially zero benefit here.

**Why:** `selectItemsByCategory` is a single module-level `const` — one shared selector instance with one shared cache slot, used by all three `<CategorySection>` components. React typically renders `ProductPage`'s children in sequence within the same commit, so the actual call order is roughly: `selectItemsByCategory(state, 'electronics')`, then `selectItemsByCategory(state, 'books')`, then `selectItemsByCategory(state, 'clothing')`, and on the next render, `'electronics'` again. Each call's `category` argument differs from the immediately preceding call's, so the cache — which only remembers the *last* set of inputs — misses on every single call: `'books'` evicts `'electronics'`'s cached result, `'clothing'` evicts `'books'`'s, and the next render's `'electronics'` call evicts `'clothing'`'s. No two consecutive calls ever share the same `category`, so the cache never has a chance to hit.

This is the canonical "shared selector instance across multiple component instances with different arguments defeats memoization" bug described in `../theory/04-parameterized-selectors-and-pitfall.md`. The fix is a selector **factory** — `makeSelectItemsByCategory()` returning a fresh `createSelector` call, instantiated once per `<CategorySection>` via `useMemo(makeSelectItemsByCategory, [])` — so each component owns an independent cache keyed to its own, stable-per-instance `category` value, and repeated re-renders of the *same* component instance (with the same `category` prop) reliably hit that instance's own cache.
