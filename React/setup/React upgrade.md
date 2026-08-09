Upgrading React—whether moving between major versions (such as **React 17 $\rightarrow$ React 18** or **React 18 $\rightarrow$ React 19**) or minor releases—requires a structured approach to prevent breaking changes, runtime errors, or build failures.

Below is a step-by-step upgrade guide, followed by key changes required for major React releases.

---

## 1. Step-by-Step Upgrade Workflow

1. **1. Review Dependencies & Release Notes:** Identify current dependencies and potential breaking changes.
Check your current version of `react` and `react-dom` in `package.json`. Read the official React release changelog for breaking changes related to your target version.

2. **2. Install Target Version:** Update react, react-dom, and type definitions.
Run the install command for your preferred package manager:

```bash
# Upgrade to latest stable version
npm install react@latest react-dom@latest

# If using TypeScript, update type definitions too
npm install -D @types/react@latest @types/react-dom@latest

```

1. **3. Update Entry Point Code:** Address root API changes and deprecated methods.
Update your application root entry point (`src/index.js` or `src/main.tsx`) if migrating to modern rendering APIs (e.g., `createRoot`).

2. **4. Verify & Test:** Run linters, type checks, and automated test suites.
Run your project's validation tools:

```bash
npm run type-check # or tsc --noEmit
npm run lint
npm test

```

---

## 2. Key Breaking Changes by Version Transition

### Upgrading to React 18

#### New Root Rendering API

React 18 replaced `ReactDOM.render` with `createRoot` to enable concurrent rendering features.

```jsx
// ❌ Legacy React 17 API (Deprecated in 18)
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

// ✅ Modern React 18 API
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

```

#### Automatic Batching

React 18 automatically batches state updates across timeouts, promises, and native event handlers, reducing re-renders:

```javascript
// In React 18, both state updates trigger only ONE re-render (even inside async callbacks)
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 1000);

```

---

### Upgrading to React 19

#### Actions & New Hooks

React 19 introduced built-in state management for async form transitions and optimistic UI updates:

* `useActionState`: For handling async form actions and loading/error states.
* `useFormStatus`: Provides pending status for parent form components.
* `useOptimistic`: Handles immediate visual updates while async actions execute.

#### Cleanup in `ref` Callbacks

Ref callbacks can now return a cleanup function (similar to `useEffect`). Returning anything other than a cleanup function (such as returning an implicit value) throws an error:

```jsx
// ❌ Don't return implicit values from ref callbacks in React 19
<div ref={(node) => (myRef.current = node)} />

// ✅ Explicit assignment or return a cleanup function
<div ref={(node) => { myRef.current = node; }} />

```

#### `ref` as a Standard Prop

In React 19, `forwardRef` is no longer required for function components. You can pass `ref` directly as a regular prop:

```jsx
// React 19 native prop ref:
function MyInput({ ref, label }) {
  return <input ref={ref} placeholder={label} />;
}

```

---

## 3. Post-Upgrade Verification Checklist

* [ ] **Check browser console:** Verify there are no legacy deprecation warnings.
* [ ] **Audit Third-Party Packages:** Check if packages like `react-router-dom`, `redux`, or UI libraries require version updates to support your new React version.
* [ ] **Strict Mode Audit:** In development mode, `React.StrictMode` intentionally double-mounts components to catch side-effect bugs in concurrent rendering. Ensure your `useEffect` cleanups run properly.

Show me how to handle React Router and Redux updates during a React upgrade.

When upgrading React (e.g., to React 18 or React 19), updating **React Router** and **Redux** is crucial to prevent runtime crashes, state synchronization bugs, and deprecation warnings.

Below is a complete migration guide for modernizing both libraries alongside your React upgrade.

---

## 1. Upgrade Package Dependencies

First, upgrade `react`, `react-router`, and `react-redux` together to versions compatible with modern React concurrent rendering.

```bash
# Upgrade React, React Router v7+, and React-Redux v9+
npm install react@latest react-dom@latest react-router@latest @reduxjs/toolkit@latest react-redux@latest

# Upgrade TypeScript types if applicable
npm install -D @types/react@latest @types/react-dom@latest

```

> **Why React-Redux v9+?** React-Redux v9+ leverages React’s `useSyncExternalStore` hook under the hood, ensuring thread-safe state reads during React 18/19 concurrent rendering and automatic batching.

---

## 2. Modernizing React Router

### Migration 1: Transitioning to Data Routers (`createBrowserRouter`)

If your app still uses legacy JSX routing (`<BrowserRouter><Routes>...</Routes></BrowserRouter>`), switch to `createBrowserRouter`. This enables data loaders, actions, and smooth integration with React Suspense.

#### Before (Legacy React Router v5/v6)

```tsx
// ❌ Legacy approach using standalone BrowserRouter
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

```

#### After (React Router v7 / Modern Router)

```tsx
// ✅ Modern Data Router API
import { createBrowserRouter, RouterProvider } from 'react-router';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

```

### Migration 2: Replacing `useHistory` and `connect()` with Hooks

Replace deprecated routing helpers (`useHistory`, `withRouter`) with modern hooks (`useNavigate`, `useParams`).

```tsx
// ❌ Old
import { useHistory } from 'react-router-dom';
const history = useHistory();
history.push('/dashboard');

// ✅ Modern
import { useNavigate } from 'react-router';
const navigate = useNavigate();
navigate('/dashboard');

```

---

## 3. Modernizing Redux & React-Redux

### Migration 1: Moving from `createStore` to Redux Toolkit (`configureStore`)

Legacy `createStore` is deprecated. Replace manual store creation with Redux Toolkit's `configureStore`, which automatically configures the Redux DevTools extension and `redux-thunk` middleware.

#### Before (Legacy Redux)

```typescript
// ❌ Legacy store setup
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { userReducer } from './userReducer';

const rootReducer = combineReducers({ user: userReducer });
export const store = createStore(rootReducer, applyMiddleware(thunk));

```

#### After (Redux Toolkit + React 18/19 Ready)

```typescript
// ✅ Modern Redux Toolkit store setup
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string;
  isLoggedIn: boolean;
}

const initialState: UserState = { name: '', isLoggedIn: false };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.name = '';
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

```

---

### Migration 2: Replacing `connect()` HOC with Typed Redux Hooks

Replace legacy higher-order components (`connect(mapStateToProps)`) with strongly-typed `useDispatch` and `useSelector` hooks.

#### Create Typed Hooks (`src/app/hooks.ts`)

```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

```

#### Consume in Component

```tsx
import { useAppSelector, useAppDispatch } from './hooks';
import { logout } from './store';

export function UserProfile() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  return (
    <div>
      <p>Welcome, {user.name}</p>
      <button onClick={() => dispatch(logout())}>Log Out</button>
    </div>
  );
}

```

---

## 4. Complete Integrated Setup Example

Here is how React 19, React Router, and Redux Toolkit integrate together cleanly at the root level:

```tsx
// src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { store } from './store';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/dashboard', element: <Dashboard /> },
]);

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>
  );
}

```

Show me how to convert traditional Redux Thunks to RTK Query for API calls.

Converting traditional Redux Thunks (`createAsyncThunk` + `createSlice`) to **RTK Query** (`createApi`) replaces manual loading/error state management, boilerplate reducers, and `useEffect` dispatches with declarative endpoints and auto-generated React hooks.

---

## 1. Before: Traditional `createAsyncThunk` Setup

With traditional thunks, you must manually track status states (`idle`, `pending`, `succeeded`, `failed`), manage array updates, and handle async lifecycle actions inside `extraReducers`.

