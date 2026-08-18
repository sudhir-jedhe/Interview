# Scenario: A Social Feed Editing Comments Is Sluggish

Your team built a social feed: a list of posts, each with a collapsible comment thread, each comment showing the commenting user's live-updating avatar and name. State is currently one big array of post objects, each with nested `comments` arrays, each comment with a nested `author` object. Product reports that editing or deleting a single comment on a feed with 300 posts loaded causes a visible frame drop, and QA found that updating a user's display name (via a settings page) doesn't propagate to their older comments without a full page refresh.

## Approach:

**1. Diagnose the two symptoms as one root cause.** Both the frame drop and the stale-name bug trace back to denormalized, duplicated state: the author object is copied into every comment they've ever written, and updating one comment requires rebuilding the entire `posts` array via nested `.map()`, which changes the reference of every post object touched by the map callback (and, if the callback isn't written carefully, every post in the array) — triggering `useSelector` re-renders across the whole feed.

**2. Normalize on ingestion, not on every read.** Add a normalization step (hand-rolled or via `normalizr`) in the thunk/RTK Query `transformResponse` that processes the feed API response, producing three tables: `posts.byId`/`allIds`, `comments.byId`/`allIds`, `users.byId`/`allIds`. Every comment stores `authorId` instead of an embedded `author` object.

```javascript
// transformResponse in an RTK Query endpoint
transformResponse: (response) => {
  const { entities, result } = normalize(response.posts, [postSchema]);
  return { posts: entities.posts, comments: entities.comments, users: entities.users, postIds: result };
},
```

**3. Fix the stale-name bug for free.** Because a comment now stores `authorId: 'u42'` instead of a copied name string, updating `users.byId.u42.name` once (from the settings-page save) is immediately reflected everywhere `u42` is referenced — the comment thread, the feed byline, a "who liked this" tooltip — with zero additional propagation logic, because there's only one copy of that user's data to update.

**4. Fix the render-storm with targeted reducers and memoized selectors.** Editing comment `c9` becomes a single-key patch: `comments.byId.c9 = { ...comments.byId.c9, text: newText }`, leaving `comments.byId.c1` through `c8` and the entire `posts` table untouched by reference. Pair this with per-comment `useSelector(state => selectCommentById(state, commentId))` (using RTK's `createEntityAdapter` selectors) so each comment component only re-renders when its own entity changes, not when any comment anywhere changes.

**5. Handle the migration incrementally.** Don't rewrite the whole feed slice in one PR. Add the normalized tables alongside the old shape, normalize new API responses into both temporarily, migrate one component (the comment editor, since it's the reported pain point) to read from normalized selectors, verify the frame drop is gone, then migrate the rest of the feed and delete the old denormalized shape. This keeps the change reviewable and bisectable if something regresses.

**Result:** comment edits become a single-object-spread reducer instead of a triple-nested map, per-comment components re-render only when their own entity changes, and a user's name update is now genuinely a single write instead of a search-and-replace across every post and comment.
