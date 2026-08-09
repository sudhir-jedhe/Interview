Here is a comprehensive compilation of **Redux and Redux Toolkit (RTK)** interview questions, structured from core concepts to advanced production patterns.

---

### 1. Core Concepts & Architecture

#### Q1: What is Redux, and what are its Three Core Principles?

**Answer:**
Redux is a predictable state container for JavaScript apps based on the Flux architecture. Its three guiding principles are:

1. **Single Source of Truth:** The global state of the entire application is stored in an object tree within a single Redux **Store**.
2. **State is Read-Only:** The only way to change the state is to emit (dispatch) an **Action** (a plain JavaScript object describing what happened).
3. **Changes are Made with Pure Functions:** To specify how the state tree is transformed by actions, you write pure functions called **Reducers**.

#### Q2: How does the Redux Data Flow work?

**Answer:**
Redux follows a strict **Unidirectional Data Flow**:

```text
[ View / Component ] ──► (Dispatches) ──► [ Action ]
        ▲                                    │
        │                                    ▼
[ State Updated ] ◄── (New State) ◄── [ Reducer ]

```

1. **Event Trigger:** User interacts with the UI (e.g., clicks a button).
2. **Dispatch Action:** The UI component dispatches an action: `dispatch({ type: 'cart/addItem', payload: item })`.
3. **Reducer Execution:** The store passes the current state tree and the action to the reducer function.
4. **State Calculation:** The reducer computes the *next* state immutably and returns it.
5. **UI Rerender:** The store notifies subscriber components (via `useSelector`), triggering UI updates where state changed.

---

### 2. Redux vs. Redux Toolkit (RTK)

#### Q3: Why was Redux Toolkit (RTK) introduced, and how does it differ from "Classic Redux"?

**Answer:**
Classic Redux was heavily criticized for boilerplate code, complex setup, and requiring too many external packages (e.g., `redux-thunk`, `immer`, `redux-devtools-extension`).

RTK is the official, opinionated standard way to write Redux logic today.

| Feature                | Classic Redux                                                              | Redux Toolkit (RTK)                                                                  |
| ---------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Store Setup**        | `createStore(combineReducers(...), applyMiddleware(...))`                  | `configureStore({ reducer: { ... } })` (Includes DevTools & Thunk by default)        |
| **Actions & Reducers** | Separately defined action types, action creators, and switch-case reducers | `createSlice()` generates actions and reducers together                              |
| **Immutability**       | Manual object spreading (`...state`)                                       | Uses **Immer** internally; allows writing direct mutable syntax (`state.value += 1`) |
| **Async Logic**        | Requires manually adding `redux-thunk` or `redux-saga`                     | Native `createAsyncThunk` and **RTK Query**                                          |

#### Q4: How does Immer work inside Redux Toolkit slices?

**Answer:**
Inside RTK's `createSlice`, **Immer** wraps state modifications in a `Proxy`. This allows developers to write code that looks like direct mutation (e.g., `state.todos.push(newTodo)` or `state.user.name = 'John'`). Immer tracks these operations and produces a fresh, immutable state object behind the scenes.

*Note: You must either mutate the existing draft state OR return a new state object—never both in the same reducer.*

---

### 3. Middleware & Asynchronous Logic

#### Q5: What is Redux Middleware, and what are its common use cases?

**Answer:**
Middleware provides a third-party extension point between dispatching an action and the moment it reaches the reducer. It intercepts actions to perform side effects.

**Common Use Cases:**

* Asynchronous API requests (`redux-thunk`, `redux-saga`).
* Logging and Analytics (`redux-logger`).
* Routing/Navigation triggers.
* Persisting state to `localStorage`.

#### Q6: How does `createAsyncThunk` handle lifecycle states?

**Answer:**
`createAsyncThunk` generates a thunk action creator that dispatches three action types automatically based on a returned Promise:

1. **`pending`**: Dispatched immediately when the thunk starts (e.g., set `loading = true`).
2. **`fulfilled`**: Dispatched when the Promise resolves successfully (e.g., update `data`, set `loading = false`).
3. **`rejected`**: Dispatched when the Promise rejects or throws an error (e.g., set `error = payload`, set `loading = false`).

