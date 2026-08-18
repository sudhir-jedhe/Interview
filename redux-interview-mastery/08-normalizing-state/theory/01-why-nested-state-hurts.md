# Why Nested/Denormalized State Hurts in Redux

A denormalized shape mirrors the API response you got: a post has an `author` object embedded in it, and each post has a `comments` array where every comment also carries its own nested `author` object. It looks natural coming straight off the wire, and for a demo app it's fine. In any real Redux app it becomes a liability, and interviewers expect you to be able to name the specific failure modes, not just say "it's bad practice."

## Duplicate data goes stale independently

If the same author appears embedded in 40 posts and 200 comments, updating that author's display name means finding and rewriting all 240 copies. Miss one, and your UI now shows two different names for the same user depending on which list you're looking at. This isn't a hypothetical — it's the single most common bug report in apps with denormalized Redux state: "the username updated in the profile page but not in the comments."

```javascript
// Denormalized: the same author object is duplicated everywhere it appears
const state = {
  posts: [
    { id: 'p1', title: 'Redux tips', author: { id: 'u1', name: 'Ada' }, comments: [
      { id: 'c1', text: 'Nice!', author: { id: 'u1', name: 'Ada' } }, // duplicate!
    ]},
  ],
};
```

## Deeply nested updates require fragile, verbose spreads

To update one comment buried three levels deep, you must reconstruct every ancestor level immutably, because Redux reducers cannot mutate state in place.

```javascript
// Updating comment c1's text — this is what denormalized nesting costs you
function reducer(state, action) {
  return {
    ...state,
    posts: state.posts.map((post) =>
      post.id !== action.payload.postId
        ? post
        : {
            ...post,
            comments: post.comments.map((comment) =>
              comment.id !== action.payload.commentId
                ? comment
                : { ...comment, text: action.payload.text }
            ),
          }
    ),
  };
}
```

This is correct, but it's a `.map` inside a `.map` inside a spread, and it only gets worse with one more level of nesting (e.g., replies to comments). Every reducer that touches a comment has to repeat this whole traversal. Compare this to the normalized version in `02-normalized-shape-pattern.md`, where the same update is a single object spread with no traversal at all.

## Unnecessary re-renders

`useSelector` decides whether to re-render by comparing the *previous* selected value to the *new* one, by reference (`===`) by default. When you update one comment via the pattern above, `state.posts` is a brand-new array, and every post object inside it that got touched by `.map` is a new object too — even posts that had nothing to do with the edited comment, if your `.map` callback isn't careful to return the exact same reference for unaffected items. Any component that selects `state.posts` (rather than a single post by ID) re-renders, even though 199 of 200 posts are logically unchanged. At scale, one edit anywhere can cascade into a full list re-render.

## Awkward, O(n) lookups

Denormalized state models relationships as arrays you have to search: "find the post with this ID" means `posts.find(p => p.id === id)`, an O(n) scan. Do that inside a component that renders per row, and you've turned an O(1) lookup into an O(n²) render pass across a list.

## The fix, in one sentence

Store each entity type once, keyed by ID, and reference other entities by ID instead of embedding them. That's normalization, covered next in `02-normalized-shape-pattern.md`.
