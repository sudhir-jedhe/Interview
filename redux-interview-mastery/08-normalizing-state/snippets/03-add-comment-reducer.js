// Runnable with plain Node: `node 03-add-comment-reducer.js`
// A hand-written reducer that adds a comment to a normalized store and links it to a post.

const initialState = {
  posts: {
    byId: { p1: { id: 'p1', title: 'Redux tips', authorId: 'u1', commentIds: ['c1'] } },
    allIds: ['p1'],
  },
  comments: {
    byId: { c1: { id: 'c1', text: 'Nice!', authorId: 'u1' } },
    allIds: ['c1'],
  },
};

function commentAdded(state, action) {
  const { postId, comment } = action.payload; // comment: { id, text, authorId }

  return {
    ...state,
    comments: {
      byId: { ...state.comments.byId, [comment.id]: comment },
      allIds: [...state.comments.allIds, comment.id],
    },
    posts: {
      ...state.posts,
      byId: {
        ...state.posts.byId,
        [postId]: {
          ...state.posts.byId[postId],
          commentIds: [...state.posts.byId[postId].commentIds, comment.id],
        },
      },
    },
  };
}

const nextState = commentAdded(initialState, {
  payload: { postId: 'p1', comment: { id: 'c2', text: 'Great read', authorId: 'u2' } },
});

console.log('New comment count on p1:', nextState.posts.byId.p1.commentIds.length); // 2
console.log('Untouched: initialState.posts === nextState.posts ?', initialState.posts === nextState.posts); // false, p1 changed
console.log('comments.byId.c1 reference unchanged:', initialState.comments.byId.c1 === nextState.comments.byId.c1); // true