These are handled inside a slice's **`extraReducers`** builder callback.

---

### 4. Performance & Selectors

#### Q7: What are Selectors and how does `createSelector` (Reselect) optimize performance?

**Answer:**
Selectors are functions used to extract or derive specific pieces of state from the store.

* **Problem:** Using `useSelector` with inline calculations (e.g., `state.todos.filter(...)`) causes the calculation to run on *every single render* and returns a new array reference, triggering unnecessary component re-renders.
* **Solution:** `createSelector` (from Reselect/RTK) creates **memoized selectors**. It recalculates derived state **only when its input arguments change**.

```javascript
import { createSelector } from '@reduxjs/toolkit';

const selectTodos = (state) => state.todos;
const selectFilter = (state) => state.filter;

// Memoized Selector
export const selectCompletedTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => todos.filter((todo) => todo.completed && todo.category === filter)
);

```

---

### 5. Advanced & RTK Query

#### Q8: What is RTK Query, and how does it differ from standard Redux thunks?

**Answer:**
**RTK Query** is an advanced data-fetching and caching tool built into Redux Toolkit. While `createAsyncThunk` requires you to manually manage loading states, error states, and storage reducers for every endpoint, RTK Query automates the entire network layer.

**Key Features of RTK Query:**

* **Automatic Cache Management:** Caches responses based on query arguments.
* **De-duplication:** Prevents duplicate network requests for the same data across multiple components.
* **Normalized Caching & Invalidation:** Uses "Tags" (`providesTags` / `invalidatesTags`) to automatically refetch data when mutations occur.
* **Auto-generated Hooks:** Generates custom React hooks (e.g., `useGetUsersQuery()`, `useUpdateUserMutation()`).

---

### Quick Interview Cheat Sheet

| Question Theme                         | Core Keyword / Key Phrase                                                                                                                              |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Why Redux over Context API?**        | Context is for dependency injection; Redux provides **memoized updates, devtools debugging, and middleware support** for high-frequency state updates. |
| **How to clear state on logout?**      | Reset the root reducer state to `undefined` inside a root action handler.                                                                              |
| **What is normalized state?**          | Storing items as objects with IDs as keys (`byId: { 1: {...} }, allIds: [1]`) like a database table to avoid nested object lookups.                    |
| **Can you dispatch inside a Reducer?** | **No.** Reducers must be pure functions with zero side effects.                                                                                        |

Here is a comprehensive compilation of **Redux and Redux Toolkit (RTK)** interview questions, structured from core concepts to advanced production patterns.

---

### 1. Core Concepts & Architecture

#### Q1: What is Redux, and what are its Three Core Principles?

**Answer:**
Redux is a predictable state container for JavaScript apps based on the Flux architecture. Its three guiding principles are:

1. **Single Source of Truth:** The global state of the entire application is stored in an object tree within a single Redux **Store**.
2. **State is Read-Only:** The only way to change the state is to emit (dispatch) an **Action** (a plain JavaScript object describing what happened).
3. **Changes are Made with Pure Functions:** To specify how the state tree is transformed by actions, you write pure functions called **Reducers**.

#### Q2: How does the Redux Data Flow work?

**Answer:**
Redux follows a strict **Unidirectional Data Flow**:

```text
[ View / Component ] ──► (Dispatches) ──► [ Action ]
        ▲                                    │
        │                                    ▼
[ State Updated ] ◄── (New State) ◄── [ Reducer ]

```

1. **Event Trigger:** User interacts with the UI (e.g., clicks a button).
2. **Dispatch Action:** The UI component dispatches an action: `dispatch({ type: 'cart/addItem', payload: item })`.
3. **Reducer Execution:** The store passes the current state tree and the action to the reducer function.
4. **State Calculation:** The reducer computes the *next* state immutably and returns it.
5. **UI Rerender:** The store notifies subscriber components (via `useSelector`), triggering UI updates where state changed.

---

