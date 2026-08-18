## What does `state.ids` equal after this runs?

```javascript
import { createEntityAdapter } from '@reduxjs/toolkit';

const adapter = createEntityAdapter({
  sortComparer: (a, b) => a.priority - b.priority,
});

let state = adapter.getInitialState();
state = adapter.setAll(state, [
  { id: 'x', priority: 3 },
  { id: 'y', priority: 1 },
  { id: 'z', priority: 2 },
]);

console.log('after setAll:', state.ids);

state = adapter.updateOne(state, { id: 'x', changes: { priority: 0 } });

console.log('after updateOne:', state.ids);
```

**Answer:**
```
after setAll: [ 'y', 'z', 'x' ]
after updateOne: [ 'x', 'y', 'z' ]
```

**Why:** When a `sortComparer` is configured, the adapter doesn't just store `ids` in insertion order — it re-sorts `ids` after *every* mutating operation, including `updateOne`. Editing `x`'s `priority` from 3 to 0 changes where it belongs in sort order, and the adapter automatically re-splices it to the front. This is easy to get wrong in two directions: (1) assuming `ids` reflects insertion/dispatch order when a `sortComparer` is present (it doesn't — sort order wins), and (2) assuming a field-only patch via `updateOne` can't affect ordering (it can, whenever the changed field participates in the comparator). If you need stable "recently added" ordering regardless of field edits, don't put the mutable field in the comparator — sort by a separate `createdAt`/insertion index instead, or omit `sortComparer` entirely and sort in a memoized selector at render time.