```typescript
// features/posts/postsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Post {
  id: number;
  title: string;
}

interface PostsState {
  items: Post[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PostsState = {
  items: [],
  loading: 'idle',
  error: null,
};

// 1. Define async thunks
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const res = await fetch('https://api.example.com/posts');
  return (await res.json()) as Post[];
});

export const createPost = createAsyncThunk('posts/createPost', async (newPost: Omit<Post, 'id'>) => {
  const res = await fetch('https://api.example.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPost),
  });
  return (await res.json()) as Post;
});

// 2. Define slice and handle extraReducers
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchPosts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to fetch';
      })
      // createPost
      .addCase(createPost.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default postsSlice.reducer;

```

---

## 2. After: RTK Query `createApi` Setup

RTK Query eliminates the need for `createSlice` and `extraReducers` for API data. You define endpoints as either **queries** (for GET requests) or **mutations** (for POST/PUT/DELETE requests).

```typescript
// services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Post {
  id: number;
  title: string;
}

export const apiSlice = createApi({
  reducerPath: 'api', // Top-level state key
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.example.com/' }),
  tagTypes: ['Post'], // Enables automated cache re-fetching
  endpoints: (builder) => ({
    // 1. Query Endpoint (GET)
    getPosts: builder.query<Post[], void>({
      query: () => 'posts',
      providesTags: ['Post'], // Registers this cache under 'Post' tag
    }),

    // 2. Mutation Endpoint (POST)
    createPost: builder.mutation<Post, Omit<Post, 'id'>>({
      query: (newPost) => ({
        url: 'posts',
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: ['Post'], // Automatically refetches getPosts query upon success!
    }),
  }),
});

// Export auto-generated React hooks
export const { useGetPostsQuery, useCreatePostMutation } = apiSlice;

```

---

## 3. Store Setup Update

Connect the generated `apiSlice.reducer` and `apiSlice.middleware` to your Redux store.

```typescript
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './services/api';

export const store = configureStore({
  reducer: {
    // Add the API slice reducer
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // Add the API middleware for caching, invalidation, and polling
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

```

---

## 4. React Component Comparison

### Old Way (Traditional Thunks)

Requires `useDispatch`, `useSelector`, and `useEffect` hooks to fetch data on mount and handle pending/error flags.

```tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { fetchPosts, createPost } from './features/posts/postsSlice';

export function PostsList() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleAdd = () => {
    dispatch(createPost({ title: 'New Post' }));
  };

  if (loading === 'pending') return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <button onClick={handleAdd}>Add Post</button>
      <ul>
        {items.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

```

### New Way (RTK Query)

The auto-generated hook handles fetching on component mount, provides loading/error flags out of the box, and automatically re-fetches when mutations invalidate the cache.

```tsx
import { useGetPostsQuery, useCreatePostMutation } = from './services/api';

export function PostsList() {
  // Query hook automatically fetches data and manages cache lifecycle
  const { data: posts = [], isLoading, isError, error } = useGetPostsQuery();
  
  // Mutation hook returns trigger function and status flags
  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();

  const handleAdd = async () => {
    await createPost({ title: 'New Post' });
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading posts</p>;

  return (
    <div>
      <button onClick={handleAdd} disabled={isCreating}>
        {isCreating ? 'Adding...' : 'Add Post'}
      </button>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

```

---

## Key Benefits of Converting to RTK Query

1. **Zero State Boilerplate:** Eliminates manual `isLoading`, `error`, and `data` reducer fields.
2. **Automatic De-duplication:** Multiple components requesting the same endpoint trigger only a single network request.
3. **Automated Cache Invalidation:** Setting `invalidatesTags: ['Post']` triggers automatic background re-fetching without dispatching refresh actions.
4. **Built-in Features:** Offers polling intervals (`pollingInterval`), optimistic updates, and offline re-fetching out of the box.

In RTK Query, you attach dynamic JWT authentication tokens by using the **`prepareHeaders`** option inside `fetchBaseQuery`.

This option gives you direct access to the Redux store state via `getState()` so you can read the current token before every outgoing request.

---

## 1. Basic Setup using `prepareHeaders`

In your API slice configuration, use `prepareHeaders` to check if a JWT token exists in your Redux `auth` slice and attach it as a `Bearer` token in the `Authorization` header.

```typescript
// services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.example.com/',
    
    // prepareHeaders is invoked before every network request
    prepareHeaders: (headers, { getState }) => {
      // 1. Get the auth token from your Redux state
      const token = (getState() as RootState).auth.token;

      // 2. If token exists, inject Authorization header
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Your API endpoints go here
  }),
});

```

---

## 2. Reading Tokens from LocalStorage / Secure Storage

If you store your JWT in `localStorage` or session storage instead of Redux state, you can read it directly inside `prepareHeaders`:

```typescript
baseQuery: fetchBaseQuery({
  baseUrl: 'https://api.example.com/',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
})

```

---

## 3. Advanced Pattern: Automatic Token Refresh on 401 Unauthorized (`baseQueryWithReauth`)

In production applications, JWT access tokens eventually expire. When an endpoint returns a `401 Unauthorized` status, you can create a **custom base query wrapper** that automatically uses a refresh token to get a new access token and retries the original request.

```typescript
// services/baseQueryWithReauth.ts
import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import { setCredentials, logout } from '../features/auth/authSlice';

// 1. Define standard base query with prepareHeaders
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.example.com/',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// 2. Wrap baseQuery to intercept 401 response and refresh token
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Execute initial request
  let result = await baseQuery(args, api, extraOptions);

  // If initial request fails with 401 Unauthorized
  if (result.error && result.error.status === 401) {
    // Try to obtain a new token using refresh token logic
    const refreshResult = await baseQuery(
      { url: '/auth/refresh', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Store the new token in Redux state
      const newToken = (refreshResult.data as { accessToken: string }).accessToken;
      api.dispatch(setCredentials({ token: newToken }));

      // Retry the original failed query with the new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed -> logout user and force login screen
      api.dispatch(logout());
    }
  }

  return result;
};

```

### Applying the Custom Base Query to `createApi`

```typescript
// services/api.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth, // Use the re-authenticating base query
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => 'user/profile',
    }),
  }),
});

```

---

## Key Rules to Keep in Mind

1. **`prepareHeaders` is mutating:** You can directly modify `headers.set(...)` or return `headers`.
2. **Override headers per endpoint:** If a specific endpoint needs a different header (e.g., `multipart/form-data`), you can set it inside the endpoint's `query` object or check `headers.has('content-type')` inside `prepareHeaders`.

Show me how to build a ProtectedRoute component in React Router v7 using Redux auth state.

Building a `ProtectedRoute` component in **React Router v7** using **Redux Toolkit** allows you to guard private pages based on authentication status and user roles. Unauthenticated users are redirected to the login page (with their attempted location preserved for seamless post-login redirects), while unauthorized users can be sent to an "Access Denied" page.

---

## 1. Auth Slice Setup (`src/features/auth/authSlice.ts`)

Define your authentication state, user roles, and selectors.

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

export type UserRole = 'admin' | 'user' | 'editor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

```

---

## 2. Reusable `ProtectedRoute` Component (`src/components/ProtectedRoute.tsx`)

This component reads the auth state using custom typed Redux hooks, checks authentication and role permissions, and uses React Router v7's `<Navigate>` and `useLocation` hooks for navigation.

```tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAppSelector } from '../hooks';
import { selectAuth, UserRole } from '../features/auth/authSlice';

