Here is the complete, professional breakdown of an **Enterprise React Application Architecture and Folder Structure** in English, structured specifically for a Senior/Lead Front-End Developer interview.

---

### **Overview: Architectural Philosophy**

In production enterprise applications, we follow a **Feature-First / Domain-Driven Architecture** combined with the **Separation of Concerns** principle.

Instead of a simple "Type-Based" structure (grouping everything strictly into global `components/` and `hooks/`), a Feature-First structure encapsulates business logic inside domain modules (e.g., `features/auth`, `features/billing`). This makes the codebase modular, minimizes git merge conflicts across large teams, and enables effortless scaling or refactoring.

---

### **Production Directory Tree**

```text
src/
├── assets/             # Static media assets (images, icons, global styles, fonts)
├── components/         # Shared, domain-agnostic UI elements (Design System)
├── layouts/            # Page structure wrappers (e.g., Dashboard, Auth layout)
├── pages/              # Route-level view components mapped to React Router / Next.js
├── features/           # Domain-specific business modules (Self-contained)
│   ├── auth/           # Authentication Feature Domain
│   │   ├── api/        # Feature API services & React Query/RTK Query endpoints
│   │   ├── components/ # Feature-specific UI components
│   │   ├── hooks/      # Feature-specific custom hooks
│   │   ├── store/      # Feature state slice (Redux / Zustand store)
│   │   ├── types/      # Feature TypeScript interfaces
│   │   └── index.ts    # Public API export barrel file
│   └── dashboard/      # Dashboard Feature Domain
├── hooks/              # Global reusable custom hooks
├── services/           # Global HTTP client config (Axios interceptors, API gateway)
├── store/              # Centralized global state configuration
├── routes/             # App routing definitions & Protected Route guards
├── utils/              # Pure utility/helper functions
├── config/             # App constants, environment variable validations
├── types/              # Global ambient TypeScript definitions
├── App.tsx             # Root Application Component
└── main.tsx            # Application Entry Point

```

---

### **Layer-by-Layer Architectural Breakdown**

#### **1. `assets/**`

* **Role:** Houses all static resources including SVG icons, brand images, custom fonts, and global SCSS/Tailwind styling overrides.

#### **2. `components/` (Shared UI / Design System)**

* **Role:** Pure, reusable, **domain-agnostic UI components** (e.g., `Button`, `Modal`, `DataTable`, `TextField`).
* **Principle:** These components do **not** know about business logic, API calls, or global application state. They receive data strictly via `props`.

#### **3. `features/` (The Core Engine)**

* **Role:** The heart of the application, structured by business domain.
* **Encapsulation:** Each sub-folder inside `features/` operates as a self-contained module containing its own UI components, hooks, API calls, and state management.
* **Benefit:** When developers work on a specific business module, all related files live in one directory, eliminating endless navigation through global folders (**Colocation Principle**).

#### **4. `layouts/**`

* **Role:** Structural frames that wrap route components.
* **Examples:** `AuthLayout` (centered card with brand logo), `DashboardLayout` (collapsible sidebar, header navbar, dynamic content viewport).

#### **5. `pages/` (View / Route Layer)**

* **Role:** Top-level route views rendered by the router.
* **Principle:** Pages remain "thin"—their primary job is to compose components from `features/` and place them inside a `layout/`. They perform minimal business logic themselves.

#### **6. `hooks/` (Global Custom Hooks)**

* **Role:** Reusable utility hooks used across multiple features (e.g., `useDebounce`, `useLocalStorage`, `useMediaQuery`, `useWindowSize`).

#### **7. `services/` (Data Access Layer)**

* **Role:** Configures global HTTP clients (e.g., Axios instance setup).
* **Key Responsibilities:**
* Request Interceptors: Dynamically attaching OAuth2 Bearer tokens to headers.
* Response Interceptors: Global handling of HTTP 401/403/500 errors and automated JWT refresh-token rotation logic.

#### **8. `routes/` (Navigation Layer)**

* **Role:** Centralized route configurations, dynamic imports (`React.lazy` / suspense) for code-splitting, and authorization-based **Protected Routes** (e.g., role-based routing).

#### **9. `store/` & `store/` within Features (State Layer)**

* **Role:** Manages application state using **Redux Toolkit** or **Zustand**.
* **Architecture:** Global state handles application-wide data (e.g., theme, current user session), while feature-specific slices live inside their respective `features/*/store` directory.

#### **10. `utils/` (Pure Helper Logic)**

* **Role:** Pure JavaScript/TypeScript helper functions without React dependencies (e.g., `formatCurrency()`, `formatDate()`, input validation regex schemas).

---

### **Key Architectural Principles to State in an Interview**

1. **The Colocation Principle:** *"Code that changes together should live together."* Keep feature-specific logic inside the feature folder rather than forcing it into a global directory.
2. **Unidirectional Dependency Rule:** Dependencies must flow inward:
`utils/components` $\rightarrow$ `features` $\rightarrow$ `pages` $\rightarrow$ `routes`
*(A shared component in `components/` should never import code from a `feature/` folder).*
3. **Barrel Exports (`index.ts`):** Each feature exposes a strict public API through an `index.ts` file, preventing outside files from deeply coupling to internal feature paths (e.g., `import { LoginForm } from 'features/auth'`).

Show me a code implementation example of integrating Redux Toolkit or Zustand into a Feature-First React architecture.

Here is a concrete code implementation demonstrating how **Redux Toolkit** and **Zustand** integrate into a **Feature-First React Architecture**.

We'll use an **Auth Feature** (`src/features/auth/`) as our real-world example.

---

## 1. Directory Tree (Auth Feature Context)

```text
src/
├── features/
│   └── auth/
│       ├── api/
│       │   └── authApi.ts          # Feature API service
│       ├── store/
│       │   ├── authSlice.ts        # Redux Slice (Option A)
│       │   └── useAuthStore.ts     # Zustand Store (Option B)
│       ├── components/
│       │   └── LoginForm.tsx       # Feature UI component
│       ├── types/
│       │   └── index.ts            # Auth TypeScript definitions
│       └── index.ts                # Public API barrel file
├── store/
│   ├── rootReducer.ts              # Root Reducer (Redux)
│   └── index.ts                    # Global Store Config

```

---

## Shared Types (`src/features/auth/types/index.ts`)

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  pass: string;
}

