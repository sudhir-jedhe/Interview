## What's wrong here, and what breaks as a result?

```javascript
const selectItems = (state) => state.inventory.items;

const selectItemsSortedByPrice = createSelector(
  [selectItems],
  (items) => items.sort((a, b) => a.price - b.price) // looks fine at a glance
);

// somewhere else in the app, an unrelated component does:
const selectItemsInOriginalOrder = (state) => state.inventory.items;

function InventoryPage() {
  const sorted = useSelector(selectItemsSortedByPrice);
  const original = useSelector(selectItemsInOriginalOrder);
  // developer expects `original` to reflect insertion order, e.g. most-recently-added last
  console.log(original.map((i) => i.name));
}
```

**Answer:** `original` — which the developer expects to reflect insertion order — actually comes back **sorted by price**, identical to `sorted`. Worse, this happened as an invisible side effect of merely *rendering* `InventoryPage` (specifically, of `selectItemsSortedByPrice` having been called at least once), with no dispatched action responsible for the reordering — which will look like a Redux state-consistency bug that's very confusing to trace, because nothing in the action log explains it.

**Why:** `Array.prototype.sort` sorts **in place** and also returns the same array reference it was called on — it does not return a new array. `selectItems` returns `state.inventory.items` directly, meaning `items` inside the result function *is* the actual array object living in the Redux store, not a copy. Calling `.sort()` on it mutates the canonical store state directly, silently, entirely bypassing Redux's "reducers are the only thing that changes state" contract — because this mutation doesn't even happen inside a reducer, it happens inside a selector, on component render, which is one of the most surprising places for it to occur. Every other piece of code reading `state.inventory.items` — including `selectItemsInOriginalOrder`, which never touches sorting logic at all — now sees the mutated, sorted order, because there's only ever been one array the whole time.

The fix: copy before sorting, `[...items].sort(...)`, so a *new* array is sorted and returned, leaving the original array (and the store) untouched — exactly the guidance in `../theory/05-selector-best-practices.md`'s "never mutate/sort in place inside a selector" rule. This is a genuinely common real-world bug precisely because `.sort()` "just working" at the call site (the sorted output looks correct) hides the corruption it causes elsewhere.
