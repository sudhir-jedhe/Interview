// Requires: @reduxjs/toolkit
// Server-cache data as an RTK Query endpoint instead of a hand-rolled thunk/slice.

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => 'users',
      providesTags: (result) =>
        result ? [...result.map((u) => ({ type: 'User', id: u.id })), { type: 'User', id: 'LIST' }] : [{ type: 'User', id: 'LIST' }],
    }),
    createUser: builder.mutation({
      query: (body) => ({ url: 'users', method: 'POST', body }),
      // Invalidating the LIST tag makes getUsers refetch automatically after a successful create.
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
});

export const { useGetUsersQuery, useCreateUserMutation } = usersApi;

// Component usage — no hand-written status/error/dedup logic required:
// const { data: users, isLoading } = useGetUsersQuery();
// const [createUser] = useCreateUserMutation();
// createUser({ name: 'New User' }); // automatically triggers a getUsers refetch
