## Does `expensiveTotalAtom`'s compute function run when `unrelatedAtom` changes?

```javascript
import { atom } from 'jotai';

const itemsAtom = atom([{ price: 10 }, { price: 20 }]);
const unrelatedAtom = atom('some string, unrelated to items');

let computeCount = 0;
const expensiveTotalAtom = atom((get) => {
  computeCount += 1;
  return get(itemsAtom).reduce((sum, i) => sum + i.price, 0);
});

// In a store instance: read expensiveTotalAtom once, then update unrelatedAtom, then read again.
```

**Answer:** No — `computeCount` does not increase when only `unrelatedAtom` changes. The derived atom's compute function only re-runs when an atom it actually called `get()` on (here, `itemsAtom`) changes.

**Why:** Jotai tracks each derived atom's dependencies *dynamically*, based on which atoms are actually read (via `get()`) during that atom's most recent computation — not based on any manually-declared dependency list. Since `expensiveTotalAtom`'s function never calls `get(unrelatedAtom)`, Jotai's dependency graph has no edge between them, so a change to `unrelatedAtom` simply doesn't trigger recomputation. This is the atomic model's core selling point versus a naive single-tree approach: you don't need `reselect`-style manual memoization with explicit input selectors — the "only recompute when actual dependencies change" behavior is structural, not something you opt into per selector. The trade-off, worth naming in an interview: this automatic tracking is powerful but implicit — a `useSelector`/`reselect` setup makes its dependencies explicit and visible in code (the array of input selectors), which some teams prefer for auditability even though it requires manually keeping that list correct.
