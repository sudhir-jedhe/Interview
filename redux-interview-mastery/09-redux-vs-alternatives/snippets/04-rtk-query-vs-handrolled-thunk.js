// Requires: @reduxjs/toolkit (RTK Query half); plain fetch (hand-rolled half)
// Side-by-side: fetching a user's profile as hand-rolled Redux vs RTK Query.

// ---- Hand-rolled (the anti-pattern for server-cache data) ----
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUser = createAsyncThunk('user/fetch', async (userId) => {
  const res = await fetch(`/api/users/${userId}`);
  return res.json();
});

const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
    // Missing here vs RTK Query: cache invalidation, refetch-on-focus, request
    // deduplication if two components call fetchUser(sameId) simultaneously, etc.
  },
});
export const userReducer = userSlice.reducer;

// ---- RTK Query equivalent (the recommended approach for server-cache data) ----
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUser: builder.query({ query: (userId) => `users/${userId}` }),
  }),
});
export const { useGetUserQuery } = userApi;

// Component usage — loading/error/caching/dedup all handled for you:
// const { data, isLoading, error } = useGetUserQuery(userId);