interface ProtectedRouteProps {
  /** Optional array of roles permitted to access this route */
  allowedRoles?: UserRole[];
  /** Path to redirect unauthenticated users to (default: '/login') */
  redirectTo?: string;
  /** Path to redirect unauthorized users (wrong role) to (default: '/unauthorized') */
  unauthorizedPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectTo = '/login',
  unauthorizedPath = '/unauthorized',
}) => {
  const { isAuthenticated, user } = useAppSelector(selectAuth);
  const location = useLocation();

  // 1. Unauthenticated -> Redirect to Login & preserve attempted URL in state
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 2. Authenticated but lacks required role -> Redirect to Unauthorized page
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={unauthorizedPath} replace />;
  }

  // 3. Authorized -> Render child routes via <Outlet />
  return <Outlet />;
};

```

---

## 3. Registering Protected Routes in React Router v7

In React Router v7 (`createBrowserRouter`), layout components like `ProtectedRoute` wrap target child routes.

```tsx
// src/router.tsx
import { createBrowserRouter } from 'react-router';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Settings from './pages/Settings';
import Unauthorized from './pages/Unauthorized';

export const router = createBrowserRouter([
  // Public Routes
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/unauthorized', element: <Unauthorized /> },

  // Protected Routes (Requires Any Authenticated User)
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/settings', element: <Settings /> },
    ],
  },

  // Role-Restricted Routes (Requires 'admin' Role Only)
  {
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      { path: '/admin', element: <AdminPanel /> },
    ],
  },
]);

```

---

## 4. Handling Login & Return Redirection (`src/pages/Login.tsx`)

When the user logs in, retrieve the saved `from` location out of `location.state` to send them back to the exact page they were trying to access.

```tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAppDispatch } from '../hooks';
import { setCredentials } from '../features/auth/authSlice';

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract attempted URL or default to '/dashboard'
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = () => {
    // Simulated auth API response
    dispatch(
      setCredentials({
        user: { id: '1', name: 'Sudhir', email: 'sudhir@example.com', role: 'admin' },
        token: 'mock-jwt-token-xyz',
      })
    );

    // Redirect user back to the page they originally requested
    navigate(from, { replace: true });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Log In as Admin</button>
    </div>
  );
}

```

---

## Key Design Patterns Applied

1. **`Outlet` Layout Pattern:** Wrapping child routes with `<ProtectedRoute/>` allows for clean route grouping without duplicating guard checks across individual page components.
2. **`replace: true` Navigation:** Prevents the browser's back button from returning users to the login screen after a successful redirect.
3. **Location State Capture:** `state={{ from: location }}` preserves deep-linked paths so users don't lose their place after authenticating.

Show me how to persist Redux auth state across page refreshes using redux-persist.

Using **`redux-persist`** allows you to save your Redux authentication state (JWT tokens, user profile info) to browser storage (`localStorage` or `sessionStorage`) so users remain logged in across page refreshes or browser restarts.

Here is a step-by-step guide to configuring `redux-persist` with **Redux Toolkit** and **React 18 / 19**.

---

## Step 1: Install Dependencies

Install `redux-persist`:

```bash
npm install redux-persist

```

---

## Step 2: Configure `redux-persist` in the Store (`src/app/store.ts`)

Combine your reducers, create a persistence configuration for your `auth` slice using `persistReducer`, and export the `persistor` using `persistStore`.

> **Important:** To prevent non-serializable value warnings from Redux Toolkit's serializability middleware, you must ignore `redux-persist` internal action types.

```typescript
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web

import authReducer from '../features/auth/authSlice';
import { apiSlice } from '../services/api';

// 1. Configure persistence rules
const authPersistConfig = {
  key: 'auth',
  storage, // Uses localStorage
  whitelist: ['user', 'token', 'isAuthenticated'], // Only persist these fields
};

// 2. Wrap auth reducer with persistReducer
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// 3. Combine root reducers
const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

// 4. Configure Redux store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist action types to avoid console warnings
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
});

// 5. Create persistor instance
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

```

---

## Step 3: Wrap App with `PersistGate` (`src/main.tsx`)

Wrap your application root with `<PersistGate loading="{null}" persistor="{persistor}">`.

`PersistGate` delays rendering your UI until Redux has retrieved and rehydrated the saved state from `localStorage`, preventing auth flicker or flash of unauthenticated content.

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './app/store';
import App from './App';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        {/* PersistGate delays app rendering until state rehydration completes */}
        <PersistGate loading={<div>Loading saved session...</div>} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
}

```

---

## Step 4: Handle Logout Cleardown

When a user logs out, clearing state in your `authSlice` resets the Redux memory state. To also purge the saved data out of `localStorage`, you can call `persistor.purge()` or rely on resetting the state to `initialState`.

### Auth Slice (`src/features/auth/authSlice.ts`)

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  user: { id: string; name: string; email: string } | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthState['user']; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

```

### Logout Handler in Component

```tsx
import React from 'react';
import { useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { apiSlice } from '../services/api';

export function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    // 1. Reset auth slice state (redux-persist updates localStorage automatically)
    dispatch(logout());

    // 2. Clear RTK Query API cache to prevent leftover user data
    dispatch(apiSlice.util.resetApiState());
  };

  return <button onClick={handleLogout}>Log Out</button>;
}

```

---

## Advanced Options

### Using `sessionStorage` Instead of `localStorage`

If you want user sessions to clear automatically as soon as the browser tab closes, swap out the storage import:

```typescript
// Uses sessionStorage instead of localStorage
import storageSession from 'redux-persist/lib/storage/session';

const authPersistConfig = {
  key: 'auth',
  storage: storageSession,
};

```

---

## Summary Checklist

1. **`persistReducer`:** Wraps target reducer to specify which fields get saved.
2. **`ignoredActions`:** Excludes `redux-persist` actions from RTK serializability checks.
3. **`PersistGate`:** Prevents UI flash by delaying render until `REHYDRATE` finishes.
4. **`apiSlice.util.resetApiState()`:** Clears cached API responses on logout.

Explain how to implement secure httpOnly cookie authentication with React and Redux.

Storing JWTs or sensitive session tokens in `localStorage` or `sessionStorage` exposes your application to **Cross-Site Scripting (XSS)** attacks—if a malicious script executes on your page, it can read client storage and steal the user's session token.

The industry-standard secure approach is to store authentication tokens in an **`httpOnly`, `Secure`, `SameSite` cookie**. Because `httpOnly` cookies cannot be accessed or read via JavaScript (`document.cookie` returns nothing for them), XSS attacks cannot steal the token.

---

## How `httpOnly` Cookie Auth Works

Unlike header-based token auth (where JavaScript reads `localStorage` and manually attaches `Authorization: Bearer <token>`), cookie-based auth relies on the **browser automatically sending cookies** with requests to the backend server.

```
┌─────────────────┐                      ┌──────────────────┐
│  React / Redux  │ ──── POST /login ───>│  Backend Server  │
│    Front End    │ <── Set-Cookie ──────│   (Node/Java/etc)│
└─────────────────┘  (httpOnly, Secure)  └──────────────────┘
         │                                         │
         │ Automatic Cookie Inclusion              │
         └───────────── GET /user/profile ─────────┘

```

---

## 1. Backend Cookie Configuration (Critical Prerequisites)

For the browser to receive, store, and send `httpOnly` cookies properly, your backend must configure cookie headers and CORS rules correctly.

### Backend Response Header (`Set-Cookie`)

When a user logs in successfully, the backend sets the cookie:

```http
Set-Cookie: token=eyJhbGciOi...; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400

