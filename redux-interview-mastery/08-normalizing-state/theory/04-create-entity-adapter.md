# `createEntityAdapter` from Redux Toolkit

Once you accept that normalized state is the right shape, you notice every slice that manages a collection of entities needs the same handful of reducers: add one, add many, update one, remove one, remove many, set all, upsert. Writing that by hand for every entity type (posts, comments, authors, todos, users...) is repetitive boilerplate that RTK eliminates with `createEntityAdapter`.

## Setting it up

```javascript
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

// Optional: control storage key and default sort order
const commentsAdapter = createEntityAdapter({
  selectId: (comment) => comment.id, // default; only needed if your ID field isn't `id`
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt), // newest first
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState: commentsAdapter.getInitialState({ status: 'idle' }), // extra fields OK
  reducers: {
    commentAdded: commentsAdapter.addOne,
    commentsReceived: commentsAdapter.setAll,
    commentUpdated: commentsAdapter.updateOne,
    commentRemoved: commentsAdapter.removeOne,
  },
});

export const { commentAdded, commentsReceived, commentUpdated, commentRemoved } = commentsSlice.actions;
export default commentsSlice.reducer;
```

`getInitialState()` produces exactly the `byId`/`allIds` shape from the previous file, just named `entities` and `ids`:

```javascript
// commentsAdapter.getInitialState({ status: 'idle' }) produces:
// { ids: [], entities: {}, status: 'idle' }
```

The adapter's methods (`addOne`, `setAll`, `updateOne`, `removeOne`, `upsertOne`, `upsertMany`, `removeMany`, ...) are all pre-built, Immer-aware reducer functions — you plug them directly into the `reducers` map, and RTK's Immer integration means they mutate a draft safely under the hood while staying pure from the outside.

## Free selectors

`commentsAdapter.getSelectors()` generates the lookup selectors so you never write `state.comments.entities[id]` by hand across the codebase:

```javascript
export const {
  selectAll: selectAllComments,
  selectById: selectCommentById,
  selectIds: selectCommentIds,
  selectTotal: selectCommentTotal,
} = commentsAdapter.getSelectors((state) => state.comments);

// Usage in a component:
const comment = useSelector((state) => selectCommentById(state, 'c1'));
const allComments = useSelector(selectAllComments); // returns entities in sortComparer order
```

`selectAll` internally maps over `ids` and reads from `entities`, giving you an array view when you need one (e.g., for `.map()` in JSX) while the underlying storage stays normalized.

## `updateOne` vs `upsertOne`

A common interview trip-up: `updateOne` requires the entity to already exist (it takes `{ id, changes }` and merges `changes` into the existing entity — a no-op if the ID isn't present), while `upsertOne` inserts if missing or updates if present (it takes the full entity object). Use `updateOne` for "I know this exists, patch a field"; use `upsertOne` when ingesting API data where you're not sure if it's new or a refresh.

```javascript
dispatch(commentUpdated({ id: 'c1', changes: { text: 'edited!' } })); // patch
dispatch(commentUpsertOne({ id: 'c1', text: '...', authorId: 'u1' })); // insert-or-replace
```

## The trade-off, honestly

`createEntityAdapter` removes the boilerplate but not the underlying indirection: you still need `authorId` foreign keys and a second lookup to render an author's name next to a comment. What it buys you is consistency — every entity slice in a codebase that uses it has the identical shape and identical CRUD semantics, which matters a lot when multiple engineers touch the same store. It's most valuable for RTK Query cache slices and any collection with frequent single-item updates; for a tiny, rarely-updated list, plain `createSlice` with an array is still simpler and there's no shame in choosing that instead.
