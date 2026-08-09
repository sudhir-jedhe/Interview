Handling **Loading** and **Error** states in API calls—and effectively debugging them—is a core skill for building resilient React applications.

---

### Part 1: How to Handle Loading and Error States in React

There are two primary approaches:

1. **Standard `useState` + `try/catch/finally**` (Native React way)
2. **TanStack Query (React Query) / RTK Query** (Modern production standard)

---

#### Approach 1: Native `useState` + `try/catch/finally`

Always use a `finally` block to guarantee that `loading` turns `false`, whether the network call succeeds or fails.

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null); // Reset previous errors

    try {
      const response = await axios.get('https://api.example.com/users');
      setUsers(response.data);
    } catch (err) {
      // Extract specific server error message or fallback to default
      const message =
        err.response?.data?.message || err.message || 'Something went wrong!';
      setError(message);
    } finally {
      // Guarantees loading stops regardless of success or error
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 1. Loading UI
  if (loading) {
    return <div className="spinner">Loading users...</div>;
  }

  // 2. Error UI with Retry Option
  if (error) {
    return (
      <div className="error-box">
        <p>Error: {error}</p>
        <button onClick={fetchUsers}>Retry</button>
      </div>
    );
  }

  // 3. Success UI
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default UserList;

```

---

#### Approach 2: TanStack Query / React Query (Production Recommended)

React Query automatically handles loading states, error states, retries, and caching out of the box.

```jsx
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchUsers = async () => {
  const res = await axios.get('https://api.example.com/users');
  return res.data;
};

function UserList() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    retry: 2, // Auto-retry failed requests twice
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

```

---

### Part 2: How to Debug API Calls

When an API fails, returns unexpected data, or gets stuck on loading, follow these **4 systematic debugging steps**:

#### Step 1: Browser DevTools — Network Tab (Primary Tool)

* **Status Codes:**
* `200 OK`: Request succeeded.
* `400 Bad Request`: Invalid payload parameters sent by the client.
* `401 / 403`: Missing, invalid, or expired Bearer Token in request headers.
* `404 Not Found`: Incorrect API URL endpoint.
* `500 Internal Server Error`: Server/backend code crashed.

* **Inspect Headers:** Ensure `Authorization: Bearer <token>` and `Content-Type: application/json` are sent correctly.
* **Inspect Response Preview:** View the exact JSON payload or server error stack trace returned by the backend.
* **Copy as cURL:** Right-click the failing request $\rightarrow$ **Copy as cURL** to isolate and test the endpoint directly in Postman or terminal.

#### Step 2: Use Axios Interceptors for Global Logging

Set up global logging interceptors to inspect outgoing requests and incoming errors in your console:

```javascript
// api/axiosClient.js
import axios from 'axios';

const api = axios.create({ baseURL: 'https://api.example.com' });

// Request Interceptor
api.interceptors.request.use((config) => {
  console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
  return config;
});

// Response & Error Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error Detail]:', {
      url: error.config?.url,
      status: error.response?.status,
      responseData: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

```

#### Step 3: Network Throttling (Simulate Slow Connections)

* Open **DevTools** $\rightarrow$ **Network Tab**.
* Change **No throttling** to **Slow 3G** or **Fast 3G**.
* Test whether your UI shows the loading spinner gracefully or crashes due to slow response times.

#### Step 4: Inspecting Error Objects with `console.dir`

Inside your `catch(error)` block, use `console.dir(error)` instead of `console.log(error)`. This prints the full JavaScript error object, letting you inspect hidden properties like `error.response` and `error.config`.

---

### Summary Debugging Matrix

| Issue                               | Common Cause                                                           | How to Fix / Debug                                                      |
| ----------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Loading Spinner runs infinitely** | Forgotten `setLoading(false)` on error path                            | Wrap `setLoading(false)` inside a `finally` block                       |
| **CORS Error in Console**           | Backend hasn't allowed your origin URL                                 | Add CORS headers on backend or use Dev Server Proxy in `vite.config.js` |
| **Data is `undefined` on UI**       | Unmatched JSON structure (e.g., `res.data.data` instead of `res.data`) | Check **Network Tab $\rightarrow$ Response** payload shape              |
| **401 Unauthorized**                | Expired or missing JWT token                                           | Verify headers in **Network Tab $\rightarrow$ Headers**                 |