```

* **`HttpOnly`:** Blocks JavaScript access (`document.cookie`).
* **`Secure`:** Forces transmission over HTTPS only (required in production).
* **`SameSite=Lax` (or `Strict`):** Protects against Cross-Site Request Forgery (CSRF).
* **`Path=/`:** Ensures the cookie is sent on all API routes.

### Backend CORS Configuration

Your API server **must explicitly allow credentials** from your React app's origin:

```javascript
// Example in Express.js
app.use(cors({
  origin: 'https://your-react-app.com', // Must specify exact domain (NOT '*')
  credentials: true,                    // Allows cookies to be sent across origins
}));

```

---

## 2. Setting Up RTK Query with `credentials: 'include'`

Because JavaScript cannot read the token, Redux does **not** store the raw JWT token string. Instead, Redux stores only the authenticated **user profile** and **auth status** boolean.

To make RTK Query send `httpOnly` cookies automatically with every request, set `credentials: 'include'` on `fetchBaseQuery`.

### `src/services/api.ts`

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.example.com/api/v1/',
    
    // CRITICAL: Tells the browser to attach httpOnly cookies with every request
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    // Endpoint to verify session on page refresh
    checkAuth: builder.query<{ user: { id: string; name: string; role: string } }, void>({
      query: () => 'auth/me',
    }),
    
    // Login mutation
    login: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Logout mutation
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const { useCheckAuthQuery, useLoginMutation, useLogoutMutation } = apiSlice;

```

---

## 3. Redux Auth Slice Setup

In cookie-based auth, Redux tracks `user` and `isAuthenticated`, but **never** stores a token.

### `src/features/auth/authSlice.ts`

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean; // Tracks initial session check on app start
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitializing: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isInitializing = false;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
    },
    finishInitializing: (state) => {
      state.isInitializing = false;
    },
  },
});

export const { setCredentials, clearAuth, finishInitializing } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state: RootState) => state.auth;

```

---

## 4. App Initialization & Session Hydration (`src/App.tsx`)

When a user refreshes the browser, Redux memory is wiped. Because JavaScript cannot check `document.cookie` for an `httpOnly` token, the app must send a `GET /auth/me` request on startup.

If the browser's `httpOnly` cookie is valid, the server returns the user profile, rehydrating Redux state automatically.

```tsx
import React, { useEffect } from 'react';
import { useCheckAuthQuery } from './services/api';
import { useAppDispatch, useAppSelector } from './hooks';
import { setCredentials, clearAuth, selectAuth } from './features/auth/authSlice';
import { AppRoutes } from './routes';

export default function App() {
  const dispatch = useAppDispatch();
  const { isInitializing } = useAppSelector(selectAuth);

  // Trigger auth/me check on startup
  const { data, isSuccess, isError, isLoading } = useCheckAuthQuery();

  useEffect(() => {
    if (isSuccess && data?.user) {
      // Cookie is valid -> restore user session in Redux
      dispatch(setCredentials({ user: data.user }));
    } else if (isError) {
      // Cookie is missing/invalid/expired -> set unauthenticated state
      dispatch(clearAuth());
    }
  }, [isSuccess, isError, data, dispatch]);

  // Show a blank screen or spinner while checking initial cookie session
  if (isLoading || isInitializing) {
    return <div style={{ textAlign: 'center', marginTop: '20%' }}>Checking session...</div>;
  }

  return <AppRoutes />;
}

```

---

## 5. Handling Login & Logout Actions

### Login Flow

Upon successful login, the server sends the `Set-Cookie` header. The frontend extracts the user metadata from the response body and updates Redux:

```tsx
// src/pages/Login.tsx
import React, { useState } from 'react';
import { useLoginMutation } from '../services/api';
import { useAppDispatch } from '../hooks';
import { setCredentials } from '../features/auth/authSlice';
import { useNavigate } from 'react-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Server responds with user data AND sends Set-Cookie header
      const result = await login({ email, password }).unwrap();
      
      dispatch(setCredentials({ user: result.user }));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" disabled={isLoading}>Log In</button>
    </form>
  );
}

```

### Logout Flow

To log out, the frontend must call the backend `POST /auth/logout` endpoint so the server can send an expired `Set-Cookie` header (`Max-Age=0`), clearing the cookie from the browser.

```tsx
// src/components/LogoutButton.tsx
import React from 'react';
import { useLogoutMutation, apiSlice } from '../services/api';
import { useAppDispatch } from '../hooks';
import { clearAuth } from '../features/auth/authSlice';

export function LogoutButton() {
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      // 1. Tell backend to clear Set-Cookie (Max-Age=0)
      await logout().unwrap();
    } catch (err) {
      console.error('Logout failed on server', err);
    } finally {
      // 2. Clear Redux memory state
      dispatch(clearAuth());

      // 3. Clear RTK Query cached data
      dispatch(apiSlice.util.resetApiState());
    }
  };

  return <button onClick={handleLogout}>Log Out</button>;
}

```

---

## Security Comparison Summary

| Vulnerability                 | `localStorage` + Bearer Token                                                      | `httpOnly` Cookie Auth                                                                          |
| ----------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **XSS Attack (Token Theft)**  | ❌ **Vulnerable:** Malicious scripts can read `localStorage` and exfiltrate tokens. | ✅ **Protected:** JavaScript cannot read `httpOnly` cookies.                                     |
| **CSRF Attack**               | ✅ **Protected:** Attackers cannot force custom `Authorization` headers.            | ⚠️ **Requires Mitigation:** Mitigated via `SameSite=Lax/Strict` cookie flag or anti-CSRF tokens. |
| **Token Lifetime Management** | Managed manually in client code.                                                   | Managed automatically by browser using `Max-Age` / `Expires`.                                   |

Show me how to implement CSRF token protection alongside httpOnly cookie authentication in React.

When using **`httpOnly` cookies** for session authentication, the browser automatically attaches the cookie to every request sent to the server. While this completely protects your token from XSS script theft, it introduces a vulnerability to **Cross-Site Request Forgery (CSRF)**: a malicious website could trick a logged-in user's browser into executing unwanted actions against your backend API.

The standard pattern to secure `httpOnly` cookie authentication against CSRF is the **Double-Submit Cookie Pattern** (or synchronized anti-CSRF tokens).

---

## How Double-Submit Anti-CSRF Token Protection Works

1. **Authentication:** When the user logs in, the backend sends **two items**:

* The secret session/JWT in an **`httpOnly`, `Secure` cookie** (inaccessible to JS).
* A unique, unguessable **CSRF token** in a **readable header/cookie or JSON payload** (accessible to JS).

1. **State Storage:** The React app stores the CSRF token in memory (or reads a non-httpOnly readable cookie).
2. **Request Attaching:** For all state-changing HTTP requests (`POST`, `PUT`, `DELETE`, `PATCH`), the React app reads the CSRF token and sends it in a custom header (e.g., `X-CSRF-Token`).
3. **Server Validation:** The backend compares the incoming `X-CSRF-Token` header against the expected CSRF token. Cross-origin malicious sites cannot read the CSRF token due to the **Same-Origin Policy**, so their forged requests will fail.

```
┌─────────────────┐                      ┌──────────────────┐
│  React / Redux  │ ──── POST /login ───>│  Backend Server  │
│    Front End    │ <── Set-Cookie ──────│                  │
└─────────────────┘     (httpOnly)       └──────────────────┘
         │               CSRF Token Body          │
         │                                        │
         │  1. Cookie auto-attached               │
         │  2. X-CSRF-Token header added          │
         └────── POST /api/transfer ──────────────┘

