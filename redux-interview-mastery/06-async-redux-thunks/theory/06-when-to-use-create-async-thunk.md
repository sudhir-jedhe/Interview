# When to Hand-Roll a Thunk vs. Reach for `createAsyncThunk`

Everything in this topic so far has deliberately been hand-written `redux-thunk` code, because understanding the mechanics matters for interviews and for debugging. But it's worth being explicit about the practical answer to "should I actually write thunks by hand in a real project today?"

**Almost never, for the standard fetch/pending/fulfilled/rejected shape.** `createAsyncThunk` from Redux Toolkit generates exactly the pattern covered in `03-async-flow-pending-fulfilled-rejected.md` and `04-loading-error-state-patterns.md` — the pending/fulfilled/rejected action triplet, a `requestId` for stale-response protection, an `AbortController`-backed `signal` for cancellation, and a `rejectWithValue` helper for structured errors — all from one function call instead of hand-writing three action types and the dispatch sequence yourself.

```javascript
// Hand-written: ~15 lines, plus you own writing requestId tracking yourself if you need it
function fetchUser(id) {
  return async (dispatch, getState) => {
    const requestId = Date.now(); // you'd have to build this yourself
    dispatch({ type: 'user/pending', meta: { requestId } });
    try {
      const data = await api.getUser(id);
      dispatch({ type: 'user/fulfilled', payload: data, meta: { requestId } });
    } catch (err) {
      dispatch({ type: 'user/rejected', payload: err.message, meta: { requestId } });
    }
  };
}

// createAsyncThunk: same guarantees, generated
const fetchUser = createAsyncThunk('user/fetch', async (id) => {
  return api.getUser(id); // requestId, pending/fulfilled/rejected, signal — all provided
});
```

So when does a genuinely hand-written thunk (with or without RTK in the codebase) still make sense?

**1. The operation isn't "fetch a resource and track its status."** A thunk that reads current state, conditionally dispatches one of several different actions, calls `dispatch` multiple times for unrelated reasons, or orchestrates a multi-step client-side workflow (e.g., "validate the form, then dispatch three different slice updates, then navigate") doesn't map cleanly onto `createAsyncThunk`'s single pending/fulfilled/rejected shape — it's just regular imperative logic that happens to need `dispatch`/`getState`, and a plain thunk is the right tool.

**2. Learning/interview contexts.** Understanding what `createAsyncThunk` is automating is exactly why this topic exists — a candidate who can only describe `createAsyncThunk` as a black box, without being able to write the equivalent by hand, hasn't fully internalized what's happening. Interviewers frequently ask "implement this without RTK" specifically to test that understanding.

**3. Extremely lightweight/dependency-constrained contexts.** Rare in practice today, but a tiny app that intentionally avoids adding `@reduxjs/toolkit` as a dependency (unusual, since RTK is now the standard baseline) would need hand-written thunks.

**The honest default for new code:** use `createAsyncThunk` for anything shaped like "fetch/send data, track loading and error state," and use plain thunks (still available and still middleware-provided by `configureStore`) for one-off dispatch logic that doesn't fit that shape — things like a thunk that reads `getState()` to decide whether to bail out early, or one that dispatches a sequence of unrelated synchronous actions as part of a client-side workflow. The two aren't mutually exclusive; RTK-based apps commonly have both `createAsyncThunk`s and a handful of small plain thunks side by side.