```

---

## Option A: Redux Toolkit Integration

### 1. Feature Slice (`src/features/auth/store/authSlice.ts`)

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, LoginCredentials } from '../types';
import { loginApi } from '../api/authApi';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async Thunk isolated within the feature
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      return response; // Expects { user, token }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Authentication failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;

```

### 2. Global Store Registration (`src/store/index.ts`)

```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, // Feature slice combined into central store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

```

---

## Option B: Zustand Integration (Atomic / Modern Lightweight)

Zustand eliminates central store boilerplate by co-locating state and actions directly inside the feature store file.

### Feature Store (`src/features/auth/store/useAuthStore.ts`)

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AuthState, User, LoginCredentials } from '../types';
import { loginApi } from '../api/authApi';

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        // State
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        login: async (credentials) => {
          set({ isLoading: true, error: null }, false, 'auth/loginPending');
          try {
            const { user, token } = await loginApi(credentials);
            set(
              { user, token, isAuthenticated: true, isLoading: false },
              false,
              'auth/loginSuccess'
            );
          } catch (err: any) {
            set(
              {
                error: err.response?.data?.message || 'Authentication failed',
                isLoading: false,
              },
              false,
              'auth/loginRejected'
            );
          }
        },

        logout: () =>
          set(
            { user: null, token: null, isAuthenticated: false, error: null },
            false,
            'auth/logout'
          ),

        clearError: () => set({ error: null }, false, 'auth/clearError'),
      }),
      {
        name: 'auth-storage', // LocalStorage persistence key
        partialize: (state) => ({ token: state.token, user: state.user }), // Only persist session
      }
    )
  )
);

```

---

## Feature Barrel File (`src/features/auth/index.ts`)

The feature exposes a clean public interface so external modules (`pages`, `routes`) never reach deep into internal file paths.

```typescript
// Public UI exports
export { LoginForm } from './components/LoginForm';

// Public Store & Types exports
export { useAuthStore } from './store/useAuthStore'; // If using Zustand
export { logout, loginUser } from './store/authSlice'; // If using Redux
export type { User, AuthState } from './types';

```

---

## Usage in UI Component (`src/features/auth/components/LoginForm.tsx`)

Here is how the UI component consumes state inside the feature:

### Using Zustand (Cleaner Selectors)

```tsx
import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  // Fine-grained atomic state extraction prevents unnecessary re-renders
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, pass });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-sm mx-auto space-y-4">
      {error && <div className="p-2 text-red-600 bg-red-100 rounded">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        placeholder="Password"
        className="w-full border p-2 rounded"
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        {isLoading ? 'Authenticating...' : 'Sign In'}
      </button>
    </form>
  );
};

```

---

### **Key Architectural Trade-Offs to Point Out in an Interview:**

1. **Redux Toolkit:** Better suited when global middleware (e.g., central audit logging, complex saga flows, enterprise RTK Query caching) is required. Redux enforces a single global store tree.
2. **Zustand:** Better suited for modern modular architectures. It eliminates provider wrappers (`<Provider store="{store}">`), supports atomic state slices, and allows features to remain completely decoupled with zero top-level store configuration boilerplate.

Show me how TanStack Query or RTK Query fits into this Feature-First React architecture.

Here is how **TanStack Query (React Query v5)** and **RTK Query** integrate into a **Feature-First React Architecture**.

In modern React applications, we strictly separate **Client State** (UI state, modals, theme) from **Server State** (caching, data fetching, optimistic updates). Server state management belongs inside the `api/` layer of each feature domain.

---

## Architecture Blueprint: Server State Location

```text
src/
├── features/
│   └── users/                       # Feature Domain
│       ├── api/                     # Data Fetching / Server State Layer
│       │   ├── getUsers.ts          # TanStack Query Hook/Query Option
│       │   ├── updateUser.ts        # TanStack Mutation Hook
│       │   └── usersApiSlice.ts     # RTK Query Api Slice (Alternative)
│       ├── components/
│       │   └── UserList.tsx         # Consumes API hooks
│       ├── types/
│       │   └── index.ts             # Domain Data Types
│       └── index.ts                 # Public Barrel Export
├── services/
│   └── api/
│       └── apiClient.ts             # Base Axios / Fetch instance (Interceptors, Auth headers)

```

---

## Method 1: TanStack Query v5 (Recommended for React Ecosystem)

TanStack Query works exceptionally well with Feature-First architecture because it allows you to co-locate query options and custom hooks directly inside the feature folder.

### 1. Base API Client (`src/services/api/apiClient.ts`)

```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor to inject bearer token dynamically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

```

### 2. Feature Query & Mutation Hooks (`src/features/users/api/getUsers.ts`)

We use **Query Key Factories** to ensure query keys remain co-located, type-safe, and easy to invalidate.

```typescript
import { queryOptions, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/apiClient';
import { User, UpdateUserData } from '../types';

// 1. Feature Query Keys (Isolated to Users Domain)
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// 2. Fetcher Function
const fetchUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>('/users');
  return data;
};

// 3. Reusable Query Options
export const getUsersQueryOptions = () =>
  queryOptions({
    queryKey: userKeys.lists(),
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

// 4. Feature Custom Hook
export const useGetUsers = () => {
  return useQuery(getUsersQueryOptions());
};

// 5. Mutation Hook with Cache Invalidation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserData }): Promise<User> => {
      const response = await apiClient.patch<User>(`/users/${id}`, data);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      // Invalidate the users list cache to trigger an automatic background refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      
      // Optimistically or directly update specific detail cache
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
    },
  });
};

```

---

## Method 2: RTK Query (For Redux Toolkit Codebases)

If your team uses Redux Toolkit, **RTK Query** provides automatic endpoint generation and centralized caching. In a Feature-First structure, you can either inject endpoints dynamically or keep feature API slices modular.

### Feature API Endpoint Slice (`src/features/users/api/usersApiSlice.ts`)

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User, UpdateUserData } from '../types';

export const usersApiSlice = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'], // Used for automatic cache invalidation
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => 'users',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    updateUser: builder.mutation<User, { id: string; data: UpdateUserData }>({
      query: ({ id, data }) => ({
        url: `users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),
  }),
});

// Auto-generated React hooks exposed by RTK Query
export const { useGetUsersQuery, useUpdateUserMutation } = usersApiSlice;