### 2. Redux vs. Redux Toolkit (RTK)

#### Q3: Why was Redux Toolkit (RTK) introduced, and how does it differ from "Classic Redux"?

**Answer:**
Classic Redux was heavily criticized for boilerplate code, complex setup, and requiring too many external packages (e.g., `redux-thunk`, `immer`, `redux-devtools-extension`).

RTK is the official, opinionated standard way to write Redux logic today.

| Feature                | Classic Redux                                                              | Redux Toolkit (RTK)                                                                  |
| ---------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Store Setup**        | `createStore(combineReducers(...), applyMiddleware(...))`                  | `configureStore({ reducer: { ... } })` (Includes DevTools & Thunk by default)        |
| **Actions & Reducers** | Separately defined action types, action creators, and switch-case reducers | `createSlice()` generates actions and reducers together                              |
| **Immutability**       | Manual object spreading (`...state`)                                       | Uses **Immer** internally; allows writing direct mutable syntax (`state.value += 1`) |
| **Async Logic**        | Requires manually adding `redux-thunk` or `redux-saga`                     | Native `createAsyncThunk` and **RTK Query**                                          |

#### Q4: How does Immer work inside Redux Toolkit slices?

**Answer:**
Inside RTK's `createSlice`, **Immer** wraps state modifications in a `Proxy`. This allows developers to write code that looks like direct mutation (e.g., `state.todos.push(newTodo)` or `state.user.name = 'John'`). Immer tracks these operations and produces a fresh, immutable state object behind the scenes.

*Note: You must either mutate the existing draft state OR return a new state object—never both in the same reducer.*

---

### 3. Middleware & Asynchronous Logic

#### Q5: What is Redux Middleware, and what are its common use cases?

**Answer:**
Middleware provides a third-party extension point between dispatching an action and the moment it reaches the reducer. It intercepts actions to perform side effects.

**Common Use Cases:**

* Asynchronous API requests (`redux-thunk`, `redux-saga`).
* Logging and Analytics (`redux-logger`).
* Routing/Navigation triggers.
* Persisting state to `localStorage`.

#### Q6: How does `createAsyncThunk` handle lifecycle states?

**Answer:**
`createAsyncThunk` generates a thunk action creator that dispatches three action types automatically based on a returned Promise:

1. **`pending`**: Dispatched immediately when the thunk starts (e.g., set `loading = true`).
2. **`fulfilled`**: Dispatched when the Promise resolves successfully (e.g., update `data`, set `loading = false`).
3. **`rejected`**: Dispatched when the Promise rejects or throws an error (e.g., set `error = payload`, set `loading = false`).

These are handled inside a slice's **`extraReducers`** builder callback.

---

### 4. Performance & Selectors

#### Q7: What are Selectors and how does `createSelector` (Reselect) optimize performance?

**Answer:**
Selectors are functions used to extract or derive specific pieces of state from the store.

* **Problem:** Using `useSelector` with inline calculations (e.g., `state.todos.filter(...)`) causes the calculation to run on *every single render* and returns a new array reference, triggering unnecessary component re-renders.
* **Solution:** `createSelector` (from Reselect/RTK) creates **memoized selectors**. It recalculates derived state **only when its input arguments change**.

```javascript
import { createSelector } from '@reduxjs/toolkit';

const selectTodos = (state) => state.todos;
const selectFilter = (state) => state.filter;

// Memoized Selector
export const selectCompletedTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => todos.filter((todo) => todo.completed && todo.category === filter)
);

```

---

### 5. Advanced & RTK Query

#### Q8: What is RTK Query, and how does it differ from standard Redux thunks?

**Answer:**
**RTK Query** is an advanced data-fetching and caching tool built into Redux Toolkit. While `createAsyncThunk` requires you to manually manage loading states, error states, and storage reducers for every endpoint, RTK Query automates the entire network layer.

**Key Features of RTK Query:**

