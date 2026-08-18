# 08 — Normalizing State

How to structure relational data in a Redux store so it's cheap to update, free of duplication, and doesn't trigger unnecessary re-renders — plus how Redux Toolkit's `createEntityAdapter` generates the boilerplate for you.

## Summary

- **Denormalized (nested) state is a liability at scale.** Embedding related data (a post's author, a comment's author) directly inline duplicates that data everywhere it appears, so a single edit (e.g., a user's display name) has to be propagated to every copy or it silently drifts out of sync.
- **Deeply nested updates require fragile, repeated spreads** — a `.map()` inside a `.map()` inside a spread for every reducer that touches a nested field, and it gets worse with each additional nesting level.
- **The normalized shape stores each entity type once**, in a flat table keyed by ID (`byId`/`allIds`, or `entities`/`ids` in RTK's convention), with relationships expressed as ID references (`authorId`) instead of embedded objects.
- **Normalizing relational API data** is a mechanical tree walk: every object with a stable ID that could be referenced from more than one place becomes its own table entry, referenced by ID from its parent. `normalizr` automates this via declared schemas for anything beyond trivial nesting.
- **`createEntityAdapter`** generates the `byId`/`allIds` storage shape plus a full set of CRUD reducers (`addOne`, `setAll`, `updateOne`, `upsertOne`, `removeOne`, ...) and memoized selectors (`selectAll`, `selectById`, `selectIds`, `selectTotal`), eliminating the repetitive boilerplate every normalized slice would otherwise need.
- **The trade-off is real, not hypothetical**: normalization adds read-side indirection (two lookups instead of one nested read) and makes you responsible for referential integrity (deleting a post doesn't cascade-delete its comments automatically) — it's the right default for relational, frequently-mutated collections, not a blanket rule for every slice.

## theory/
1. [`01-why-nested-state-hurts.md`](theory/01-why-nested-state-hurts.md) — duplicate data, fragile nested updates, unnecessary re-renders, O(n) lookups.
2. [`02-normalized-shape-pattern.md`](theory/02-normalized-shape-pattern.md) — the `byId`/`allIds` pattern, why two fields instead of one, updating one entity in one spread.
3. [`03-normalizing-relational-data.md`](theory/03-normalizing-relational-data.md) — hand-normalizing a nested API response, deduping by ID, `normalizr` schemas.
4. [`04-create-entity-adapter.md`](theory/04-create-entity-adapter.md) — RTK's `createEntityAdapter`, generated reducers and selectors, `updateOne` vs `upsertOne`.

## snippets/
1. [`01-hand-rolled-normalize-function.js`](snippets/01-hand-rolled-normalize-function.js) — normalize a nested post payload into flat tables, no libraries.
2. [`02-denormalize-selector.js`](snippets/02-denormalize-selector.js) — rebuild a denormalized view model from normalized state for rendering.
3. [`03-add-comment-reducer.js`](snippets/03-add-comment-reducer.js) — reducer that adds a comment and links it to a post, with reference-equality checks.
4. [`04-entity-adapter-slice.js`](snippets/04-entity-adapter-slice.js) — a complete `createEntityAdapter` slice with a custom `sortComparer`.
5. [`05-normalizr-schema.js`](snippets/05-normalizr-schema.js) — declaring reusable `normalizr` schemas for posts/comments/authors.
6. [`06-memoized-list-selector.js`](snippets/06-memoized-list-selector.js) — a `reselect`-memoized selector that denormalizes comments with author names.

## output-based/
1. [`01-mutating-nested-array-in-adapter.md`](output-based/01-mutating-nested-array-in-adapter.md) — why "mutating" a draft inside `createSlice` is actually safe (Immer).
2. [`02-updateOne-on-missing-entity.md`](output-based/02-updateOne-on-missing-entity.md) — `updateOne` silently no-ops on an unknown ID.
3. [`03-stale-denormalized-snapshot.md`](output-based/03-stale-denormalized-snapshot.md) — building a new object inline inside `useSelector` defeats reference equality.
4. [`04-sortcomparer-and-updateOne.md`](output-based/04-sortcomparer-and-updateOne.md) — how a `sortComparer` silently reorders `ids` on a field-only patch.
5. [`05-deleting-post-leaves-orphan-comments.md`](output-based/05-deleting-post-leaves-orphan-comments.md) — normalized tables don't cascade-delete on their own.
6. [`06-array-includes-vs-object-lookup.md`](output-based/06-array-includes-vs-object-lookup.md) — O(n) array scans vs O(1) object/Set lookups at scale.
7. [`07-normalizr-entity-key-collision.md`](output-based/07-normalizr-entity-key-collision.md) — two relationship fields sharing one entity schema is correct, not a bug.

## scenarios/
1. [`01-social-feed-comments-and-authors.md`](scenarios/01-social-feed-comments-and-authors.md) — fixing a sluggish comment feed and a stale-username bug.
2. [`02-realtime-chat-message-ordering.md`](scenarios/02-realtime-chat-message-ordering.md) — `createEntityAdapter` with `sortComparer` for out-of-order WebSocket messages.
3. [`03-shopping-cart-line-item-updates.md`](scenarios/03-shopping-cart-line-item-updates.md) — separating product catalog data from cart line items to kill a re-render storm and a price-drift bug.
4. [`04-migrating-a-legacy-nested-store-incrementally.md`](scenarios/04-migrating-a-legacy-nested-store-incrementally.md) — an incremental, readers-then-writers migration plan for a large legacy nested store.

## interview-qa/
1. [`01-normalization-fundamentals.md`](interview-qa/01-normalization-fundamentals.md) — what normalization means and why it's named after database normalization.
2. [`02-entity-adapter-and-selectors.md`](interview-qa/02-entity-adapter-and-selectors.md) — what `createEntityAdapter` generates, `updateOne` vs `upsertOne`, `sortComparer` gotchas.
3. [`03-tradeoffs-and-when-not-to-normalize.md`](interview-qa/03-tradeoffs-and-when-not-to-normalize.md) — when normalizing is overkill, and the referential-integrity cost.

## problems/
1. [`01-normalize-nested-api-response.md`](problems/01-normalize-nested-api-response.md) — normalize a blog posts/comments/authors payload by hand.
2. [`02-update-single-entity-efficiently.md`](problems/02-update-single-entity-efficiently.md) — write a reducer that updates one entity without changing sibling references.
3. [`03-migrate-to-create-entity-adapter.md`](problems/03-migrate-to-create-entity-adapter.md) — convert a hand-normalized `todos` slice to `createEntityAdapter`.

## assets/
See [`assets/README.md`](assets/README.md).
