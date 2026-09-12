The shift from **`createAsyncThunk`** to **`RTK Query (RTKQ)`** represents the evolution of modern Redux: moving away from writing low-level, imperative data-fetching plumbing and toward an automated, declarative data-caching layer.

While `createAsyncThunk` requires manual state management for loading, errors, and caching, RTK Query eliminates this boilerplate by handling network status, de-duplication, and cache invalidation out of the box.

---

### Key Structural Differences

| Feature                   | `createAsyncThunk` (Manual Labor)                                                               | `RTK Query` (Caching Magic)                                                                  |
| ------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Primary Role**          | Generic async event orchestration                                                               | Purpose-built data fetching & server-state caching                                           |
| **Boilerplate**           | High: Must create slice, reducer cases, and loading/error states                                | Low: Define an endpoint; hooks and reducers are generated automatically                      |
| **Cache Management**      | Manual: You write the caching, deduping, and garbage collection logic                           | Automatic: Subscriptions track component usage; auto-cleans unmounted data                   |
| **Request Deduplication** | None by default: Multiple components mounting simultaneously trigger multiple duplicate fetches | Built-in: Identical concurrent requests share a single network flight                        |
| **Cache Invalidation**    | Manual dispatching of refetch actions across slices                                             | Declarative: Automated via a **Tags** system (`providesTags`, `invalidatesTags`)             |
| **Component Integration** | Manual wiring: `dispatch(fetchData())` in `useEffect` + `useSelector`                           | Generated React hooks (e.g., `useGetUsersQuery()`) providing data, loading, and error states |

---

### Code Comparison: Fetching a Resource

#### 1. The `createAsyncThunk` Approach

You have to write the thunk, manage the slice state, track status flags, and manually call it inside a component's lifecycle:

```javascript
// userSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchUser = createAsyncThunk('user/fetchById', async (userId) => {
  const res = await fetch(`/api/users/${userId}`);
  return res.json();
});

const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, isLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

// Component.jsx
function UserProfile({ userId }) {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUser(userId));
  }, [dispatch, userId]);

  if (isLoading) return <Spinner />;
  return <div>{data?.name}</div>;
}

```

---

#### 2. The `RTK Query` Approach

You declare the endpoint once. RTK Query generates the slice, action creators, reducers, caching layer, and custom React hooks automatically:

```javascript
// userApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    getUserById: builder.query({
      query: (userId) => `users/${userId}`,
    }),
  }),
});

export const { useGetUserByIdQuery } = userApi;

// Component.jsx
function UserProfile({ userId }) {
  // Handles fetch execution, caching, loading states, and deduplication automatically
  const { data, isLoading, error } = useGetUserByIdQuery(userId);

  if (isLoading) return <Spinner />;
  return <div>{data?.name}</div>;
}

```

---

### The "Caching Magic" Capabilities in RTK Query

* **Automatic De-duplication:** If three different dashboard cards request `useGetUserByIdQuery(5)` at the exact same millisecond, RTK Query fires only **one** network request and distributes the resolved data to all three components.
* **Declarative Cache Invalidation via Tags:**
Instead of manually dispatching actions to update a list after a mutation:

```javascript
getPosts: builder.query({
  query: () => '/posts',
  providesTags: ['Posts'],
}),
addPost: builder.mutation({
  query: (body) => ({ url: '/posts', method: 'POST', body }),
  invalidatesTags: ['Posts'], // Refetches getPosts automatically on success
})

```

* **Optimistic Updates:** Update the cache immediately on mutation dispatch and automatically roll back if the network fails.
* **Polling & Refetching on Focus:** Includes built-in configuration flags like `pollingInterval: 3000` or `refetchOnFocus: true` without requiring custom interval or focus listeners.

---

### When to Still Use `createAsyncThunk`

Use **`RTK Query`** for standard server CRUD operations, dashboard caches, and REST/GraphQL APIs.

Reserve **`createAsyncThunk`** for:

* Complex client-side asynchronous orchestration (e.g., image resizing/compression before upload).
* Workflows that span multiple decoupled slices and APIs with non-cache business logic.
* Interfacing with non-request asynchronous browser APIs (e.g., IndexedDB, Bluetooth, Web Workers).