* **Automatic Cache Management:** Caches responses based on query arguments.
* **De-duplication:** Prevents duplicate network requests for the same data across multiple components.
* **Normalized Caching & Invalidation:** Uses "Tags" (`providesTags` / `invalidatesTags`) to automatically refetch data when mutations occur.
* **Auto-generated Hooks:** Generates custom React hooks (e.g., `useGetUsersQuery()`, `useUpdateUserMutation()`).

---

### Quick Interview Cheat Sheet

| Question Theme                         | Core Keyword / Key Phrase                                                                                                                              |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Why Redux over Context API?**        | Context is for dependency injection; Redux provides **memoized updates, devtools debugging, and middleware support** for high-frequency state updates. |
| **How to clear state on logout?**      | Reset the root reducer state to `undefined` inside a root action handler.                                                                              |
| **What is normalized state?**          | Storing items as objects with IDs as keys (`byId: { 1: {...} }, allIds: [1]`) like a database table to avoid nested object lookups.                    |
| **Can you dispatch inside a Reducer?** | **No.** Reducers must be pure functions with zero side effects.                                                                                        |
Provide 3 real-world scenario-based coding questions for Redux Toolkit commonly asked in senior frontend interviews.

Here are 3 real-world, scenario-based coding challenges for Redux Toolkit (RTK) that frequently appear in senior frontend engineering interviews. Each scenario tests architectural decisions, state normalisation, performance memoisation, and caching strategies.

---

### Challenge 1: RTK Query Cache Invalidation & Dependent Mutations

#### Scenario

You are building an E-Commerce Inventory Dashboard. When an administrator updates a product's price or stock using `useUpdateProductMutation`, the UI must automatically refetch and update both:

1. The **Product Detail view** (`useGetProductByIdQuery`).
2. The **Paginated Products List view** (`useGetProductsQuery`).

Furthermore, if the user edits a product that is currently part of an active **Flash Sale**, the dashboard must automatically invalidate and refetch the `useGetFlashSaleProductsQuery` endpoint.

#### Task

Implement the `productsApi` slice using RTK Query with tag-based cache invalidation.

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Product {
  id: string;
  name: string;
  price: number;
  isFlashSale: boolean;
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1' }),
  // TODO: Define tagTypes
  tagTypes: ['Product', 'FlashSale'],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    getFlashSaleProducts: builder.query<Product[], void>({
      query: () => '/products/flash-sale',
      providesTags: [{ type: 'FlashSale', id: 'LIST' }],
    }),

    // TODO: Complete updateProduct mutation with dynamic tag invalidation
    updateProduct: builder.mutation<Product, Partial<Product> & { id: string }>({
      query: ({ id, ...patch }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id, isFlashSale }) => {
        const tags: Array<{ type: 'Product' | 'FlashSale'; id?: string }> = [
          { type: 'Product', id },        // Invalidates specific product query
          { type: 'Product', id: 'LIST' }, // Invalidates product list query
        ];

        // Dynamically invalidate flash sale cache if product is in flash sale
        if (isFlashSale || result?.isFlashSale) {
          tags.push({ type: 'FlashSale', id: 'LIST' });
        }

        return tags;
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetFlashSaleProductsQuery,
  useUpdateProductMutation,
} = productsApi;

```

---

### Challenge 2: Normalized State & Complex Memoized Selectors

#### Scenario

You are building a collaborative project management tool (like Trello/Jira). The backend returns a nested, un-normalized response containing projects, tasks, and assigned team members.

1. Normalize the state using RTK’s `createEntityAdapter` to store tasks as a flat `{ ids: [], entities: {} }` structure.
2. Write a memoized selector using `createSelector` that accepts a `projectId` and a `status` filter, returning only tasks assigned to active users in that project. The selector must not recompute unless the underlying tasks or active users change.

#### Solution

```typescript
import {
  createSlice,
  createEntityAdapter,
  createSelector,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  assigneeId: string;
}

export interface User {
  id: string;
  name: string;
  isActive: boolean;
}

// 1. Create Entity Adapter for Tasks
const tasksAdapter = createEntityAdapter<Task>({
  selectId: (task) => task.id,
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: tasksAdapter.getInitialState(),
  reducers: {
    setAllTasks: tasksAdapter.setAll,
    updateTask: tasksAdapter.updateOne,
  },
});

export const { setAllTasks, updateTask } = tasksSlice.actions;

// 2. Extract Adapter Selectors
const tasksSelectors = tasksAdapter.getSelectors<RootState>(
  (state) => state.tasks
);

// Input Selectors
const selectAllTasks = tasksSelectors.selectAll;
const selectActiveUsers = (state: RootState) => state.users.activeUserIds;
const selectProjectId = (_state: RootState, projectId: string) => projectId;
const selectStatusFilter = (
  _state: RootState,
  _projectId: string,
  status: Task['status']
) => status;

// 3. Optimized Parametrized Selector
export const selectFilteredProjectTasks = createSelector(
  [selectAllTasks, selectActiveUsers, selectProjectId, selectStatusFilter],
  (tasks, activeUserIds, projectId, statusFilter) => {
    const activeUsersSet = new Set(activeUserIds);

    return tasks.filter(
      (task) =>
        task.projectId === projectId &&
        task.status === statusFilter &&
        activeUsersSet.has(task.assigneeId)
    );
  }
);

export default tasksSlice.reducer;

```

---

### Challenge 3: Global Reset Pattern & Cross-Slice Listener Middleware

#### Scenario

In a multi-tenant enterprise app, when a user triggers `logoutUser.fulfilled` or when an auth interceptor receives a `401 Unauthorized` error:

1. All Redux slices (`userSlice`, `cartSlice`, `notificationSlice`) must reset their state back to `initialState`.
2. A separate **Audit Log Service** must be notified without coupling the auth slice directly to other feature slices.

#### Solution using RTK `listenerMiddleware`

```typescript
import { createSlice, createAction, configureStore, createListenerMiddleware } from '@reduxjs/toolkit';

// 1. Global Logout Action
export const globalReset = createAction('GLOBAL_RESET');

// 2. Feature Slice with Root Reset Handling
const initialState = { items: [], total: 0 };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    // Intercept global reset action
    builder.addCase(globalReset, () => initialState);
  },
});

