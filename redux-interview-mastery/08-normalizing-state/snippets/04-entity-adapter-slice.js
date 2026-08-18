// Requires: @reduxjs/toolkit
// A complete createEntityAdapter-based slice for a "comments" collection.

import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const commentsAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.createdAt.localeCompare(b.createdAt), // oldest first
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState: commentsAdapter.getInitialState({ status: 'idle' }),
  reducers: {
    commentAdded: commentsAdapter.addOne,
    commentTextEdited(state, action) {
      commentsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: { text: action.payload.text },
      });
    },
    commentRemoved: commentsAdapter.removeOne,
    allCommentsReplaced: commentsAdapter.setAll,
  },
});

export const { commentAdded, commentTextEdited, commentRemoved, allCommentsReplaced } =
  commentsSlice.actions;
export const commentsReducer = commentsSlice.reducer;
export const commentsAdapterSelectors = commentsAdapter.getSelectors(
  (state) => state.comments
);

// Example usage:
// const store = configureStore({ reducer: { comments: commentsReducer } });
// store.dispatch(commentAdded({ id: 'c1', text: 'Nice!', authorId: 'u1', createdAt: '2026-01-01' }));
// commentsAdapterSelectors.selectAll(store.getState()); // [{ id: 'c1', ... }]