```

---

## 1. Backend Integration Requirements (Node/Express Example)

To enforce anti-CSRF protection, your API server must generate a token, expose it via a readable cookie or initial endpoint, and validate the `X-CSRF-Token` header on state-changing requests.

### Server Response Headers on Login

```http
Set-Cookie: token=eyJhbG...; HttpOnly; Secure; SameSite=Lax; Path=/
Set-Cookie: XSRF-TOKEN=csrf-secret-uuid-1234; Secure; SameSite=Lax; Path=/

```

> **Note:** Notice that `XSRF-TOKEN` does **NOT** have the `HttpOnly` flag. This allows JavaScript (`document.cookie`) or RTK Query to read it and echo it back in a custom header.

---

## 2. Utility Helper to Extract CSRF Cookie

If your server sets a readable `XSRF-TOKEN` cookie, create a small utility function to read its value from `document.cookie`:

```typescript
// src/utils/getCsrfToken.ts

export function getCsrfToken(): string | null {
  const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
  if (match) {
    return decodeURIComponent(match[2]);
  }
  return null;
}

```

---

## 3. RTK Query Setup with Auto-Injected CSRF Headers

Update your RTK Query `fetchBaseQuery` configuration to inject the `X-CSRF-Token` header for state-changing HTTP methods (`POST`, `PUT`, `DELETE`, `PATCH`).

```typescript
// src/services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getCsrfToken } from '../utils/getCsrfToken';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.example.com/api/v1/',
    
    // 1. Send httpOnly session cookies automatically
    credentials: 'include',

    // 2. Attach CSRF token header dynamically before every request
    prepareHeaders: (headers, { extra }) => {
      const csrfToken = getCsrfToken();

      if (csrfToken) {
        // Standard header name recognized by backends like Spring, Express, Laravel, Django
        headers.set('X-CSRF-Token', csrfToken);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Queries (GET requests don't modify state, so CSRF check is skipped by server)
    getUserProfile: builder.query({
      query: () => 'user/profile',
    }),

    // Mutations (POST/PUT/DELETE trigger prepareHeaders with X-CSRF-Token)
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: 'user/profile',
        method: 'PUT',
        body: profileData,
      }),
    }),

    transferFunds: builder.mutation({
      query: (amount) => ({
        url: 'account/transfer',
        method: 'POST',
        body: { amount },
      }),
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useTransferFundsMutation,
} = apiSlice;

```

---

## 4. Alternate Pattern: In-Memory CSRF Token via Redux State

If you do not want to use a readable `XSRF-TOKEN` cookie, the server can return the CSRF token in the JSON response body during login/auth check. You then store the token strictly in **Redux memory state**.

### Auth Slice (`src/features/auth/authSlice.ts`)

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

interface AuthState {
  user: { id: string; name: string } | null;
  csrfToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  csrfToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: { id: string; name: string }; csrfToken: string }>
    ) => {
      state.user = action.payload.user;
      state.csrfToken = action.payload.csrfToken;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.csrfToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;

export const selectCsrfToken = (state: RootState) => state.auth.csrfToken;

```

### Reading In-Memory CSRF Token in RTK Query `prepareHeaders`

```typescript
// src/services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.example.com/api/v1/',
    credentials: 'include',
    
    prepareHeaders: (headers, { getState, endpoint }) => {
      // Retrieve CSRF token from Redux memory state
      const csrfToken = (getState() as RootState).auth.csrfToken;

      if (csrfToken) {
        headers.set('X-CSRF-Token', csrfToken);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    // ... API endpoints
  }),
});

```

---

## 5. End-to-End Security Architecture Checklist

| Protection Layer                       | Security Function                                           | Implementation                                         |
| -------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------ |
| **`httpOnly` Cookie**                  | Protects Session JWT from XSS                               | Server sets `Set-Cookie: session=...; HttpOnly`        |
| **`SameSite=Lax` or `Strict**`         | Prevents automatic cross-site cookie attachment in browsers | Server sets `Set-Cookie: ...; SameSite=Lax`            |
| **CSRF Token Header (`X-CSRF-Token`)** | Prevents cross-site forged POST/PUT/DELETE requests         | React attaches token via `prepareHeaders`              |
| **Strict CORS Policy**                 | Restricts cross-origin resource sharing to trusted domains  | Backend allows specific `origin` + `credentials: true` |

Explain how to implement dual token architecture (Short-lived Access + Refresh Cookie) with RTK Query.

The **Dual-Token Architecture** (Short-Lived Access Token + Long-Lived Refresh Cookie) provides an optimal balance between security and seamless user experience:

1. **Short-Lived Access Token (e.g., 15-minute lifespan):** Stored strictly **in memory** (Redux state). If an XSS vulnerability exists, an attacker cannot retrieve a persisted token from `localStorage`.
2. **Long-Lived Refresh Token (e.g., 7-day lifespan):** Stored in an **`httpOnly`, `Secure`, `SameSite` cookie**. Protected against JavaScript access and XSS theft.

---

## Architecture Flow

```
┌──────────────────────────┐                               ┌──────────────────────────┐
│   React / Redux Store    │                               │      Backend Server      │
└──────────────────────────┘                               └──────────────────────────┘
             │                                                           │
             │─────── 1. POST /auth/login (credentials) ────────────────>│
             │<────── 2. Returns { accessToken } in JSON Body ───────────│
             │        Sets refreshToken in httpOnly Cookie               │
             │                                                           │
             │─────── 3. GET /api/data (Header: Bearer accessToken) ────>│
             │<────── 4. 401 Unauthorized (Access Token Expired) ───────│
             │                                                           │
             │─────── 5. POST /auth/refresh (httpOnly Cookie sent) ─────>│
             │<────── 6. Returns NEW { accessToken } ────────────────────│
             │                                                           │
             │─────── 7. Retry Original Request with New Access Token ──>│
             │<────── 8. 200 OK Data ────────────────────────────────────│

```

---

## Step 1: Redux Auth Slice Setup

Redux stores the short-lived `accessToken` in memory. `redux-persist` is **not used** for the token to prevent persisting it to storage.

```typescript
// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    updateAccessToken: (
      state,
      action: PayloadAction<{ accessToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, updateAccessToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state: RootState) => state.auth;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;

```

---

## Step 2: Custom Base Query with Silent Re-Authentication (`baseQueryWithReauth`)

We wrap RTK Query's `fetchBaseQuery` with custom logic that intercepts `401 Unauthorized` responses, invokes the refresh endpoint using the `httpOnly` cookie, and seamlessly retries the original failed request.

We also use **`async-mutex`** to prevent multiple concurrent requests from firing duplicate refresh API calls simultaneously.

### Install `async-mutex`

```bash
npm install async-mutex

```

### `src/services/baseQueryWithReauth.ts`

```typescript
import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import type { RootState } from '../store';
import { updateAccessToken, clearAuth } from '../features/auth/authSlice';

// Create a mutex instance to lock concurrent refresh calls
const mutex = new Mutex();

// Standard base query attaching in-memory access token
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.example.com/api/v1/',
  credentials: 'include', // Ensures httpOnly refresh cookie is sent to /auth/refresh
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Wait until any ongoing mutex lock is released before proceeding
  await mutex.waitForUnlock();

  // 1. Try initial request with current in-memory access token
  let result = await baseQuery(args, api, extraOptions);

  // 2. Intercept 401 Unauthorized response (Access token expired or missing)
  if (result.error && result.error.status === 401) {
    // Check if another request is already refreshing the token
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        // Send request to refresh endpoint (httpOnly cookie automatically attached by browser)
        const refreshResult = await baseQuery(
          { url: 'auth/refresh', method: 'POST' },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const data = refreshResult.data as { accessToken: string };

          // Store newly issued short-lived access token in Redux memory
          api.dispatch(updateAccessToken({ accessToken: data.accessToken }));

          // Retry the original request that failed with 401
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Refresh cookie expired or invalid -> log out user
          api.dispatch(clearAuth());
        }
      } finally {
        // Release mutex lock so queued requests can proceed
        release();
      }
    } else {
      // If mutex was locked, wait for it to release, then retry original request with new token
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

```

---

## Step 3: API Slice Configuration

Plug the re-authenticating base query into your primary RTK Query API slice.

```typescript
// src/services/api.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth';
import type { User } from '../features/auth/authSlice';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Posts'],
  endpoints: (builder) => ({
    login: builder.mutation<
      { user: User; accessToken: string },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
    }),

    getUserProfile: builder.query<User, void>({
      query: () => 'user/profile',
      providesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetUserProfileQuery,
} = apiSlice;

```

---

## Step 4: Silent Re-Authentication on App Startup (`App.tsx`)

When the user refreshes the browser, the in-memory Redux state (and short-lived access token) is lost.

On app mount, dispatch a silent `/auth/refresh` request. Because the `httpOnly` refresh cookie persists in the browser, the server issues a fresh access token without requiring the user to type their password again.

```tsx
// src/App.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from './hooks';
import { setCredentials, clearAuth } from './features/auth/authSlice';
import { AppRoutes } from './routes';

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Send silent refresh request on app boot
        const res = await fetch('https://api.example.com/api/v1/auth/refresh', {
          method: 'POST',
          credentials: 'include', // Sends httpOnly refresh cookie
        });

        if (res.ok) {
          const data = await res.json(); // Returns { user, accessToken }
          dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
        } else {
          dispatch(clearAuth());
        }
      } catch (err) {
        dispatch(clearAuth());
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  if (isInitializing) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
        <p>Restoring session...</p>
      </div>
    );
  }

  return <AppRoutes />;
}

```

---

## Step 5: Handling Login & Logout

### Login Flow

```tsx
const [login] = useLoginMutation();

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    // Response contains user profile & in-memory access token.
    // Server also sets httpOnly refresh token cookie.
    const data = await login({ email, password }).unwrap();
    dispatch(setCredentials(data));
    navigate('/dashboard');
  } catch (err) {
    console.error('Login failed:', err);
  }
};

```

### Logout Flow

```tsx
const [logout] = useLogoutMutation();

const handleLogout = async () => {
  try {
    // Tells server to revoke session and return an expired Set-Cookie header
    await logout().unwrap();
  } catch (err) {
    console.error('Logout error:', err);
  } finally {
    // Clear in-memory token and RTK Query cache
    dispatch(clearAuth());
    dispatch(apiSlice.util.resetApiState());
  }
};

```

---

## Security Benefits Summary

| Feature                       | Protection Provided                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- |
| **In-Memory Access Token**    | XSS scripts cannot extract access tokens from `localStorage` or `sessionStorage`.                    |
| **`httpOnly` Refresh Cookie** | Inaccessible to JavaScript; protects long-lived refresh credentials against XSS theft.               |
| **Mutex Lock**                | Prevents race conditions and multiple duplicate refresh calls when multiple components load at once. |
| **Silent Refresh**            | Users remain logged in seamlessly without storing tokens in browser storage across reloads.          |

Explain essential security headers (CSP, HSTS, CORS) for securing a Node/React application.

When deploying a modern **React SPA** and **Node.js/Express API**, HTTP response security headers are your first line of defense against attacks like **Cross-Site Scripting (XSS)**, **Clickjacking**, **Cross-Site Request Forgery (CSRF)**, and **Man-in-the-Middle (MitM)** eavesdropping.

Below is a detailed breakdown of essential security headers—specifically **CSP**, **HSTS**, and **CORS**—and how to configure them in Node.js and React.

---

## 1. Content Security Policy (CSP)

### What it does

**CSP** is an HTTP response header that restricts which resources (JavaScript, CSS, Images, Fonts, Connect/Fetch endpoints, Frames) the browser is allowed to load and execute for your site.

### Primary Threat Protected Against

* **Cross-Site Scripting (XSS):** Even if an attacker manages to inject a `<script>` tag into your React app, CSP prevents the browser from executing untrusted scripts or sending stolen data to an external server.

### Recommended Production CSP Header

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https://api.yourdomain.com; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';

```

### Directive Breakdown

| Directive             | Recommended Value                                                 | Purpose                                                                                                                   |
| --------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **`default-src`**     | `'self'`                                                          | Fallback default for any directive not explicitly declared.                                                               |
| **`script-src`**      | `'self'`                                                          | Allows scripts only from your domain. Blocks inline scripts (`<script>...</script>`) and `eval()`.                        |
| **`style-src`**       | `'self' 'unsafe-inline'`                                          | Allows CSS stylesheets from your origin and inline styles (needed by CSS-in-JS libraries like Emotion/Styled Components). |
| **`img-src`**         | `'self' data: https:`                                             | Allows images from your origin, `data:` URIs (inline images), and HTTPS locations.                                        |
| **`connect-src`**     | `'self' [https://api.yourdomain.com](https://api.yourdomain.com)` | Restricts `fetch()`, `XMLHttpRequest`, and WebSockets to trusted backend API origins.                                     |
| **`object-src`**      | `'none'`                                                          | Blocks legacy plugins like Flash or PDF embeds (`<object>`, `<embed>`).                                                   |
| **`frame-ancestors`** | `'none'`                                                          | Prevents other sites from embedding your app in an `<iframe>` (replaces legacy `X-Frame-Options`).                        |
| **`base-uri`**        | `'self'`                                                          | Restricts URLs used in `<base>` tags to prevent base URL hijacking.                                                       |

---

## 2. HTTP Strict Transport Security (HSTS)

### What it does

**HSTS** tells browsers that your domain must **ONLY** be accessed over HTTPS for a specified duration (`max-age`). Once a browser sees this header, it automatically converts all future `http://` requests to `https://` on the client side before sending them over the network.

### Primary Threat Protected Against

* **SSL Stripping & Man-in-the-Middle (MitM) Attacks:** Prevents attackers on public Wi-Fi from downgrading connections from HTTPS to HTTP.

### Recommended Production HSTS Header

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

```

* **`max-age=31536000`:** Enforces HTTPS for 1 year (in seconds).
* **`includeSubDomains`:** Applies the HTTPS rule to all subdomains (e.g., `api.yourdomain.com`, `admin.yourdomain.com`).
* **`preload`:** Allows your domain to be submitted to Chrome's official HSTS Preload list so browsers enforce HTTPS even on the user's *very first visit*.

---

## 3. Cross-Origin Resource Sharing (CORS)

### What it does

**CORS** is a browser security mechanism that restricts web pages from requesting resources from a domain different from the one that served the web page. The backend server configures CORS headers to explicitly grant permission to specific trusted frontend origins.

### Primary Threat Protected Against

* **Unauthorized Cross-Origin Data Access:** Prevents malicious 3rd-party websites from making unauthorized API calls to your Node backend on behalf of a user.

### Key CORS Headers

```http
Access-Control-Allow-Origin: https://your-react-app.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token

```

### Critical CORS Rules

1. **Never use wildcard `*` with credentials:** If your React app uses `httpOnly` cookies or dynamic credentials (`credentials: 'include'`), setting `Access-Control-Allow-Origin: *` causes the browser to reject the request.
2. **Explicit Whitelist:** Always validate incoming `Origin` headers against an explicit array of allowed domains.

---

## 4. Implementation in Node.js / Express using `helmet` and `cors`

The standard way to implement security headers in a Node.js/Express application is using the official **`helmet`** middleware alongside **`cors`**.

### Installation

```bash
npm install helmet cors

```

### Complete Express Server Setup (`server.js`)

```javascript
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// 1. Configure CORS
const allowedOrigins = ['https://your-react-app.com', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or server-to-server curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true, // Allows httpOnly cookies across origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
}));

