## What happens when you both mutate the draft and return a value?

```javascript
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'thing',
  initialState: { count: 0, label: 'a' },
  reducers: {
    weird: (state, action) => {
      state.count += 1; // mutate the draft
      return { count: 100, label: 'z' }; // ALSO return a new state object
    },
  },
});

const result = slice.reducer({ count: 0, label: 'a' }, slice.actions.weird());
console.log(result);
```

**Answer:** `{ count: 100, label: 'z' }` — the mutation of `state.count` to `1` is silently discarded.

**Why:** Immer's `produce` follows one rule: if the recipe function (your reducer) returns any value other than `undefined`, that returned value **replaces** the draft entirely — the tracked mutations are thrown away, no error, no warning. Immer only uses the draft's recorded mutations when the reducer returns `undefined` (i.e., no explicit `return`, or `return;`).

This is a genuinely common bug in slices that mix styles, e.g. a reducer that does some `state.x = y` mutations for the common path and then has an early-return branch like `if (invalid) return initialState;` for a reset path. Both patterns are individually valid — mutate-only, or return-only — but combining them in the *same* reducer call means the return silently wins and any mutations before it vanish. The fix is to pick one style per reducer: either mutate the draft and don't return anything, or don't touch `state` at all and return a fresh value.
