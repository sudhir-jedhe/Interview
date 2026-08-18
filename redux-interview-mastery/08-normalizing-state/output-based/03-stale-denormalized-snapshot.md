## What's wrong with this component, and what will the user see?

```jsx
function PostCard({ postId }) {
  const post = useSelector((state) => {
    // Built fresh every render: a brand-new object literal every time.
    const p = state.posts.byId[postId];
    return {
      ...p,
      author: state.authors.byId[p.authorId],
      commentCount: p.commentIds.length,
    };
  });

  return (
    <div>
      <h3>{post.title}</h3>
      <p>by {post.author.name} · {post.commentCount} comments</p>
    </div>
  );
}
```

**Answer:** The user sees correct data, but `PostCard` re-renders on *every single store update*, regardless of whether anything relevant to this post changed — editing an unrelated comment on a completely different post, changing a UI theme flag, anything.

**Why:** `useSelector`'s default equality check is `===` on the selector's return value. Because the selector function builds a brand-new object literal (`{ ...p, author: ..., commentCount: ... }`) inline on every call, it returns a new reference every single time it runs — even when `state.posts.byId[postId]`, `state.authors.byId[p.authorId]`, and the comment count are all unchanged. `useSelector` re-runs this selector on every dispatched action (cheaply) but then sees a new object reference and forces a re-render (expensively), defeating the entire point of selecting a narrow slice of normalized state. The fix is either (a) wrap the selector in `reselect`'s `createSelector` so it only recomputes — and returns a new reference — when its normalized inputs actually change, or (b) pass a custom equality function like `shallowEqual` from `react-redux` as `useSelector`'s second argument. This exact "denormalize inline inside useSelector" mistake is one of the most common ways teams accidentally erase all the re-render benefits that normalization was supposed to buy them.