// 2. Configure Helmet Security Headers
app.use(
  helmet({
    // Configure Content Security Policy (CSP)
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.yourdomain.com'],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [], // Forces HTTP -> HTTPS for internal assets
      },
    },

    // Configure HSTS (Strict-Transport-Security)
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },

    // Additional essential security headers managed by Helmet out of the box:
    frameguard: { action: 'deny' }, // X-Frame-Options: DENY (Clickjacking protection)
    noSniff: true,                 // X-Content-Type-Options: nosniff (MIME sniffing prevention)
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', secure: true });
});

app.listen(4000, () => {
  console.log('Secure server listening on port 4000');
});

```

---

## 5. Other Essential Security Headers Enforced by `helmet`

| Header                       | Recommended Value                          | Security Purpose                                                                                                         |
| ---------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **`X-Content-Type-Options`** | `nosniff`                                  | Forces browsers to strictly respect declared `Content-Type` headers (prevents executable code disguised as text/images). |
| **`X-Frame-Options`**        | `DENY`                                     | Legacy fallback for CSP `frame-ancestors 'none'`. Prevents clickjacking in older browsers.                               |
| **`Referrer-Policy`**        | `strict-origin-when-cross-origin`          | Prevents sensitive parameters in URLs from leaking in the HTTP `Referer` header when navigating to external sites.       |
| **`Permissions-Policy`**     | `camera=(), microphone=(), geolocation=()` | Restricts browser hardware access (webcam, mic, GPS) unless explicitly allowed.                                          |

---

## Security Verification Tools

After deploying your Node/React app, test your live headers using these tools:

* **[SecurityHeaders.com](https://securityheaders.com/):** Scans and grades all response headers from A+ to F.
* **[CSP Evaluator](https://csp-evaluator.withgoogle.com/):** Google's tool to analyze CSP policies for bypass vulnerabilities.

Explain how to prevent XSS attacks in React applications with code examples.

While React's virtual DOM escapes values rendered inside JSX by default, **Cross-Site Scripting (XSS)** attacks can still occur when rendering raw HTML, executing untrusted string URLs, or using unescaped user inputs in event handlers or SSR templates.

Below is an overview of how XSS attacks happen in React and the exact patterns and code examples to prevent them.

---

## 1. Dangerous Property: `dangerouslySetInnerHTML`

React's `dangerouslySetInnerHTML` bypasses JSX auto-escaping to inject raw HTML string into the DOM. If the injected string contains user-supplied input, malicious `<script>` tags or event handlers (e.g., `<img src=x onerror=... />`) will execute in the user's browser context.

### ❌ Vulnerable Code

```tsx
// Vulnerable to stored or reflected XSS
function UserComment({ commentHtml }: { commentHtml: string }) {
  return <div dangerouslySetInnerHTML={{ __html: commentHtml }} />;
}