```

---

## Consuming the API inside the Feature UI Component

Here is how `src/features/users/components/UserList.tsx` consumes the server state:

```tsx
import React from 'react';
import { useGetUsers, useUpdateUser } from '../api/getUsers'; // TanStack Query Hook

export const UserList: React.FC = () => {
  const { data: users, isLoading, isError, error } = useGetUsers();
  const updateUserMutation = useUpdateUser();

  if (isLoading) return <div className="p-4 text-gray-500">Loading users...</div>;
  if (isError) return <div className="p-4 text-red-500">Error: {(error as Error).message}</div>;

  const handleRoleToggle = (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    updateUserMutation.mutate({ id: userId, data: { role: newRole } });
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">User Directory</h2>
      <ul className="divide-y border rounded-md">
        {users?.map((user) => (
          <li key={user.id} className="p-3 flex justify-between items-center">
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={() => handleRoleToggle(user.id, user.role)}
              disabled={updateUserMutation.isPending}
              className="px-3 py-1 bg-slate-100 border rounded text-sm hover:bg-slate-200 disabled:opacity-50"
            >
              Role: {user.role}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

```

---

## Key Interview Talking Points (Senior/Lead Engineer Level)

1. **Separation of Client vs. Server State:**

> *"We keep client state (like active tabs or modal toggles) in Zustand/Redux, while server state (fetching, caching, and mutation lifecycle) is strictly handled by TanStack Query or RTK Query inside the feature's `api/` directory."*

1. **Cache Invalidation & Query Key Strategy:**

> *"We structure query keys using factory patterns (`userKeys.list()`, `userKeys.detail(id)`). This guarantees type safety across the application and makes automated cache invalidation after mutations predictable and bug-free."*

1. **Performance Optimization:**

> *"By using `staleTime` appropriately, TanStack Query prevents unnecessary network requests during route transitions, while `gcTime` handles background memory cleanup for unused feature data."*

Here is how **TanStack Query (React Query v5)** and **RTK Query** integrate into a **Feature-First React Architecture**.

In modern React applications, we strictly separate **Client State** (UI state, modals, theme) from **Server State** (caching, data fetching, optimistic updates). Server state management belongs inside the `api/` layer of each feature domain.

---

## Architecture Blueprint: Server State Location

```text
src/
├── features/
│   └── users/                       # Feature Domain
│       ├── api/                     # Data Fetching / Server State Layer
│       │   ├── getUsers.ts          # TanStack Query Hook/Query Option
│       │   ├── updateUser.ts        # TanStack Mutation Hook
│       │   └── usersApiSlice.ts     # RTK Query Api Slice (Alternative)
│       ├── components/
│       │   └── UserList.tsx         # Consumes API hooks
│       ├── types/
│       │   └── index.ts             # Domain Data Types
│       └── index.ts                 # Public Barrel Export
├── services/
│   └── api/
│       └── apiClient.ts             # Base Axios / Fetch instance (Interceptors, Auth headers)

```

---

## Method 1: TanStack Query v5 (Recommended for React Ecosystem)

TanStack Query works exceptionally well with Feature-First architecture because it allows you to co-locate query options and custom hooks directly inside the feature folder.

### 1. Base API Client (`src/services/api/apiClient.ts`)

```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor to inject bearer token dynamically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

```

### 2. Feature Query & Mutation Hooks (`src/features/users/api/getUsers.ts`)

We use **Query Key Factories** to ensure query keys remain co-located, type-safe, and easy to invalidate.

```typescript
import { queryOptions, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/apiClient';
import { User, UpdateUserData } from '../types';

// 1. Feature Query Keys (Isolated to Users Domain)
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// 2. Fetcher Function
const fetchUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>('/users');
  return data;
};

// 3. Reusable Query Options
export const getUsersQueryOptions = () =>
  queryOptions({
    queryKey: userKeys.lists(),
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

// 4. Feature Custom Hook
export const useGetUsers = () => {
  return useQuery(getUsersQueryOptions());
};

// 5. Mutation Hook with Cache Invalidation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserData }): Promise<User> => {
      const response = await apiClient.patch<User>(`/users/${id}`, data);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      // Invalidate the users list cache to trigger an automatic background refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      
      // Optimistically or directly update specific detail cache
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
    },
  });
};

```

---

## Method 2: RTK Query (For Redux Toolkit Codebases)

If your team uses Redux Toolkit, **RTK Query** provides automatic endpoint generation and centralized caching. In a Feature-First structure, you can either inject endpoints dynamically or keep feature API slices modular.

### Feature API Endpoint Slice (`src/features/users/api/usersApiSlice.ts`)

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User, UpdateUserData } from '../types';

export const usersApiSlice = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'], // Used for automatic cache invalidation
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => 'users',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    updateUser: builder.mutation<User, { id: string; data: UpdateUserData }>({
      query: ({ id, data }) => ({
        url: `users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),
  }),
});

// Auto-generated React hooks exposed by RTK Query
export const { useGetUsersQuery, useUpdateUserMutation } = usersApiSlice;

```

---

## Consuming the API inside the Feature UI Component

Here is how `src/features/users/components/UserList.tsx` consumes the server state:

```tsx
import React from 'react';
import { useGetUsers, useUpdateUser } from '../api/getUsers'; // TanStack Query Hook

