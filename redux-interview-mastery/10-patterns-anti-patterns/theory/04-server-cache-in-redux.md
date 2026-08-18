# Anti-Pattern: Putting Server-Cache Data in Hand-Rolled Redux

This is arguably the single most common real-world Redux anti-pattern in 2020s codebases, and it's covered here from the "what's wrong with the code" angle — see `09-redux-vs-alternatives` for the fuller "what to use instead and why" comparison.

## What it looks like

```javascript
// A hand-rolled slice whose entire job is "cache what the server returned"
const usersSlice = createSlice({
  name: 'users',
  initialState: { data: [], status: 'idle', error: null, lastFetchedAt: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
```

Nothing here is *technically* wrong — it's valid Redux Toolkit code, and if you asked "does this work," the answer is yes. The problem is everything it's missing that isn't visible from reading this one slice in isolation.

## What's missing, concretely

- **Cache invalidation.** If a `createUser` mutation elsewhere adds a new user, this slice has no idea — something has to manually dispatch a re-fetch or manually patch `state.data`, and it's easy to forget one of the several places that should trigger a refresh.
- **Request deduplication.** If two components both mount and both dispatch `fetchUsers()` around the same time, two network requests fire, because nothing here tracks "is a fetch already in flight for this exact query."
- **Refetch-on-focus / refetch-on-reconnect.** Data can go stale while a tab is backgrounded; there's no automatic re-validation without hand-writing it.
- **Per-parameter caching.** If `fetchUsers` needs to support different filters/pages, this shape (`data`/`status`/`error` as three flat fields) can't represent "loading page 2 while page 1's data is still valid and displayed" without a redesign into a keyed cache.

Each of these is solvable by hand — but solving all of them, correctly, for every fetch-shaped slice in a codebase, is a lot of repeated, bug-prone infrastructure work for a problem that's already been solved generically.

## The fix

```javascript
// RTK Query: the same "cache what the server returned" job, with the missing
// pieces (dedup, invalidation, refetch-on-focus, per-argument caching) built in.
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query({ query: () => 'users', providesTags: ['User'] }),
    createUser: builder.mutation({
      query: (body) => ({ url: 'users', method: 'POST', body }),
      invalidatesTags: ['User'], // automatically refetches getUsers after a successful create
    }),
  }),
});
export const { useGetUsersQuery, useCreateUserMutation } = usersApi;
```

## The heuristic for spotting this in review

Ask: "if I deleted the `status`/`error` fields and the `pending`/`rejected` reducer cases, is what's left just `data = the server's response`, with zero client-only logic mixed in?" If yes, that slice is a cache, not application state, and belongs in RTK Query (or React Query) rather than hand-rolled Redux — regardless of how well-written the hand-rolled version is.