```

### ✅ Solution: Sanitize HTML with `DOMPurify`

If rendering raw HTML is strictly required (e.g., rich text editor output), sanitize the string using an established library like **DOMPurify** before passing it to `dangerouslySetInnerHTML`.

```bash
npm install dompurify
npm install -D @types/dompurify

```

```tsx
import DOMPurify from 'dompurify';

function UserComment({ commentHtml }: { commentHtml: string }) {
  // DOMPurify strips scripts, unknown tags, and inline event listeners
  const sanitizedHtml = DOMPurify.sanitize(commentHtml, {
    USE_PROFILES: { html: true }, // Retains standard formatting tags (<b>, <i>, <p>)
  });

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}

```

---

## 2. Dynamic Attribute Injection (`javascript:` URLs)

React automatically escapes text rendered as JSX children, but **it does not automatically sanitize URLs** in `href` or `src` attributes. An attacker can supply a `javascript:` scheme URL that executes arbitrary JavaScript when clicked.

### ❌ Vulnerable Code

```tsx
function UserLink({ profileUrl, linkText }: { profileUrl: string; linkText: string }) {
  // If profileUrl = "javascript:alert(document.cookie)", clicking executes JS!
  return <a href={profileUrl}>{linkText}</a>;
}

```

### ✅ Solution: Validate and Restrict URL Protocols

Sanitize URLs by enforcing explicit allowed protocols (e.g., `http:` and `https:`) before rendering them in `href` or `src` attributes.

```tsx
function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url, window.location.origin);
    
    // Only allow explicit safe protocols
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
  } catch (e) {
    // Malformed URL
  }
  
  // Safe fallback for invalid/malicious protocols
  return '#';
}

function UserLink({ profileUrl, linkText }: { profileUrl: string; linkText: string }) {
  const safeUrl = sanitizeUrl(profileUrl);
  
  return (
    <a href={safeUrl} target="_blank" rel="noopener noreferrer">
      {linkText}
    </a>
  );
}

```

---

## 3. Direct DOM Manipulation via `ref`

Using React `refs` to interact directly with the native DOM (`element.innerHTML` or `document.write`) bypasses React’s built-in JSX escaping mechanisms.

### ❌ Vulnerable Code

```tsx
import { useEffect, useRef } from 'react';

function UserGreeting({ username }: { username: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Direct assignment to innerHTML bypasses React security
      containerRef.current.innerHTML = `<h1>Welcome back, ${username}!</h1>`;
    }
  }, [username]);

  return <div ref={containerRef} />;
}

```

### ✅ Solution: Use React JSX Rendering or `textContent`

Let React handle DOM nodes directly, or use `textContent` / `innerText` if direct DOM mutation is necessary:

```tsx
// Option A: Standard Declarative React JSX (Recommended)
function UserGreeting({ username }: { username: string }) {
  return <h1>Welcome back, {username}!</h1>;
}

// Option B: If using Ref, use textContent instead of innerHTML
function LegacyGreeting({ username }: { username: string }) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.textContent = `Welcome back, ${username}!`;
    }
  }, [username]);

  return <h1 ref={containerRef} />;
}

```

---

## 4. Server-Side Rendering (SSR) State Hydration Injection

In SSR applications (e.g., Next.js or custom Express + React SSR setups), initial state is often serialized into a `<script>` tag so client-side React can hydrate state on boot. Standard `JSON.stringify()` does **not** escape closing script tags (`</script>`).

### ❌ Vulnerable Server Code

```javascript
// Vulnerable Server Template
const initialState = { user: '</script><script>alert("XSS")</script>' };

const html = `
  <script>
    window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
  </script>
`;

```

### ✅ Solution: Serialize State using `serialize-javascript`

Use `serialize-javascript` instead of standard `JSON.stringify()`. It escapes script tags, HTML comments, and special Unicode characters cleanly.

```bash
npm install serialize-javascript

```

```javascript
import serialize from 'serialize-javascript';

const initialState = { user: '</script><script>alert("XSS")</script>' };

const html = `
  <script>
    window.__INITIAL_STATE__ = ${serialize(initialState, { isJSON: true })};
  </script>
`;