// 3. Create Listener Middleware for Side Effects
export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: globalReset,
  effect: async (action, listenerApi) => {
    console.log('[Audit Log] User logged out. Clearing sensitive cache...');
    
    // Purge local storage / persistent session caches
    localStorage.removeItem('app_session');

    // Optionally cancel pending async requests or dispatch teardown tasks
    listenerApi.cancelActiveListeners();
  },
});

// 4. Root Reducer Wrapper Pattern (Alternative Global Reset Approach)
const combinedReducer = {
  cart: cartSlice.reducer,
};

export const store = configureStore({
  reducer: (state, action) => {
    if (action.type === globalReset.type) {
      // Re-initialize entire state tree to undefined
      state = undefined;
    }
    return configureStore({ reducer: combinedReducer }).reducer(state, action);
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

```

How do you build a custom Redux Toolkit middleware to catch global API errors and show toast notifications?

Building a custom Redux Toolkit (RTK) middleware to handle global API errors is a clean, production-ready pattern. It decouples error presentation (like showing toast notifications) from your individual UI components and async thunks or RTK Query endpoints.

Here is a step-by-step implementation using **Redux Toolkit Listener Middleware** (the modern RTK standard) and a traditional **Custom Redux Middleware**.

---

### Strategy Overview

```text
┌────────────────────────────────────────────────────────┐
│ 1. API Call Fails                                      │
│    `createAsyncThunk` or `RTK Query` dispatches      │
│    a rejected action (e.g. `api/fetch/rejected`)       │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 2. Middleware Intercepts Action                        │
│    Checks if action matches `isRejectedWithValue`      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 3. Display Toast Notification                          │
│    Extracts error message and triggers toast library    │
│    (e.g., react-toastify, react-hot-toast, Sonner)     │
└────────────────────────────────────────────────────────┘

```

---

### Option 1: Using `createListenerMiddleware` (Recommended Modern RTK)

Redux Toolkit includes `createListenerMiddleware` out-of-the-box. It provides type safety, cancellation controls, and access to `dispatch` and `getState`.

#### Step 1: Create the Error Handler Listener (`middleware/errorListener.js`)

```javascript
import { createListenerMiddleware, isRejectedWithValue } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast'; // or react-toastify / Sonner

export const errorListenerMiddleware = createListenerMiddleware();

errorListenerMiddleware.startListening({
  // Match any rejected action that contains a payload (from rejectWithValue or RTK Query)
  matcher: isRejectedWithValue,
  effect: async (action, listenerApi) => {
    // 1. Extract error details from payload or error object
    const payload = action.payload;
    const status = payload?.status || action.error?.code;

    // 2. Ignore 401 Unauthorized if handled separately by auth refresh logic
    if (status === 401) {
      return;
    }

    // 3. Extract user-friendly error message
    const errorMessage =
      payload?.data?.message ||
      payload?.message ||
      action.error?.message ||
      'An unexpected error occurred. Please try again.';

    // 4. Trigger Toast Notification
    toast.error(errorMessage, {
      id: `error-${status || 'generic'}`, // Prevent duplicate toasts for same status
      duration: 4000,
    });

    // Optional: Log error to monitoring tools like Sentry
    console.error(`[Global API Error] Action: ${action.type}`, payload);
  },
});

```

#### Step 2: Register Listener in Redux Store (`app/store.js`)

```javascript
import { configureStore } from '@reduxjs/toolkit';
import { errorListenerMiddleware } from './middleware/errorListener';
import rootReducer from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(errorListenerMiddleware.middleware),
});

```

---

### Option 2: Traditional Custom Redux Middleware

If you prefer a lightweight functional closure middleware:

#### Step 1: Write Custom Middleware (`middleware/rtkQueryErrorLogger.js`)

```javascript
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

export const rtkQueryErrorLogger = (api) => (next) => (action) => {
  // Check if the action is a rejected action from createAsyncThunk or RTK Query
  if (isRejectedWithValue(action)) {
    const status = action.payload?.status;

    // Handle specific status codes if needed
    if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (status === 500) {
      toast.error('Server error. Our team has been notified.');
    } else {
      const message =
        action.payload?.data?.message ||
        action.payload?.message ||
        'Something went wrong.';
        
      toast.error(message);
    }
  }

  return next(action);
};

```

#### Step 2: Register Custom Middleware (`app/store.js`)

```javascript
import { configureStore } from '@reduxjs/toolkit';
import { rtkQueryErrorLogger } from './middleware/rtkQueryErrorLogger';
import { apiSlice } from './api/apiSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    // other reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, rtkQueryErrorLogger),
});