export const UserList: React.FC = () => {
  const { data: users, isLoading, isError, error } = useGetUsers();
  const updateUserMutation = useUpdateUser();

  if (isLoading) return <div className="p-4 text-gray-500">Loading users...</div>;
  if (isError) return <div className="p-4 text-red-500">Error: {(error as Error).message}</div>;

  const handleRoleToggle = (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    updateUserMutation.mutate({ id: userId, data: { role: newRole } });
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">User Directory</h2>
      <ul className="divide-y border rounded-md">
        {users?.map((user) => (
          <li key={user.id} className="p-3 flex justify-between items-center">
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={() => handleRoleToggle(user.id, user.role)}
              disabled={updateUserMutation.isPending}
              className="px-3 py-1 bg-slate-100 border rounded text-sm hover:bg-slate-200 disabled:opacity-50"
            >
              Role: {user.role}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

```

---

## Key Interview Talking Points (Senior/Lead Engineer Level)

1. **Separation of Client vs. Server State:**

> *"We keep client state (like active tabs or modal toggles) in Zustand/Redux, while server state (fetching, caching, and mutation lifecycle) is strictly handled by TanStack Query or RTK Query inside the feature's `api/` directory."*

1. **Cache Invalidation & Query Key Strategy:**

> *"We structure query keys using factory patterns (`userKeys.list()`, `userKeys.detail(id)`). This guarantees type safety across the application and makes automated cache invalidation after mutations predictable and bug-free."*

1. **Performance Optimization:**

> *"By using `staleTime` appropriately, TanStack Query prevents unnecessary network requests during route transitions, while `gcTime` handles background memory cleanup for unused feature data."*

Here is your System Design mock interview scenario for a **Lead / Senior Front-End Engineer**.

---

### **Mock Interview Scenario**

> **Interviewer:**
> *"Let's design a high-scale, real-time **Enterprise Project & Resource Management Dashboard** (similar to Jira or Asana) from scratch.
> The platform will be used by tens of thousands of enterprise employees concurrently. Key requirements include:
>
> 1. A complex interactive Kanban board / Gantt chart with drag-and-drop capabilities.
> 2. Real-time updates (multi-user collaboration on tasks).
> 3. Granular Role-Based Access Control (RBAC).
> 4. Fast initial page load (< 1.5s LCP) globally, even for users with massive project datasets.
>
>
> Walk me through your end-to-end front-end architecture. How would you structure the technology stack, application architecture, state management, real-time strategy, performance optimization, and security?"*

---

### **Suggested Answer Structure (Use this framework to respond):**

1. **Tech Stack Selection & Rendering Strategy:** Choice of framework (React/Next.js), rendering modes (SSR, RSC, Client), and core libraries.
2. **Architecture & Directory Design:** How you group modules, enforce boundaries, and manage shared packages.
3. **State Management & Data Layer:** How you separate client state vs. server state, handle real-time sync (WebSockets / SSE), and manage dynamic cache invalidation.
4. **Performance & Optimization:** Virtualization for massive DOM trees, bundle management, image/asset delivery, and CWV strategies.
5. **Security & Resiliency:** Auth, token storage, RBAC, offline support/PWA, and error handling.

---

**Take your time and present your system design architecture in your own words.**

How you group modules, enforce boundaries, and manage shared packages.

When architecting a high-scale enterprise platform like a Jira/Asana-style dashboard, modularity and boundary enforcement are critical to keep compile times fast, prevent accidental coupling, and allow multiple squads to ship independently.

Here is how I structure module grouping, boundary enforcement, and shared package management for an enterprise React application.

---

## 1. Monorepo Architecture & Package Strategy

For an enterprise app with multiple sub-applications (e.g., Main App, Admin Portal, Design System Docs, Analytics Engine), I use a **Monorepo** managed by **Turborepo** or **Nx** with **pnpm workspaces**.

```text
my-enterprise-monorepo/
├── apps/
│   ├── web-app/                  # Primary Next.js / React application
│   └── admin-portal/             # Admin / Organization management app
├── packages/
│   ├── ui/                       # Shared Headless UI / Design System (Shadcn/Tailwind)
│   ├── tsconfig/                 # Shared TypeScript configurations
│   ├── eslint-config/            # Enforced linting rules & architectural boundaries
│   ├── api-client/               # Auto-generated OpenAPI / GraphQL SDK client
│   └── utils/                    # Shared pure JS/TS helper functions

```

### Why pnpm + Turborepo?

* **pnpm Workspaces:** Enforces strict dependency resolution. Undeclared transitive dependencies cannot be imported, preventing ghost dependencies across packages.
* **Turborepo / Nx:** Provides remote caching and graph-aware build execution. If squad A makes a change to `apps/admin-portal`, CI skips rebuilding `packages/ui` if its inputs haven't changed.

---

## 2. Feature-First Internal Module Grouping

Inside the main application (`apps/web-app/src`), modules are grouped by **Business Domains / Features** rather than technical layers.

```text
src/
├── features/
│   ├── kanban/                   # Kanban Board Feature Module
│   │   ├── api/                  # TanStack Query / WebSocket listeners
│   │   ├── components/           # Board, Column, Card components
│   │   ├── hooks/                # Drag-and-drop / Virtualization hooks
│   │   ├── store/                # Local board Zustand slice
│   │   ├── types/                # TypeScript interfaces for cards/columns
│   │   └── index.ts              # Public API / Barrel file
│   ├── gantt/                    # Gantt Chart Feature Module
│   └── notifications/            # Real-time notifications feature
├── shared/                       # App-specific shared components (Header, Sidebar)
└── routes/                       # Next.js App Router or React Router definitions

```

---

## 3. Strict Boundary Enforcement Strategies

Without strict boundaries, developers will inevitably import internal details across features (e.g., `features/gantt` importing `features/kanban/components/internal/CardModal.tsx`), leading to circular dependencies and spaghetti code.

To prevent this, I enforce three levels of boundaries:

### A. Public API via Barrel Files (`index.ts`)

Each feature module exposes an explicit `index.ts` barrel file. External modules are **only** permitted to import what is exported here.

```typescript
// src/features/kanban/index.ts (Public Interface)
export { KanbanBoard } from './components/KanbanBoard';
export { useKanbanStore } from './store/useKanbanStore';
export type { KanbanCard, ColumnId } from './types';

// Internal components like CardModal or ColumnHeader are NOT exported here.

```

### B. Automated ESLint Boundary Rules (`eslint-plugin-boundaries` / `no-restricted-imports`)

We enforce path restriction rules at the linter level so pull requests fail automatically if a developer violates architectural boundaries.

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['boundaries'],
  rules: {
    'boundaries/element-types': [
      2,
      {
        default: 'disallow',
        rules: [
          // Features can only import from shared packages or their own folder
          {
            from: ['feature'],
            allow: ['shared', ['feature', { featureName: '${from.featureName}' }]],
          },
          // Shared components can NEVER import from features
          {
            from: ['shared'],
            allow: ['shared'],
          },
        ],
      },
    ],
    // Block deep internal imports
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@/features/*/*/**'],
            message: 'Deep imports are forbidden. Import from the feature index barrel file instead.',
          },
        ],
      },
    ],
  },
};

```

### C. TypeScript Path Aliases

We configure clean TS aliases in `tsconfig.json` to prevent relative path hell (`../../../../`):

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/features/*": ["src/features/*"],
      "@/shared/*": ["src/shared/*"],
      "@enterprise/ui": ["../../packages/ui/src"]
    }
  }
}

```

---

## 4. Managing & Versioning Shared Packages

In a large team setup, shared packages like the UI Design System or API SDK require deliberate dependency management:

1. **Version Control Strategy:**

* **Monorepo (Single Repository):** All internal packages use fixed versioning (`"workspace:*"` in `package.json`). Any update to `packages/ui` immediately propagates across all apps without publishing to a private npm registry.
* **Changesets:** If shared packages are published externally for other teams, we use `@changesets/cli` to automate semantic versioning (SemVer) and changelog generation.

1. **Decoupling Business Logic from Shared UI:**

* `packages/ui` contains **strictly headless / unstyled / presentation components** (Button, Modal, Dropdown, Table). It has zero knowledge of API models, user session state, or business logic.
* Business-specific UI compositions live inside `features/*`.

---

### **How this answers the interviewer's prompt:**

> *"By pairing a **Turborepo monorepo** with **Feature-First modularization**, we isolate domain logic into autonomous folders. We enforce explicit public APIs via `index.ts` files and lock down cross-feature coupling using **`eslint-plugin-boundaries`**. This guarantees that 20+ front-end developers can work concurrently without stepping on each other's toes or causing circular dependency bottlenecks."*

How you separate client state vs. server state, handle real-time sync (WebSockets / SSE), and manage dynamic cache invalidation

For a high-scale collaborative enterprise platform (like Jira or Asana) operating with high concurrent usage, the data architecture must be strictly split into **Client State** vs. **Server State**, backed by an event-driven real-time sync mechanism.

Here is how I architect the state management and data layer.

---

## 1. Strict Separation: Client State vs. Server State

Mixing UI state with server data leads to stale UI, race conditions, and massive re-render storms. I separate them into two distinct operational layers:

```
                          ┌────────────────────────────────────────────────────────┐
                          │                   React Application                    │
                          └───────────────────────────┬────────────────────────────┘
                                                      │
                       ┌──────────────────────────────┴──────────────────────────────┐
                       ▼                                                             ▼
         ┌───────────────────────────┐                                 ┌───────────────────────────┐
         │   Client / Local State    │                                 │   Server / Remote State   │
         │     (Zustand / Jotai)     │                                 │      (TanStack Query)     │
         └─────────────┬─────────────┘                                 └─────────────┬─────────────┘
                       │                                                             │
         • Active modal / drawer toggles                               • Infinite query caches (Board Cards)
         • Drag-and-drop live coordinates                              • Optimistic UI mutations
         • Sidebar expanded state                                      • Normalized entity caches
         • User theme / preferences                                    • Garbage collection & background refetch

```

### A. Client State Layer (Zustand / Atomic Stores)

* **Tool:** **Zustand** (or **Jotai** for fine-grained atomic state).
* **Responsibility:** Purely local UI state that does not persist on the backend (e.g., active filter panels, open modals, active view mode—List vs. Kanban vs. Gantt, or live drag coordinates during card dragging).
* **Why not Redux for everything?** Client state requires light boilerplate and fast execution. Zustand’s atomic selectors ensure components only re-render when their specific slice changes, keeping frame rates at 60fps during UI interactions.

### B. Server State Layer (TanStack Query v5)

* **Tool:** **TanStack Query** (React Query).
* **Responsibility:** Remote asynchronous state—fetching, caching, deduplicating, re-fetching, and background cache synchronization.
* **Key Mechanisms:**
* **Query Key Factories:** Standardized key paths like `['projects', projectId, 'kanban', { status }]`.
* **Stale Time vs. GC Time:** Configured with a `staleTime: 30000` (30 seconds) and `gcTime: 10 * 60 * 1000` (10 minutes) to eliminate redundant network fetches while users switch back and forth between dashboard tabs.

---

## 2. Real-Time Synchronization Strategy (WebSockets + SSE)

To support live collaboration (e.g., User A moves a Kanban card, User B sees it move instantly without refreshing), I use a **Hybrid Real-Time Architecture**:

```
                       ┌──────────────────────────────────────────────┐
                       │           Real-Time Data Engine              │
                       └──────┬────────────────────────────────┬──────┘
                              │                                │
                              ▼                                ▼
                 ┌─────────────────────────┐      ┌─────────────────────────┐
                 │    Server-Sent Events   │      │       WebSockets        │
                 │          (SSE)          │      │     (Socket.io / WS)    │
                 └────────────┬────────────┘      └────────────┬────────────┘
                              │                                │
                 • One-way server push             • Two-way interactive sync
                 • Live notifications              • Live drag-and-drop updates
                 • Global audit updates            • Active user presence/cursors

```

### A. Dual Transport Channels

1. **Server-Sent Events (SSE):** Used for **one-way server-to-client notifications** (e.g., globally updated project attributes, user mention alerts). SSE is HTTP-native, automatically reconnects, and bypasses enterprise proxy/firewall websocket blocks.
2. **WebSockets (Socket.io / Native WS):** Used for **two-way interactive collaboration** (e.g., moving cards across columns, active user presence cursors, or live rich-text comment edits).

### B. Ingesting Real-Time Events into TanStack Query Cache

Rather than storing WebSocket payload directly inside global React state, the WebSocket listener directly **mutates or invalidates the TanStack Query cache**:

```typescript
// src/features/kanban/api/useKanbanSocketSync.ts
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { socket } from '@/services/socket';
import { kanbanKeys } from './kanbanKeys';

export const useKanbanSocketSync = (projectId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.connect();
    socket.emit('project:subscribe', { projectId });

    // Event 1: Precise Cache Update (Patching)
    socket.on('card:moved', (payload: { cardId: string; newColumnId: string; newIndex: number }) => {
      queryClient.setQueryData(kanbanKeys.board(projectId), (oldData: BoardData | undefined) => {
        if (!oldData) return oldData;
        return updateCardPositionInCache(oldData, payload);
      });
    });

    // Event 2: Coarse Cache Invalidation (Refetching)
    socket.on('project:settingsUpdated', () => {
      queryClient.invalidateQueries({ queryKey: kanbanKeys.project(projectId) });
    });

    return () => {
      socket.emit('project:unsubscribe', { projectId });
      socket.disconnect();
    };
  }, [projectId, queryClient]);
};

```

---

## 3. Dynamic Cache Invalidation & Optimistic Updates

For enterprise-grade UX, interactions like dragging a card must feel instantaneous (0ms latency), even before the server acknowledges the change.

### A. Optimistic UI Updates with Rollback

When a user updates an item (e.g., changes a card's priority or moves it across columns), we execute an **Optimistic Mutation Pipeline**:

```
[User Action] ──► Cancel Active Queries ──► Snapshot Previous Cache ──► Mutate Cache Optimistically (0ms)
                                                                                  │
                                            ┌─────────────────────────────────────┴─────────────────────────────────────┐
                                            ▼                                                                           ▼
                                  [API Request Succeeds]                                                      [API Request Fails]
                                            │                                                                           │
                                 Settled: Re-sync in background                                          Rollback to Snapshot + Trigger Toast

```

```typescript
// src/features/kanban/api/useMoveCardMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { moveCardApi } from './kanbanApi';
import { kanbanKeys } from './kanbanKeys';

export const useMoveCardMutation = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: moveCardApi,

    // 1. Triggered immediately before network call
    onMutate: async (newCardPosition) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: kanbanKeys.board(projectId) });

      // Snapshot the previous cache value for rollback
      const previousBoard = queryClient.getQueryData<BoardData>(kanbanKeys.board(projectId));

      // Optimistically update the cache
      queryClient.setQueryData(kanbanKeys.board(projectId), (old) =>
        applyOptimisticMove(old, newCardPosition)
      );

      // Return context containing snapshot
      return { previousBoard };
    },

    // 2. If the API request fails, rollback to previous snapshot
    onError: (err, newCardPosition, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(kanbanKeys.board(projectId), context.previousBoard);
      }
      showToast({ title: 'Move failed', type: 'error' });
    },

    // 3. Always refetch in background after error or success to ensure 100% server sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: kanbanKeys.board(projectId) });
    },
  });
};

```

### B. Smart Cache Invalidation Strategies

To prevent triggering massive API refetch cascades that crush the backend:

1. **Targeted Invalidation via Query Key Hierarchy:**

* Invalidate strictly `['projects', id, 'kanban']` rather than globally invalidating `['projects']`.

1. **Debounced Socket Refreshing:**

* If 50 users are editing a board concurrently, we wrap incoming WebSocket invalidation events in a `debounce` or `throttle` (e.g., max 1 refetch per 2 seconds per query key).

1. **Structured Mutation Tags (Exact match):**

* Use `{ exact: true }` during invalidation calls to avoid accidentally wiping out unrelated child query caches.

---

### **How to deliver this in the interview:**

> *"I separate client state (managed locally by **Zustand** for zero-latency UI interactions) from server state (managed by **TanStack Query** for caching and deduplication). For collaboration, I ingest real-time events via **WebSockets/SSE**, directly patching or invalidating the TanStack Query cache. To make the board feel instantaneous, all mutations execute **optimistic updates with snapshot rollbacks**, ensuring a resilient 0ms perception of speed even under unstable network conditions."*

Performance & Optimization (Virtualization for massive DOM trees, bundle management, and Core Web Vitals).

In a high-scale enterprise dashboard like Jira or Asana, rendering hundreds of interactive Kanban cards, Gantt chart timeline nodes, or multi-nested task trees can paralyze the browser’s main thread if not architected with care.

Here is how I architect **Performance & Optimization** across **Virtualization**, **Bundle Strategy**, and **Core Web Vitals**.

---

## 1. DOM & List Virtualization (Handling 10,000+ Items)

Rendering 5,000+ DOM nodes causes severe main-thread lag, high memory consumption, and sluggish scroll performance. I enforce **Viewport Virtualization** so that only items currently visible on screen (plus a small buffer) exist in the DOM.

```text
                        ┌───────────────────────────────────────────────┐
                        │              Virtual Viewport                 │
                        ├───────────────────────────────────────────────┤
  Off-screen (Unrendered)│  [ Item 1 ] (Height reserved in buffer)      │
                        ├───────────────────────────────────────────────┤
                        │  [ Buffer Top ]                               │
                        │  [ Visible Item 10 ]                          │
  Rendered Window (~15) │  [ Visible Item 11 ]                          │
                        │  [ Visible Item 12 ]                          │
                        │  [ Buffer Bottom ]                            │
                        ├───────────────────────────────────────────────┤
  Off-screen (Unrendered)│  [ Item 1000 ] (Height reserved in buffer)   │
                        └───────────────────────────────────────────────┘

```

### A. Dynamic Windowing Engine

* **Tool:** **`@tanstack/react-virtual`** (or `react-window`).
* **Implementation:**
* **2D Windowing for Gantt Charts:** Virtualizing both horizontal time tracks (X-axis) and vertical task rows (Y-axis) simultaneously.
* **Dynamic Height Measurement:** Task descriptions or card tags vary in length. `@tanstack/react-virtual` dynamically calculates heights on the fly using `measureElement` rather than forcing fixed heights.

```tsx
// src/features/kanban/components/VirtualColumn.tsx
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { KanbanCard } from './KanbanCard';
import { Task } from '../types';

export const VirtualColumn = ({ tasks }: { tasks: Task[] }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 110, // Estimated card height in pixels
    overscan: 5, // Buffer elements to render outside viewport for smooth scrolling
  });

  return (
    <div ref={parentRef} className="h-[calc(100vh-200px)] overflow-auto rounded-lg">
      <div
        className="w-full relative"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const task = tasks[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              ref={rowVirtualizer.measureElement}
              data-index={virtualItem.index}
              className="absolute top-0 left-0 w-full"
              style={{
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <KanbanCard task={task} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

```

### B. Drag-and-Drop (DnD) Virtualization Safety

* **Challenge:** Dragging an item outside the virtual window unmounts it from the DOM, breaking native drag states.
* **Solution:** Integrate `@hello-pangea/dnd` (or `@dnd-kit`) with virtual lists by freezing virtualizer layout calculations during an active drag, maintaining DOM stability while dragging cards between columns.

---

## 2. Enterprise Bundle Management & Code-Splitting

To keep initial load time low, we must ensure users only download the JavaScript required for their initial viewport.

```text
                                  ┌─────────────────────────┐
                                  │   Initial Entry Bundle  │
                                  │  (Next.js App Core / TS)│
                                  └────────────┬────────────┘
                                               │
               ┌───────────────────────────────┼───────────────────────────────┐
               ▼                               ▼                               ▼
    ┌────────────────────┐          ┌────────────────────┐          ┌────────────────────┐
    │  Route-Based Chunk │          │  Route-Based Chunk │          │  Route-Based Chunk │
    │   /dashboard/home  │          │  /dashboard/kanban │          │  /dashboard/gantt  │
    └────────────────────┘          └──────────┬─────────┘          └────────────────────┘
                                               │
                                               ▼ (Dynamic Load on Interaction)
                                    ┌────────────────────┐
                                    │ Heavy Sub-Module   │
                                    │ (Chart.js/Monaco)  │
                                    └────────────────────┘

```

### A. Multi-Layer Code Splitting

1. **Route-Based Splitting:** Handled natively by **Next.js App Router** server-side boundaries or `React.lazy` route dynamic imports.
2. **Feature-Level Dynamic Imports:** Heavy, non-critical sub-components (e.g., Rich Text Comment Editors, Export PDF Modal, Analytics Charts) are lazily loaded using `next/dynamic` or `React.lazy`:

```typescript
// Dynamically imported only when user opens the Card Detail Modal
const RichTextEditor = dynamic(
  () => import('@/shared/components/RichTextEditor').then((mod) => mod.RichTextEditor),
  {
    loading: () => <SkeletonEditor />,
    ssr: false, // Client-side execution only
  }
);

```

### B. Dependency Optimization & Tree-Shaking

* **Barrel File Elimination:** Instead of importing monolithic barrel packages (`import { Button } from 'lucide-react'`), configure Next.js `optimizePackageImports` in `next.config.js` to ensure the bundler tree-shakes unused icons/components.
* **Moment.js/Lodash Audit:** Replace heavy legacy utilities with `date-fns` and native JS ES2024 methods (`Array.prototype.groupBy`, `structuredClone`).
* **Bundle Analysis Gatekeeping:** Integrate `@next/bundle-analyzer` into the CI/CD pipeline. Build failures trigger if the main thread entry point exceeds a strict **150 KB gzipped threshold**.

---

## 3. Core Web Vitals (CWV) Optimization Strategy

| CWV Metric                           | Target   | Bottleneck in Enterprise Dashboards                                 | Architectural Solution                                               |
| ------------------------------------ | -------- | ------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **LCP** *(Largest Contentful Paint)* | `< 1.2s` | Large initial dashboard data payload & unoptimized layout rendering | • Render static shell via Next.js React Server Components (RSC).<br> |

<br>• Stream data via `Suspense` boundaries.<br>

<br>• Preconnect API origins (`<link rel="preconnect">`). |
| **INP** *(Interaction to Next Paint)* | `< 100ms` | Main-thread blocking during complex board re-renders or sorting | • Offload data processing to **Web Workers**.<br>

<br>• Defer low-priority state updates with `startTransition`.<br>

<br>• Atomic state selectors via Zustand. |
| **CLS** *(Cumulative Layout Shift)* | `0.00` | Dynamic widgets, charts, and skeleton layout jumps | • Reserve explicit aspect-ratio dimensions on virtualized lists.<br>

<br>• Self-host fonts via `next/font`.<br>

<br>• Zero layout shift skeleton placeholders. |

---

## 4. Offloading Computation: Web Workers & Concurrent React

### A. Web Workers for Heavy Data Processing

Sorting, filtering, or processing thousands of Gantt chart dependencies directly on the main UI thread freezes the browser (causing poor INP). I offload complex array manipulation to a background Web Worker using **Comlink**:

```typescript
// src/features/gantt/workers/ganttDataWorker.ts
import * as Comlink from 'comlink';

export const ganttWorker = {
  calculateCriticalPath: (tasks: Task[], dependencies: Dependency[]) => {
    // Heavy graph traversal algorithm (Topological sort) executed in background thread
    return performCriticalPathCalculation(tasks, dependencies);
  },
};

Comlink.expose(ganttWorker);

```

### B. Concurrent React (`useTransition` & `useDeferredValue`)

To prevent keyboard input lag when a user types into a instant-search filter across 2,000 tasks:

```tsx
// Interruptible UI updates keep typing smooth
const [filterText, setFilterText] = useState('');
const deferredFilterText = useDeferredValue(filterText); // Non-blocking filter pass

const filteredTasks = useMemo(() => {
  return tasks.filter((t) => t.title.includes(deferredFilterText));
}, [tasks, deferredFilterText]);

```

---

### **How to deliver this in the interview:**

> *"To handle massive enterprise datasets, I apply a three-pillar performance strategy: First, **Viewport Virtualization** via `@tanstack/react-virtual` ensures we only render what's visible, keeping DOM nodes low even with 10,000+ items. Second, **Multi-Layer Code-Splitting** keeps initial bundles under 150 KB, dynamically importing heavy components like rich-text editors or charts on demand. Finally, to achieve **sub-100ms INP**, I offload intensive tasks like Gantt critical-path calculations to **Web Workers**, using React Concurrent features (`useTransition`, `useDeferredValue`) so typing and interactions never feel laggy."*
>
Security & Resiliency (Auth, RBAC, PWA/Offline, Error Boundaries)?

Here is the final piece of the architecture, focusing on **Security, Authorization, Resiliency, and Fault Tolerance**.

---

## 1. OAuth2 / JWT Session Handling & Security Architecture

In an enterprise front-end, storing access tokens in `localStorage` or `sessionStorage` exposes the application to **Cross-Site Scripting (XSS)** vulnerabilities. We use a secure, token-rotation architecture:

```text
  ┌─────────────────────────┐               ┌───────────────────────────┐               ┌─────────────────────────┐
  │   Client Application    │               │    BFF / API Gateway      │               │   Auth Server (OAuth2)  │
  └────────────┬────────────┘               └─────────────┬─────────────┘               └────────────┬────────────┘
               │                                          │                                          │
               │  1. Login Request                        │                                          │
               ├─────────────────────────────────────────►│  2. Authenticate                         │
               │                                          ├─────────────────────────────────────────►│
               │                                          │  3. Return Refresh Token & Access Token  │
               │                                          │◄─────────────────────────────────────────┤
               │  4. Set HttpOnly Cookie (Refresh Token)  │                                          │
               │     & Return Access Token in Memory      │                                          │
               │◄─────────────────────────────────────────┤                                          │
               │                                          │                                          │

```

### A. Token Storage & Lifecycle Strategy

1. **Access Token (Short-lived, ~15 mins):** Stored strictly **in JavaScript memory** (variable/Zustand state). Never written to `localStorage` or `cookies`.
2. **Refresh Token (Long-lived, ~7 days):** Stored in an **`HttpOnly`, `SameSite=Strict`, `Secure` Cookie** managed by the Backend-For-Frontend (BFF) or API Gateway. JavaScript cannot access this cookie, completely neutralizing XSS token theft.

### B. Axios Silent Refresh & Request Queueing Interceptor

When an access token expires mid-session, concurrent API requests must be queued while a single token refresh executes seamlessly in the background.

```typescript
// src/services/api/apiClient.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Sends HttpOnly Refresh Cookie automatically
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // BFF Endpoint that reads the HttpOnly Cookie and returns a new Access Token
        const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        const newAccessToken = data.accessToken;

        // Update in-memory token state
        setInMemoryAccessToken(newAccessToken);
        apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Force session termination and redirect to login
        window.location.href = '/login?session_expired=true';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

```

---

## 2. Fine-Grained Role-Based Access Control (RBAC) & ABAC

Enterprise platforms require both **Role-Based (RBAC)** (e.g., `Admin`, `ProjectManager`, `Viewer`) and **Attribute-Based (ABAC)** controls (e.g., *"Users can edit tasks ONLY if they are the assigned author or if the project status is Active"*).

### A. CASL-Based Declarative Permission Engine

We use `@casl/react` to centralize permission logic cleanly across components and hooks:

```typescript
// src/services/auth/permissions.ts
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { User } from '@/features/auth/types';

export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';
export type Subjects = 'Task' | 'Project' | 'User' | 'all';

export const defineAbilityFor = (user: User) => {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (user.role === 'admin') {
    can('manage', 'all'); // Admin can do everything
  } else if (user.role === 'project_manager') {
    can('create', 'Task');
    can('update', 'Task');
    can('read', 'Project');
  } else {
    // Standard User (ABAC Rule)
    can('read', 'Task');
    can('update', 'Task', { assigneeId: user.id }); // Can only update assigned tasks
    cannot('delete', 'Task');
  }

  return build();
};

```

### B. Declarative Authorization Wrapper Component

```tsx
// src/shared/components/Can.tsx
import { createContextualCan } from '@casl/react';
import { AbilityContext } from '@/services/auth/AbilityContext';

export const Can = createContextualCan(AbilityContext.Consumer);

// Usage inside Kanban Card Component:
<Can I="delete" a="Task" passThrough>
  {(allowed) => (
    <button disabled={!allowed} onClick={handleDelete} className={allowed ? 'text-red-500' : 'opacity-30'}>
      Delete Task
    </button>
  )}
</Can>

```

---

## 3. Resiliency & Offline PWA Strategy

Enterprise users in high-scale environments face intermittent network connectivity. We implement a **PWA + Cache-First / Network-First Strategy** backed by **IndexedDB**.

```text
                                 ┌───────────────────────────┐
                                 │   Service Worker (Workbox)│
                                 └─────────────┬─────────────┘
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       ▼                                               ▼
         ┌───────────────────────────┐                   ┌───────────────────────────┐
         │       Workbox Cache       │                   │    Background Sync Queue  │
         │ (Static Shell & Assets)   │                   │   (Offline Write Store)   │
         └───────────────────────────┘                   └─────────────┬─────────────┘
                                                                       │ (When Network Reconnects)
                                                                       ▼
                                                         ┌───────────────────────────┐
                                                         │   Replay Mutated Payloads │
                                                         └───────────────────────────┘

```

### A. Workbox Caching Rules

* **Static Assets (JS/CSS/Fonts):** `CacheFirst` strategy with long-term expiration hashes.
* **Navigation Shell (HTML):** `StaleWhileRevalidate` strategy to load instantly while checking for updates in the background.
* **API Data Queries:** `NetworkFirst` with a 3-second timeout falling back to cached IndexedDB response.

### B. Offline Queue & Background Synchronization

When a user updates a task offline:

1. Optimistically update local Zustand UI state and TanStack Query cache.
2. Intercept the HTTP write request and queue it in **IndexedDB** using `workbox-background-sync`.
3. When internet connectivity restores, the Service Worker automatically replays queued mutations in chronological order with conflict-resolution strategies.

---

## 4. Multi-Layer Error Boundaries & Observability

A single JavaScript error in a widget must **never** crash the entire application dashboard. We build a granular, multi-layer **Error Boundary Architecture**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Root Error Boundary (Catches catastrophic routing & runtime crashes)      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 2. Feature-Level Boundaries (Catches Kanban / Gantt rendering errors) │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │ 3. Widget-Level Boundaries (Isolates single comment or chart)   │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

```

### Widget-Level Granular Error Boundary

```tsx
// src/shared/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Sentry } from '@/services/monitoring/sentry';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  resetKey?: string; // Reset boundary when route/context changes
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log exception to telemetry platforms (e.g., Sentry, Datadog)
    Sentry.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 border border-red-200 bg-red-50 rounded-md text-sm text-red-700 flex justify-between items-center">
            <span>Widget failed to load.</span>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-2 py-1 bg-red-100 border border-red-300 rounded text-xs hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

```

---

## Complete System Architecture Summary (Closing Pitch)

> *"To summarize our end-to-end Front-End System Architecture:*
>
> 1. **Modularity & Governance:** Powered by a **Turborepo monorepo** with a **Feature-First folder structure**. Boundary rules are strictly enforced using ESLint and public `index.ts` barrel files.
> 2. **State & Real-Time Data:** Cleanly splits **Zustand (Client State)** and **TanStack Query (Server State)**, synchronized live via **WebSockets/SSE** with 0ms **optimistic updates and rollback snapshots**.
> 3. **Performance Engine:** Uses **`@tanstack/react-virtual`** for dynamic 2D/1D list windowing, keeps initial bundles under **150 KB** via route and feature code-splitting, and offloads heavy graph calculations to **Web Workers**.
> 4. **Security & Resiliency:** Protects session security with **short-lived in-memory access tokens** paired with **`HttpOnly` refresh cookies**, enforces fine-grained **CASL RBAC/ABAC rules**, enables **PWA offline mutation queuing**, and isolates component failures using **nested Error Boundaries**."*
>
>