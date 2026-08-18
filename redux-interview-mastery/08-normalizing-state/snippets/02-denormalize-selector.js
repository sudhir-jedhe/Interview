// Runnable with plain Node: `node 02-denormalize-selector.js`
// Re-assembling a "view model" from normalized state for rendering.

const state = {
  posts: {
    byId: { p1: { id: 'p1', title: 'Redux tips', authorId: 'u1', commentIds: ['c1', 'c2'] } },
    allIds: ['p1'],
  },
  comments: {
    byId: {
      c1: { id: 'c1', text: 'Nice!', authorId: 'u1' },
      c2: { id: 'c2', text: 'Thanks', authorId: 'u2' },
    },
    allIds: ['c1', 'c2'],
  },
  authors: {
    byId: { u1: { id: 'u1', name: 'Ada' }, u2: { id: 'u2', name: 'Grace' } },
    allIds: ['u1', 'u2'],
  },
};

// Selector: rebuild a denormalized post object for a detail page.
// In a real app this would be wrapped in `reselect`'s createSelector to memoize
// across renders (see topic 07-selectors-reselect).
function selectPostWithComments(state, postId) {
  const post = state.posts.byId[postId];
  if (!post) return null;

  return {
    id: post.id,
    title: post.title,
    author: state.authors.byId[post.authorId],
    comments: post.commentIds.map((commentId) => {
      const comment = state.comments.byId[commentId];
      return { ...comment, author: state.authors.byId[comment.authorId] };
    }),
  };
}

console.log(JSON.stringify(selectPostWithComments(state, 'p1'), null, 2));
