Here is how to convert a synchronous Redux Toolkit authentication slice into an asynchronous flow using **`createAsyncThunk`**.

This implementation handles asynchronous API requests for `login`, `register`, and `logout`, manages loading and error states, and stores JWT access tokens securely in memory while persisting user metadata.

---

### File Structure

```text
src/
├── api/
│   └── authApi.js          # Axios client with JWT interceptor
├── features/
│   └── auth/
│       └── authSlice.js    # RTK Slice with createAsyncThunk
└── components/
    └── LoginForm.jsx       # Component handling async states

```

---

### Step 1: Set Up API Client (`api/authApi.js`)

Create a centralized Axios instance to call your REST backend and automatically attach the JWT token to outgoing requests.

```javascript
import axios from 'axios';

// Store the access token in memory (JS variable) for security
let inMemoryToken = null;

export const setAccessToken = (token) => {
  inMemoryToken = token;
};

export const getAccessToken = () => inMemoryToken;

const api = axios.create({
  baseURL: 'https://api.yourdomain.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Needed if your backend sets HttpOnly cookies for refresh tokens
});

// Interceptor: Attach JWT Access Token to every outgoing API request
api.interceptors.request.use((config) => {
  if (inMemoryToken) {
    config.headers.Authorization = `Bearer ${inMemoryToken}`;
  }
  return config;
});

export default api;

```

---

### Step 2: Convert Auth Slice with `createAsyncThunk` (`features/auth/authSlice.js`)

Use `createAsyncThunk` to define asynchronous actions and handle pending, fulfilled, and rejected lifecycle states using `extraReducers`.

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { setAccessToken } from '../../api/authApi';

// Helper: Safely load cached user info from localStorage
const storedUser = JSON.parse(localStorage.getItem('user_profile'));

const initialState = {
  user: storedUser || null,
  isAuthenticated: !!storedUser,
  loading: false,
  error: null,
};

// -------------------------------------------------------------------
// ASYNC THUNKS
// -------------------------------------------------------------------

// 1. REGISTER THUNK
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      // Response payload expected: { user: { id, name, email }, accessToken: "eyJ..." }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  }
);

// 2. LOGIN THUNK
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data; // { user, accessToken }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Invalid credentials'
      );
    }
  }
);

// 3. LOGOUT THUNK
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

// -------------------------------------------------------------------
// AUTH SLICE
// -------------------------------------------------------------------

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    // Optional: Restore access token manually after a silent refresh
    setToken: (state, action) => {
      setAccessToken(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // ================= REGISTER =================
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;

        // Keep Access Token in Axios memory module
        setAccessToken(action.payload.accessToken);
        // Store non-sensitive user metadata in localStorage
        localStorage.setItem('user_profile', JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= LOGIN =================
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;

        setAccessToken(action.payload.accessToken);
        localStorage.setItem('user_profile', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= LOGOUT =================
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;

        setAccessToken(null);
        localStorage.removeItem('user_profile');
      })
      .addCase(logoutUser.rejected, (state) => {
        // Force cleanup on client even if server-side logout threw an error
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;

        setAccessToken(null);
        localStorage.removeItem('user_profile');
      });
  },
});

export const { clearAuthError, setToken } = authSlice.actions;
export default authSlice.reducer;

```

---

### Step 3: Usage in a React Component (`components/LoginForm.jsx`)

Components dispatch `unwrap()` on the thunk result or read the `loading` and `error` states directly from Redux.

```jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../features/auth/authSlice';

export default function LoginForm() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const dispatch = useDispatch();

  // Extract async states from Redux Store
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    try {
      // unwrap() allows handling promises natively with async/await
      await dispatch(loginUser(credentials)).unwrap();
      console.log('Login successful!');
    } catch (rejectedValueOrSerializedError) {
      console.error('Login failed:', rejectedValueOrSerializedError);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '300px', margin: '20px auto' }}>
      <h2>Login</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <div>
        <input
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          required
        />
      </div>

      <div style={{ marginTop: '10px' }}>
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />
      </div>

      <button type="submit" disabled={loading} style={{ marginTop: '15px' }}>
        {loading ? 'Authenticating...' : 'Sign In'}
      </button>
    </form>
  );
}

```

---

### Architecture Highlights

1. **Token Security:** The actual `accessToken` is **never saved to `localStorage**` (protecting against XSS attacks). It is kept in memory inside the Axios module via `setAccessToken()`.
2. **Error Handling with `rejectWithValue`:** Custom error messages sent from your Node/Spring/Django backend (`error.response.data.message`) are passed directly to `action.payload` rather than throwing uncaught Javascript errors.
3. **Promise Unwrapping:** Calling `.unwrap()` on `dispatch(loginUser(...))` lets components trigger local navigation or toast notifications inside standard `try/catch` blocks.