```

---

## 5. Security Best Practices Checklist for React

| Attack Vector               | Vulnerable Feature                    | Defense Strategy                                    |
| --------------------------- | ------------------------------------- | --------------------------------------------------- |
| **Raw HTML Injection**      | `dangerouslySetInnerHTML`             | Sanitize HTML using `DOMPurify`.                    |
| **Attribute Execution**     | `<a href={userUrl}>`                  | Validate URL protocol (`http:` / `https:`).         |
| **Direct DOM Manipulation** | `ref.current.innerHTML`               | Use standard JSX or `textContent`.                  |
| **SSR Hydration Poisoning** | `JSON.stringify(state)` in `<script>` | Use `serialize-javascript` for SSR state.           |
| **Session Theft via XSS**   | `localStorage` / `sessionStorage`     | Store auth tokens in `httpOnly` cookies.            |
| **Runtime Script Defense**  | Unrestricted inline scripts           | Enforce a strict **Content Security Policy (CSP)**. |

Explain essential security headers (CSP, HSTS, CORS) for securing a Node/React application.

When deploying a modern **React SPA** and **Node.js/Express API**, HTTP response security headers are your first line of defense against attacks like **Cross-Site Scripting (XSS)**, **Clickjacking**, **Cross-Site Request Forgery (CSRF)**, and **Man-in-the-Middle (MitM)** eavesdropping.

Below is a detailed breakdown of essential security headers—specifically **CSP**, **HSTS**, and **CORS**—and how to configure them in Node.js and React.

---

## 1. Content Security Policy (CSP)

### What it does

**CSP** is an HTTP response header that restricts which resources (JavaScript, CSS, Images, Fonts, Connect/Fetch endpoints, Frames) the browser is allowed to load and execute for your site.

### Primary Threat Protected Against

* **Cross-Site Scripting (XSS):** Even if an attacker manages to inject a `<script>` tag into your React app, CSP prevents the browser from executing untrusted scripts or sending stolen data to an external server.

### Recommended Production CSP Header

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https://api.yourdomain.com; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';

```

### Directive Breakdown

| Directive             | Recommended Value                                                 | Purpose                                                                                                                   |
| --------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **`default-src`**     | `'self'`                                                          | Fallback default for any directive not explicitly declared.                                                               |
| **`script-src`**      | `'self'`                                                          | Allows scripts only from your domain. Blocks inline scripts (`<script>...</script>`) and `eval()`.                        |
| **`style-src`**       | `'self' 'unsafe-inline'`                                          | Allows CSS stylesheets from your origin and inline styles (needed by CSS-in-JS libraries like Emotion/Styled Components). |
| **`img-src`**         | `'self' data: https:`                                             | Allows images from your origin, `data:` URIs (inline images), and HTTPS locations.                                        |
| **`connect-src`**     | `'self' [https://api.yourdomain.com](https://api.yourdomain.com)` | Restricts `fetch()`, `XMLHttpRequest`, and WebSockets to trusted backend API origins.                                     |
| **`object-src`**      | `'none'`                                                          | Blocks legacy plugins like Flash or PDF embeds (`<object>`, `<embed>`).                                                   |
| **`frame-ancestors`** | `'none'`                                                          | Prevents other sites from embedding your app in an `<iframe>` (replaces legacy `X-Frame-Options`).                        |
| **`base-uri`**        | `'self'`                                                          | Restricts URLs used in `<base>` tags to prevent base URL hijacking.                                                       |

---

## 2. HTTP Strict Transport Security (HSTS)

### What it does

**HSTS** tells browsers that your domain must **ONLY** be accessed over HTTPS for a specified duration (`max-age`). Once a browser sees this header, it automatically converts all future `http://` requests to `https://` on the client side before sending them over the network.

### Primary Threat Protected Against

* **SSL Stripping & Man-in-the-Middle (MitM) Attacks:** Prevents attackers on public Wi-Fi from downgrading connections from HTTPS to HTTP.

### Recommended Production HSTS Header

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

```

* **`max-age=31536000`:** Enforces HTTPS for 1 year (in seconds).
* **`includeSubDomains`:** Applies the HTTPS rule to all subdomains (e.g., `api.yourdomain.com`, `admin.yourdomain.com`).
* **`preload`:** Allows your domain to be submitted to Chrome's official HSTS Preload list so browsers enforce HTTPS even on the user's *very first visit*.

---

## 3. Cross-Origin Resource Sharing (CORS)

### What it does

**CORS** is a browser security mechanism that restricts web pages from requesting resources from a domain different from the one that served the web page. The backend server configures CORS headers to explicitly grant permission to specific trusted frontend origins.

### Primary Threat Protected Against

* **Unauthorized Cross-Origin Data Access:** Prevents malicious 3rd-party websites from making unauthorized API calls to your Node backend on behalf of a user.

### Key CORS Headers

```http
Access-Control-Allow-Origin: https://your-react-app.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token

```

### Critical CORS Rules

1. **Never use wildcard `*` with credentials:** If your React app uses `httpOnly` cookies or dynamic credentials (`credentials: 'include'`), setting `Access-Control-Allow-Origin: *` causes the browser to reject the request.
2. **Explicit Whitelist:** Always validate incoming `Origin` headers against an explicit array of allowed domains.

---

## 4. Implementation in Node.js / Express using `helmet` and `cors`

The standard way to implement security headers in a Node.js/Express application is using the official **`helmet`** middleware alongside **`cors`**.

### Installation

```bash
npm install helmet cors

```

### Complete Express Server Setup (`server.js`)

```javascript
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// 1. Configure CORS
const allowedOrigins = ['https://your-react-app.com', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or server-to-server curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true, // Allows httpOnly cookies across origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
}));

// 2. Configure Helmet Security Headers
app.use(
  helmet({
    // Configure Content Security Policy (CSP)
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.yourdomain.com'],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [], // Forces HTTP -> HTTPS for internal assets
      },
    },

    // Configure HSTS (Strict-Transport-Security)
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },

    // Additional essential security headers managed by Helmet out of the box:
    frameguard: { action: 'deny' }, // X-Frame-Options: DENY (Clickjacking protection)
    noSniff: true,                 // X-Content-Type-Options: nosniff (MIME sniffing prevention)
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', secure: true });
});

app.listen(4000, () => {
  console.log('Secure server listening on port 4000');
});

```

---

## 5. Other Essential Security Headers Enforced by `helmet`

| Header                       | Recommended Value                          | Security Purpose                                                                                                         |
| ---------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **`X-Content-Type-Options`** | `nosniff`                                  | Forces browsers to strictly respect declared `Content-Type` headers (prevents executable code disguised as text/images). |
| **`X-Frame-Options`**        | `DENY`                                     | Legacy fallback for CSP `frame-ancestors 'none'`. Prevents clickjacking in older browsers.                               |
| **`Referrer-Policy`**        | `strict-origin-when-cross-origin`          | Prevents sensitive parameters in URLs from leaking in the HTTP `Referer` header when navigating to external sites.       |
| **`Permissions-Policy`**     | `camera=(), microphone=(), geolocation=()` | Restricts browser hardware access (webcam, mic, GPS) unless explicitly allowed.                                          |

---

## Security Verification Tools

After deploying your Node/React app, test your live headers using these tools:

* **[SecurityHeaders.com](https://securityheaders.com/):** Scans and grades all response headers from A+ to F.
* **[CSP Evaluator](https://csp-evaluator.withgoogle.com/):** Google's tool to analyze CSP policies for bypass vulnerabilities.