```

---

### Bypassing Toast Notifications for Specific Endpoints

Sometimes you want an endpoint or thunk to handle its errors silently in the UI component without triggering a global toast.

#### Strategy 1: Using `meta` flags in `rejectWithValue`

```javascript
// In your createAsyncThunk:
export const fetchUserQuietly = createAsyncThunk(
  'user/fetchQuietly',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users/${userId}`);
      return res.data;
    } catch (err) {
      // Pass a custom meta flag to suppress global toast
      return rejectWithValue(err.response.data, {
        suppressToast: true,
      });
    }
  }
);

```

#### Check `meta` flag in Middleware

```javascript
errorListenerMiddleware.startListening({
  matcher: isRejectedWithValue,
  effect: async (action) => {
    // Skip toast if suppressToast flag is present
    if (action.meta?.suppressToast) {
      return;
    }

    const message = action.payload?.message || 'Error occurred';
    toast.error(message);
  },
});

```

---

### Benefits of This Pattern

1. **DRY Code:** Eliminates repetitive `try/catch` blocks and `toast.error()` calls inside React components.
2. **Unified Error Parsing:** Handles both standard HTTP `4xx/5xx` responses and network disconnects in one place.
3. **Works for Both Ecosystems:** Compatible with both `createAsyncThunk` and `RTK Query` API slices via RTK's built-in `isRejectedWithValue` matcher.
