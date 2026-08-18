## What does this log?

```javascript
import { createEntityAdapter } from '@reduxjs/toolkit';

const adapter = createEntityAdapter();
let state = adapter.getInitialState();
state = adapter.addOne(state, { id: 'a', name: 'Ada' });

state = adapter.updateOne(state, { id: 'nonexistent', changes: { name: 'Ghost' } });

console.log(state.ids);
console.log(state.entities);
```

**Answer:**
```
[ 'a' ]
{ a: { id: 'a', name: 'Ada' } }
```

**Why:** `updateOne` performs a *patch*, not an *upsert*. If the `id` in the update payload isn't already present in `state.entities`, the adapter silently no-ops — it does not throw, and it does not insert a new entity. This trips people up because `updateOne`'s signature (`{ id, changes }`) looks superficially similar to `upsertOne`'s (a full entity), but the two have fundamentally different missing-ID behavior: `updateOne` requires the entity to already exist, while `upsertOne` inserts when it's missing and merges when it's present. If your intent was "create it if it's not there, patch it if it is," you need `upsertOne`, not `updateOne`. This is a common source of "why isn't my dispatched update doing anything?" bugs in code review — the dispatch succeeds, no error is thrown, and the state just quietly doesn't change.
