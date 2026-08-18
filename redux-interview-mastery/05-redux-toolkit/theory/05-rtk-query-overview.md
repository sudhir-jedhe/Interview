# RTK Query: The Data-Fetching Layer, Conceptually

RTK Query ships inside the `@reduxjs/toolkit` package (via `@reduxjs/toolkit/query`) and solves a different problem than everything else in RTK. `createSlice` and `createAsyncThunk` are still fundamentally about *you* writing the reducer logic for state you manage. RTK Query instead asks: "why are you writing that logic at all, if the data actually just lives on a server and Redux is holding a temporary cached copy of it?"

Server data — a user profile, a list of products, search results — behaves differently from genuine client state (a form's current input, whether a modal is open). It can go stale, multiple components may want the same data, requests should be deduplicated, and you usually want caching, background refetching, and loading/error flags *for every single endpoint* — which is exactly the boilerplate `createAsyncThunk` + `extraReducers` still leaves you writing by hand, endpoint after endpoint.

RTK Query removes that entirely. You describe your API surface declaratively, and it code-generates the slice, the thunks, the cache, and a set of auto-generated React hooks:

```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (id) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `users/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
  }),
});

export const { useGetUserQuery, useUpdateUserMutation } = api;
```

```jsx
function UserProfile({ id }) {
  // fetching, caching, refetch-on-args-change, loading/error states — all handled
  const { data: user, isLoading, error } = useGetUserQuery(id);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorBanner error={error} />;
  return <div>{user.name}</div>;
}
```

Conceptually, what RTK Query buys you:

- **Automatic caching with reference counting.** Multiple components calling `useGetUserQuery(5)` share one request and one cache entry; the cache entry is only removed after the last subscribed component unmounts (plus a configurable grace period).
- **Cache invalidation via tags.** `providesTags`/`invalidatesTags` describes which cached data a mutation makes stale, so RTK Query can automatically refetch the right queries after a write — no manual "refetch this list after that POST" wiring.
- **Loading/error/success state per endpoint, for free.** `isLoading`, `isFetching`, `isError`, `isSuccess` come back from every generated hook without you writing a `status` field anywhere.
- **It plugs into the same store.** `api.reducer` is added to `configureStore`'s `reducer` object and `api.middleware` is appended via `getDefaultMiddleware().concat(api.middleware)` — it's still "just Redux" under the hood; the cache genuinely lives in the Redux store and is inspectable in DevTools.

The interview-level takeaway: RTK Query is not a replacement for `createSlice`/`createAsyncThunk` — those remain the right tool for *client* state (UI state, form state, anything not mirrored from a server). RTK Query is the right tool specifically for *server-cache* state, and reaching for it instead of hand-rolling a fetch-slice-per-endpoint is now the RTK team's default recommendation for any app that talks to a REST or GraphQL API. Going deep into RTK Query's full API (polling, optimistic updates, code generation from OpenAPI schemas) is a topic of its own — the conceptual model above is what's expected at the level of this topic.
