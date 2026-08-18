## How many times does "computing..." log?

```javascript
import { createSelector } from '@reduxjs/toolkit';

const selectItems = (state) => state.items;

const selectSorted = createSelector([selectItems], (items) => {
  console.log('computing...');
  return [...items].sort((a, b) => a - b);
});

const stateA = { items: [3, 1, 2] };
const stateB = { items: [3, 1, 2] }; // different object, but items is the SAME array reference

selectSorted(stateA);
selectSorted(stateA); // same state object
selectSorted(stateB); // different state object, but same items array reference
selectSorted({ items: [...stateA.items] }); // a NEW array with the same contents
```

**Answer:** `computing...` logs exactly **two** times — once for the first call, and once for the fourth call. The second and third calls are cache hits and don't log at all.

**Why:** `createSelector`'s default cache holds one entry, keyed by reference-equality of each *input selector's* output — not the outer `state` object. `selectItems(stateA)` and `selectItems(stateA)` obviously return the same reference (call 1 → compute, call 2 → cache hit). `selectItems(stateB)` also returns the *same* array reference as before, because `stateB.items` was deliberately set to `stateA.items` (the same array), even though `stateB` itself is a different object — `createSelector` doesn't care that the outer `state` object differs, only that `selectItems`'s *output* is unchanged (call 3 → cache hit). The fourth call passes a brand-new array (`[...stateA.items]`) with identical contents but a different reference — `===` fails, so the cache misses and the result function runs again (call 4 → compute). This is the crux of memoization pitfalls: `createSelector` compares by reference, not by deep value equality, so "same data, new array instance" (a very common outcome of spreading, `.map`, `.filter`, or a fresh API response with identical values) always counts as a change.
