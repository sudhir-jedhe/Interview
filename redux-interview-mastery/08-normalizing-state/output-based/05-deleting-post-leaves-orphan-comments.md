## After this dispatch, what's in `state.comments`?

```javascript
function postsReducer(state, action) {
  switch (action.type) {
    case 'posts/postRemoved': {
      const { [action.payload.id]: removed, ...remainingById } = state.byId;
      return {
        ...state,
        byId: remainingById,
        allIds: state.allIds.filter((id) => id !== action.payload.id),
      };
    }
    default:
      return state;
  }
}

const posts = {
  byId: { p1: { id: 'p1', commentIds: ['c1', 'c2'] } },
  allIds: ['p1'],
};
const comments = {
  byId: { c1: { id: 'c1', postId: 'p1', text: 'Nice!' }, c2: { id: 'c2', postId: 'p1', text: 'Thanks' } },
  allIds: ['c1', 'c2'],
};

const nextPosts = postsReducer(posts, { type: 'posts/postRemoved', payload: { id: 'p1' } });
console.log(nextPosts);
console.log(comments); // unchanged by this dispatch — is that a problem?
```

**Answer:**
```
{ byId: {}, allIds: [] }
{ byId: { c1: {...}, c2: {...} }, allIds: [ 'c1', 'c2' ] }
```
`p1` is correctly removed from `posts`, but `c1` and `c2` are still sitting in `comments`, now referencing a `postId` that no longer exists.

**Why:** Normalized tables don't cascade-delete on their own — each slice's reducer only knows about its own entity type, so removing a post does not automatically clean up the comments that reference it (unlike a real relational database with `ON DELETE CASCADE`). These orphaned comments are a memory leak at minimum, and a correctness bug if any selector iterates `comments.allIds` without checking that the referenced post still exists (e.g., a "recent comments across all posts" widget would show comments on posts that appear deleted). The fix is to make deletion relationship-aware: either (a) have the `postRemoved` action's thunk/effect also dispatch `commentsRemovedForPost(postId)` using the post's `commentIds` before removing the post, or (b) use RTK Query / a normalized cache library that tracks these relationships and can clean up on invalidation. This is a genuine trade-off of normalization worth naming out loud in an interview: you gain cheap updates, but you now own referential integrity yourself, the way a database schema's foreign keys would.
