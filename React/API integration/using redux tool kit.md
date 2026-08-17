Here is a complete, production-ready implementation of asynchronous API integration using **Redux Toolkit (`createAsyncThunk`)**, paired with a custom **Axios instance and interceptors** for request/response handling.

### 1. Axios Instance with Interceptors (`api.js`)

This sets up your base URL, automatically injects authorization headers on requests, and handles global errors (like token expiration or unauthorized access).

```javascript
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject Auth Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('app_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Session expired. Clearing token.');
      localStorage.removeItem('app_auth_token');
    }
    return Promise.reject(error.response?.data?.message || error.message);
  }
);

```

---

### 2. Redux Slice with `createAsyncThunk` (`userSlice.js`)

This manages the async API lifecycle (`pending`, `fulfilled`, `rejected`) seamlessly using Redux Toolkit.

```javascript
import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from './api';

// Define the async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users');
      return response.data; // Passed as action.payload on success
    } catch (err) {
      return rejectWithValue(err); // Passed as action.payload on error
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
      });
  },
});

export const store = configureStore({
  reducer: {
    users: userSlice.reducer,
  },
});

```

---

### 3. React Component (`UserDirectoryRTK.jsx`)

This component uses `useDispatch` to trigger the thunk on mount and `useSelector` to render the data, loading spinner, or error message.

```javascript
import React, { useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store, fetchUsers } from './userSlice';

function UserList() {
  const dispatch = useDispatch();
  const { list: users, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Render: Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-sm text-gray-500 font-medium">Loading via Redux Toolkit & Axios...</span>
      </div>
    );
  }

  // Render: Error State
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
        <p className="text-sm font-semibold text-red-600 mb-1">API Error</p>
        <p className="text-xs text-red-500">{error}</p>
      </div>
    );
  }

  // Render: Success Data State
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100 font-sans">
      <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">User Directory (RTK)</h1>
      
      <ul className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {users.map((user) => (
          <li
            key={user.id}
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex flex-col"
          >
            <span className="text-sm font-semibold text-gray-800">{user.name}</span>
            <span className="text-xs text-gray-500">{user.email}</span>
            <span className="text-xs text-blue-600 mt-1">{user.company.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Wrapper with Redux Provider
export default function UserDirectoryRTK() {
  return (
    <Provider store={store}>
      <UserList />
    </Provider>
  );
}

```
