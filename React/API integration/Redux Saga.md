Here is a complete, production-ready implementation of asynchronous API integration using **Redux Saga** (alongside a custom **Axios instance with interceptors**).

Redux Saga uses generator functions (`function*`) to handle side effects (like async API calls) as pure, testable, declarative processes.

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

### 2. Redux Store, Reducer, and Saga (`store.js`)

This file sets up the state machine, the generator worker/watcher sagas for asynchronous handling, and the Redux middleware connection.

```javascript
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';
import { api } from './api';

// 1. Action Types
const TYPES = {
  FETCH_USERS_REQUEST: 'FETCH_USERS_REQUEST',
  FETCH_USERS_SUCCESS: 'FETCH_USERS_SUCCESS',
  FETCH_USERS_FAILURE: 'FETCH_USERS_FAILURE',
};

// Action Creator
export const fetchUsersRequest = () => ({ type: TYPES.FETCH_USERS_REQUEST });

// 2. Saga Worker (Handles the Async Request)
function* handleFetchUsers() {
  try {
    // call() invokes the promise-based Axios method safely
    const response = yield call(api.get, '/users');
    // put() dispatches a successful action to the Redux store
    yield put({ type: TYPES.FETCH_USERS_SUCCESS, payload: response.data });
  } catch (err) {
    // put() dispatches failure payload if error occurs
    yield put({ type: TYPES.FETCH_USERS_FAILURE, payload: err });
  }
}

// 3. Saga Watcher (Listens for specific dispatched actions)
function* rootSaga() {
  yield takeEvery(TYPES.FETCH_USERS_REQUEST, handleFetchUsers);
}

// 4. Initial State & Reducer
const initialState = {
  list: [],
  loading: false,
  error: null,
};

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

// 5. Configure Store with Saga Middleware
const sagaMiddleware = createSagaMiddleware();
export const store = createStore(userReducer, applyMiddleware(sagaMiddleware));

// Run the root saga
sagaMiddleware.run(rootSaga);

```

---

### 3. React Component (`UserDirectorySaga.jsx`)

```javascript
import React, { useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store, fetchUsersRequest } from './store';

function UserList() {
  const dispatch = useDispatch();
  const { list: users, loading, error } = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchUsersRequest());
  }, [dispatch]);

  // Render: Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-sm text-gray-500 font-medium">Loading via Redux Saga & Axios...</span>
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
      <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">User Directory (Redux Saga)</h1>
      
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
export default function UserDirectorySaga() {
  return (
    <Provider store={store}>
      <UserList />
    </Provider>
  );
}

```
