Here is a complete, production-ready implementation of asynchronous API integration using **Classic / Old Redux (pre-Toolkit)** with `legacy_createStore`, `redux-thunk` middleware, and a custom **Axios instance with interceptors** for request/response handling.

### 1. Axios Instance with Interceptors (`api.js`)

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

### 2. Old Redux Store with Thunk Middleware (`store.js`)

```javascript
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { api } from './api';

// 1. Action Types
const TYPES = {
  FETCH_USERS_REQUEST: 'FETCH_USERS_REQUEST',
  FETCH_USERS_SUCCESS: 'FETCH_USERS_SUCCESS',
  FETCH_USERS_FAILURE: 'FETCH_USERS_FAILURE',
};

// 2. Action Creators
export const fetchUsers = () => {
  return async (dispatch) => {
    dispatch({ type: TYPES.FETCH_USERS_REQUEST });
    try {
      const response = await api.get('/users');
      dispatch({ type: TYPES.FETCH_USERS_SUCCESS, payload: response.data });
    } catch (err) {
      dispatch({ type: TYPES.FETCH_USERS_FAILURE, payload: err });
    }
  };
};

// 3. Initial State
const initialState = {
  list: [],
  loading: false,
  error: null,
};

// 4. Reducer (Classic Switch Case)
function userReducer(state = initialState, action) {
  switch (action.type) {
    case TYPES.FETCH_USERS_REQUEST:
      return { ...state, loading: true, error: null };
    case TYPES.FETCH_USERS_SUCCESS:
      return { ...state, loading: false, list: action.payload };
    case TYPES.FETCH_USERS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// 5. Create Store with Thunk Middleware
export const store = createStore(userReducer, applyMiddleware(thunk));

```

---

### 3. React Component (`UserDirectoryOldRedux.jsx`)

```javascript
import React, { useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store, fetchUsers } from './store';

function UserList() {
  const dispatch = useDispatch();
  const { list: users, loading, error } = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Render: Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-sm text-gray-500 font-medium">Loading via Old Redux & Thunk...</span>
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
      <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">User Directory (Old Redux)</h1>
      
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
export default function UserDirectoryOldRedux() {
  return (
    <Provider store={store}>
      <UserList />
    </Provider>
  );
}

```
