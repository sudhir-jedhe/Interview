# Scenario: A large list component makes the whole app feel laggy while typing in an unrelated search box

**Problem:** Your app has a product list rendering 200+ rows, and a completely unrelated header search input. Users report that typing in the search box feels laggy — each keystroke visibly stutters, even though the search box's own state is just local `useState` and shouldn't have anything to do with the product list.

**Approach:**
1. Profile with React DevTools' Profiler while typing — this reveals that the 200-row product list component re-renders on every keystroke, which is surprising since typing in the search box shouldn't touch any Redux state the list depends on.
2. Find the actual cause: the search box's `onChange` handler dispatches a Redux action on every keystroke (`dispatch(searchQueryChanged(value))`) to keep the query in the store (a reasonable choice, since other components also need the current query). The product list component has a `useSelector` selecting a *derived, newly-constructed array* on every render:
   ```jsx
   // Product list — the actual bug
   function ProductList() {
     const visibleProducts = useSelector((state) =>
       state.products.items.filter((p) => p.category === state.ui.selectedCategory)
     );
     return <ul>{visibleProducts.map((p) => <ProductRow key={p.id} product={p} />)}</ul>;
   }
   ```
3. Explain the mechanism precisely: every keystroke dispatches `searchQueryChanged`, which runs the *entire* app's `useSelector` selectors again (Redux doesn't know in advance which components "care" about which slice) — including `ProductList`'s selector, which calls `.filter(...)` and returns a brand-new array every time, regardless of the fact that neither `state.products.items` nor `state.ui.selectedCategory` actually changed. Since the array is a new reference, `useSelector`'s default comparison reports "changed," and React re-renders all 200 `ProductRow` children on every single keystroke.
4. Fix with a memoized selector via `reselect`, so the filtered list only recomputes (and only returns a new reference) when its actual inputs — `state.products.items` or `state.ui.selectedCategory` — change, not on every unrelated dispatch:
   ```jsx
   import { createSelector } from '@reduxjs/toolkit';

   const selectVisibleProducts = createSelector(
     [(state) => state.products.items, (state) => state.ui.selectedCategory],
     (items, category) => items.filter((p) => p.category === category)
   );

   function ProductList() {
     const visibleProducts = useSelector(selectVisibleProducts);
     return <ul>{visibleProducts.map((p) => <ProductRow key={p.id} product={p} />)}</ul>;
   }
   ```
5. Verify the fix by re-profiling: typing in the search box should no longer trigger `ProductList` re-renders at all (since the memoized selector's inputs never change from a search-query dispatch), and the perceived lag disappears.

The broader lesson: a component doesn't need to "know about" what other parts of the app are dispatching to be affected by them — any un-memoized selector returning a new object/array is a latent performance bug waiting for *any* frequent dispatch elsewhere in the app to expose it, which is why unrelated features (search box) can end up affecting unrelated components (product list) that share nothing but the same store.
