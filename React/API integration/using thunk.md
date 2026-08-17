Here is the complete implementation using **Classic / Old Redux (pre-Toolkit)** with traditional Action Creators, action types, and `redux-thunk` middleware.

### 1. Old Redux Store & Thunk (`store.js`)

```javascript
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import axios from 'axios';

// Axios Instance
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

// Action Types
const TYPES = {
  FETCH_USERS_REQUEST: 'FETCH_USERS_REQUEST',
  FETCH_USERS_SUCCESS: 'FETCH_USERS_SUCCESS',
  FETCH_USERS_FAILURE: 'FETCH_USERS_FAILURE',
};

// Async Action Creator using Thunk
export const fetchUsers = () => {
  return async (dispatch) => {
    dispatch({ type: TYPES.FETCH_USERS_REQUEST });
    try {
      const response = await api.get('/users');
      dispatch({ type: TYPES.FETCH_USERS_SUCCESS, payload: response.data });
    } catch (err) {
      dispatch({ type: TYPES.FETCH_USERS_FAILURE, payload: err.message });
    }
  };
};

// Initial State
const initialState = {
  list: [],
  loading: false,
  error: null,
};

// Classic Reducer (Switch Case)
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
}

// Create Store with Thunk Middleware
export const store = createStore(userReducer, applyMiddleware(thunk));

```

---

### 2. React Component (`UserListOldThunk.jsx`)

```javascript
import React, { useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store, fetchUsers } from './store';

function Users() {
  const dispatch = useDispatch();
  const { list: users, loading, error } = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <p className="text-center py-4">Loading via Old Redux Thunk...</p>;
  if (error) return <p className="text-center py-4 text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100 font-sans">
      <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">Users (Old Redux Thunk)</h1>
      <ul className="space-y-2 max-h-60 overflow-y-auto">
        {users.map((user) => (
          <li key={user.id} className="p-3 bg-gray-50 rounded-lg text-sm">
            <p className="font-semibold">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function UserListOldThunk() {
  return (
    <Provider store={store}>
      <Users />
    </Provider>
  );
}

```
