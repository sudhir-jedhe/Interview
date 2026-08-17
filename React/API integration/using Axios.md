Here is a complete, production-ready example of how to perform asynchronous API integration using **`useState`**, **`useEffect`**, and a centralized **Axios instance with Interceptors** for handling requests, responses, authorization tokens, and global error handling.

### 1. Axios Instance & Interceptors Setup (`axiosInstance.js`)

This file configures a custom Axios instance.

* **Request Interceptor:** Automatically attaches an auth token (e.g., Bearer token from `localStorage`) to outgoing headers.
* **Response Interceptor:** Globally intercepts errors (such as `401 Unauthorized` or network failures) so you don't have to handle them repeatedly in every component.

```javascript
import axios from 'axios';

// Create a customized Axios instance
export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request Interceptor: Attach Auth Token dynamically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('app_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Response Interceptor: Handle Global Errors & Responses
api.interceptors.response.use(
  (response) => {
    // Return data directly or keep full response object
    return response;
  },
  (error) => {
    // Global error handling (e.g., auto logout on 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized access - clearing token or redirecting to login.');
      localStorage.removeItem('app_auth_token');
      // window.location.href = '/login'; // Optional redirect
    }
    return Promise.reject(error);
  }
);

```

---

### 2. Component Integration (`UserDirectory.jsx`)

This component uses `useState` and `useEffect` to call your configured Axios instance asynchronously, managing loading, error states, and rendering.

```javascript
import React, { useState, useEffect } from 'react';
import { api } from './axiosInstance';

export default function UserDirectory() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Call the endpoint using our custom Axios instance
        const response = await api.get('/users');

        setUsers(response.data);
      } catch (err) {
        console.error('API call failed:', err);
        // Extract error message provided by Axios or fallback
        const errorMessage =
          err.response?.data?.message || err.message || 'Failed to fetch data.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Render: Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-sm text-gray-500 font-medium">Loading via Axios interceptor...</span>
      </div>
    );
  }

  // Render: Error State
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
        <p className="text-sm font-semibold text-red-600 mb-1">Request Error</p>
        <p className="text-xs text-red-500">{error}</p>
      </div>
    );
  }

  // Render: Success Data State
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100 font-sans">
      <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">User Directory (Axios)</h1>
      
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

```
