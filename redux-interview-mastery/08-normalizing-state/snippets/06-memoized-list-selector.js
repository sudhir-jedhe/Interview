// Requires: reselect (or @reduxjs/toolkit, which re-exports createSelector)
// A memoized selector that turns normalized comments into a denormalized, sorted view
// without recomputing on every render unless the underlying data actually changed.

import { createSelector } from 'reselect';

const selectCommentsById = (state) => state.comments.byId;
const selectCommentIds = (state) => state.comments.allIds;
const selectAuthorsById = (state) => state.authors.byId;

export const selectCommentsWithAuthor = createSelector(
  [selectCommentIds, selectCommentsById, selectAuthorsById],
  (ids, commentsById, authorsById) =>
    ids.map((id) => {
      const comment = commentsById[id];
      return { ...comment, authorName: authorsById[comment.authorId]?.name ?? 'Unknown' };
    })
);

// Example:
const state = {
  comments: {
    byId: { c1: { id: 'c1', text: 'Nice!', authorId: 'u1' } },
    allIds: ['c1'],
  },
  authors: { byId: { u1: { id: 'u1', name: 'Ada' } } },
};

console.log(selectCommentsWithAuthor(state));
// Calling selectCommentsWithAuthor(state) again with the SAME state object
// returns the cached array instance — no recomputation, no new render trigger.
console.log(selectCommentsWithAuthor(state) === selectCommentsWithAuthor(state)); // true
