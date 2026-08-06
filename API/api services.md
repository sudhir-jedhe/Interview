# React API Service with API Client Integration (Enterprise Pattern)

This is a **production-grade architecture** used in large React applications.

```text
Component
   ↓
Custom Hook
   ↓
Service Layer
   ↓
API Client
   ↓
Backend API
```

Benefits:

✅ Reusable

✅ Testable

✅ Centralised Error Handling

✅ Token Management

✅ Retry Support

✅ Circuit Breaker Support

---

# Project Structure

```text
src/
│
├── api/
│   └── apiClient.js
│
├── services/
│   └── userService.js
│
├── hooks/
│   └── useUsers.js
│
├── pages/
│   └── UsersPage.jsx
```

---

# 1. API Client

## api/apiClient.js

```javascript
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.company.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

---

## Request Interceptor

Automatically attach JWT token.

```javascript
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

---

## Response Interceptor

Handle common errors.

```javascript
apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      console.log("Session expired");
    }

    return Promise.reject(error);
  },
);

export default apiClient;
```

---

# 2. Service Layer

## services/userService.js

```javascript
import apiClient from "../api/apiClient";

export const UserService = {
  async getUsers() {
    const response = await apiClient.get("/users");

    return response.data;
  },

  async getUser(id) {
    const response = await apiClient.get(`/users/${id}`);

    return response.data;
  },

  async createUser(user) {
    const response = await apiClient.post("/users", user);

    return response.data;
  },

  async updateUser(id, user) {
    const response = await apiClient.put(`/users/${id}`, user);

    return response.data;
  },

  async deleteUser(id) {
    await apiClient.delete(`/users/${id}`);
  },
};
```

---

# 3. Custom Hook

## hooks/useUsers.js

```javascript
import { useEffect, useState } from "react";

import { UserService } from "../services/userService";

export function useUsers() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const data = await UserService.getUsers();

      setUsers(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refresh: loadUsers,
  };
}
```

---

# 4. React Page Component

## pages/UsersPage.jsx

```jsx
import { useUsers } from "../hooks/useUsers";

function UsersPage() {
  const { users, loading, error } = useUsers();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <p>
        Error:
        {error.message}
      </p>
    );
  }

  return (
    <div>
      <h2>Users</h2>

      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}

export default UsersPage;
```

---

# React Query Version (Recommended)

Instead of managing:

```javascript
loading;
error;
caching;
retry;
```

manually.

---

## Hook

```javascript
import { useQuery } from "@tanstack/react-query";

import { UserService } from "../services/userService";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],

    queryFn: () => UserService.getUsers(),

    retry: 3,

    staleTime: 5 * 60 * 1000,
  });
}
```

---

## Component

```jsx
function UsersPage() {
  const { data, isLoading, error } = useUsers();

  if (isLoading) return <p>Loading</p>;

  return (
    <>
      {data.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </>
  );
}
```

---

# Why Use an API Client?

Without API Client:

```javascript
fetch(...)
fetch(...)
fetch(...)
```

Repeated everywhere.

---

With API Client:

```javascript
apiClient.get();
apiClient.post();
```

Centralised:

✅ Auth Token

✅ Error Handling

✅ Retry Logic

✅ Request Logging

✅ Circuit Breaker

✅ Rate Limiting

---

# Senior React Interview Answer

> In enterprise React applications, API calls should be abstracted through an API client (typically Axios) and a dedicated service layer. The API client centralises concerns such as authentication tokens, interceptors, retries, error handling, and logging. Service modules encapsulate domain-specific API operations like `getUsers()` or `createUser()`. Components should consume services via custom hooks or React Query, keeping UI code clean, testable, and maintainable. This layered architecture scales well for large applications and aligns with clean architecture principles.

Below is a **production-ready React CRUD application** demonstrating:

✅ Axios API Client  
✅ Service Layer  
✅ Response Mapping / Transformation  
✅ Correct Endpoint / HTTP Method / Payload  
✅ 200, 201, 204 Handling  
✅ 400, 401, 403, 404, 409, 429, 500 Handling  
✅ Network Timeout Handling  
✅ Retry with Exponential Backoff  
✅ Circuit Breaker  
✅ React Hooks  
✅ Jest Unit Tests

---

# Install Dependencies

```bash
npm install axios
npm install @tanstack/react-query
npm install --save-dev jest
npm install --save-dev @testing-library/react
```

---

# Folder Structure

```text
src/
│
├── api/
│   ├── apiClient.js
│   ├── retry.js
│   ├── circuitBreaker.js
│
├── services/
│   └── userService.js
│
├── hooks/
│   └── useUsers.js
│
├── components/
│   └── Users.jsx
│
├── tests/
│   └── userService.test.js
```

---

# api/apiClient.js

```javascript
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    switch (status) {
      case 400:
        console.error("Validation Error");
        break;

      case 401:
        console.error("Unauthorized");
        break;

      case 403:
        console.error("Forbidden");
        break;

      case 404:
        console.error("Not Found");
        break;

      case 409:
        console.error("Conflict");
        break;

      case 429:
        console.error("Rate Limit");
        break;

      case 500:
        console.error("Server Error");
        break;

      default:
        break;
    }

    return Promise.reject(error);
  },
);

export default apiClient;
```

---

# api/retry.js

```javascript
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function retry(fn, maxRetries = 3) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;

      if (attempt >= maxRetries) {
        throw error;
      }

      const delay = 1000 * Math.pow(2, attempt);

      await sleep(delay);
    }
  }
}
```

---

# api/circuitBreaker.js

```javascript
export class CircuitBreaker {
  constructor(fn, failureThreshold = 3) {
    this.fn = fn;

    this.failureCount = 0;

    this.failureThreshold = failureThreshold;

    this.state = "CLOSED";
  }

  async execute(...args) {
    if (this.state === "OPEN") {
      throw new Error("Circuit Open");
    }

    try {
      const result = await this.fn(...args);

      this.failureCount = 0;

      return result;
    } catch (error) {
      this.failureCount++;

      if (this.failureCount >= this.failureThreshold) {
        this.state = "OPEN";
      }

      throw error;
    }
  }
}
```

---

# services/userService.js

```javascript
import apiClient from "../api/apiClient";

import { retry } from "../api/retry";

import { CircuitBreaker } from "../api/circuitBreaker";

const breaker = new CircuitBreaker((request) => request());

export const UserService = {
  async getUsers() {
    const response = await breaker.execute(() =>
      retry(() => apiClient.get("/users")),
    );

    return response.data.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
  },

  async createUser(user) {
    const response = await apiClient.post("/users", user);

    return response.data;
  },

  async updateUser(id, user) {
    const response = await apiClient.put(`/users/${id}`, user);

    return response.data;
  },

  async deleteUser(id) {
    const response = await apiClient.delete(`/users/${id}`);

    return response.status;
  },
};
```

---

# hooks/useUsers.js

```javascript
import { useEffect, useState } from "react";

import { UserService } from "../services/userService";

export function useUsers() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function loadUsers() {
    try {
      setLoading(true);

      const users = await UserService.getUsers();

      setUsers(users);
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        setError("Network Timeout");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refresh: loadUsers,
  };
}
```

---

# components/Users.jsx

```jsx
import { useUsers } from "../hooks/useUsers";

export default function Users() {
  const { users, loading, error } = useUsers();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>Users</h1>

      {users.map((user) => (
        <div
          key={user.id}
          style={{
            border: "1px solid #ccc",
            margin: "10px",
            padding: "10px",
          }}
        >
          <h3>{user.name}</h3>

          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
```

---

# tests/userService.test.js

```javascript
import apiClient from "../api/apiClient";

import { UserService } from "../services/userService";

jest.mock("../api/apiClient");

describe("UserService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("200 success", async () => {
    apiClient.get.mockResolvedValue({
      data: [
        {
          id: 1,
          name: "Sudhir",
          email: "test@test.com",
        },
      ],
    });

    const result = await UserService.getUsers();

    expect(result).toEqual([
      {
        id: 1,
        name: "Sudhir",
        email: "test@test.com",
      },
    ]);
  });

  test("empty response", async () => {
    apiClient.get.mockResolvedValue({
      data: [],
    });

    const result = await UserService.getUsers();

    expect(result).toEqual([]);
  });

  test("401 unauthorized", async () => {
    apiClient.get.mockRejectedValue({
      response: {
        status: 401,
      },
    });

    await expect(UserService.getUsers()).rejects.toMatchObject({
      response: {
        status: 401,
      },
    });
  });

  test("403 forbidden", async () => {
    apiClient.get.mockRejectedValue({
      response: {
        status: 403,
      },
    });

    await expect(UserService.getUsers()).rejects.toMatchObject({
      response: {
        status: 403,
      },
    });
  });

  test("404 not found", async () => {
    apiClient.get.mockRejectedValue({
      response: {
        status: 404,
      },
    });

    await expect(UserService.getUsers()).rejects.toMatchObject({
      response: {
        status: 404,
      },
    });
  });

  test("409 conflict", async () => {
    apiClient.get.mockRejectedValue({
      response: {
        status: 409,
      },
    });

    await expect(UserService.getUsers()).rejects.toMatchObject({
      response: {
        status: 409,
      },
    });
  });

  test("429 rate limit", async () => {
    apiClient.get.mockRejectedValue({
      response: {
        status: 429,
      },
    });

    await expect(UserService.getUsers()).rejects.toMatchObject({
      response: {
        status: 429,
      },
    });
  });

  test("500 server error", async () => {
    apiClient.get.mockRejectedValue({
      response: {
        status: 500,
      },
    });

    await expect(UserService.getUsers()).rejects.toMatchObject({
      response: {
        status: 500,
      },
    });
  });

  test("timeout", async () => {
    apiClient.get.mockRejectedValue({
      code: "ECONNABORTED",
    });

    await expect(UserService.getUsers()).rejects.toMatchObject({
      code: "ECONNABORTED",
    });
  });

  test("correct endpoint", async () => {
    apiClient.get.mockResolvedValue({
      data: [],
    });

    await UserService.getUsers();

    expect(apiClient.get).toHaveBeenCalledWith("/users");
  });

  test("correct payload", async () => {
    const payload = {
      name: "Sudhir",
    };

    apiClient.post.mockResolvedValue({
      data: payload,
    });

    await UserService.createUser(payload);

    expect(apiClient.post).toHaveBeenCalledWith("/users", payload);
  });
});
```

### Interview Summary

This architecture demonstrates:

```text
✅ Axios API Client
✅ CRUD Operations
✅ Service Layer
✅ Response Mapping
✅ HTTP Status Handling
✅ Retry Logic
✅ Circuit Breaker
✅ Network Timeout Handling
✅ Unit Testing
✅ Clean Architecture
✅ Enterprise React Pattern
```

This is the level of implementation typically expected for a **Senior React Developer / Project Lead** interview.

This architecture guide is a solid blueprint for building enterprise-grade React applications.

To take this pattern from **great** to **flawless** (especially when presenting it in a senior/staff frontend interview), here are the critical refinements to address edge cases like token refreshing, circuit breaker recovery, and request cancellation.

---

## Key Refinements for Senior/Lead Interviews

### 1. Automatic JWT Token Refresh (401 Interceptor)

Instead of just logging `"Session expired"`, enterprise API clients use an interceptor queue to **refresh the JWT token** and retry the original failed requests seamlessly.

```javascript
import axios from "axios";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue pending requests while token is refreshing
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
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await axios.post(
          "https://api.company.com/auth/refresh",
          {
            token: refreshToken,
          },
        );

        localStorage.setItem("token", data.accessToken);
        apiClient.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;

        processQueue(null, data.accessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear auth and redirect to login page
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
```

---

### 2. Full State Machine Circuit Breaker (`CLOSED` $\rightarrow$ `OPEN` $\rightarrow$ `HALF-OPEN`)

A true Circuit Breaker must automatically transition to `HALF-OPEN` after a cooldown reset timeout to test if the backend server has recovered.

```javascript
export class CircuitBreaker {
  constructor(fn, failureThreshold = 3, resetTimeoutMs = 10000) {
    this.fn = fn;
    this.failureThreshold = failureThreshold;
    this.resetTimeoutMs = resetTimeoutMs;
    this.failureCount = 0;
    this.state = "CLOSED"; // CLOSED | OPEN | HALF-OPEN
    this.nextAttempt = Date.now();
  }

  async execute(...args) {
    // If OPEN, check if reset timeout has elapsed to try HALF-OPEN
    if (this.state === "OPEN") {
      if (Date.now() > this.nextAttempt) {
        this.state = "HALF-OPEN";
      } else {
        throw new Error("Circuit is OPEN: Service temporarily unavailable.");
      }
    }

    try {
      const result = await this.fn(...args);

      // Success in HALF-OPEN state resets the circuit back to CLOSED
      if (this.state === "HALF-OPEN") {
        this.state = "CLOSED";
        this.failureCount = 0;
      }

      return result;
    } catch (error) {
      this.failureCount++;

      if (this.failureCount >= this.failureThreshold) {
        this.state = "OPEN";
        this.nextAttempt = Date.now() + this.resetTimeoutMs;
      }

      throw error;
    }
  }
}
```

---

### 3. Preventing Memory Leaks with `AbortController`

When using `useEffect` without React Query, always pass an `AbortController` signal to cancel pending HTTP requests if the component unmounts before the request completes.

```javascript
// services/userService.js
export const UserService = {
  async getUsers(signal) {
    const response = await apiClient.get("/users", { signal });
    return response.data;
  },
};

// hooks/useUsers.js
useEffect(() => {
  const controller = new AbortController();

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await UserService.getUsers(controller.signal);
      setUsers(data);
    } catch (err) {
      if (err.name !== "CanceledError") {
        // Ignore component unmount cancellations
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  loadUsers();

  return () => controller.abort(); // Cancel request on component unmount
}, []);
```

---

## Architecture Summary Matrix

| Layer                                | Responsibility                                                                                        | What It Prevents                                                  |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **API Client (`apiClient.js`)**      | Base URL, default headers, HTTP interceptors, token injection.                                        | Duplicate auth header code & scattered error handling.            |
| **Service Layer (`userService.js`)** | Mapping endpoints, serializing/deserializing payloads, resilience wrappers (Retry / Circuit Breaker). | Coupling API routes or data transformations directly to React UI. |
| **Custom Hooks / React Query**       | Local/global async state management, caching, background revalidation, stale time.                    | Boilerplate `useEffect` fetch loops & race conditions.            |
| **Components (`UsersPage.jsx`)**     | Pure UI rendering, handling loading & error visual states.                                            | Polluting render logic with async side effects or HTTP logic.     |

That complete architectural stack is the gold standard for enterprise React applications.

To help round out your interview prep or implementation references, here is a quick summary cheat sheet showing how each layer handles its core responsibility:

```
┌─────────────────────────────────────────────────────────────┐
│                      React Components                       │
│      (Focus purely on UI rendering, loading, & errors)      │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                  Custom Hooks / React Query                 │
│      (Manages async state, stale-times, & revalidation)     │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                        Service Layer                        │
│   (Encapsulates CRUD methods, transformations, & payloads)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Circuit Breaker & Retry                  │
│    (Protects against cascading failures & network blips)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                       Axios API Client                      │
│ (Handles Base URL, Token Interceptors, & Status Mapping)    │
└─────────────────────────────────────────────────────────────┘

```

---

### Enterprise Readiness Checklist

| Feature                  | Primary Responsibility                                 | Key Edge Case Covered                            |
| ------------------------ | ------------------------------------------------------ | ------------------------------------------------ |
| **Axios API Client**     | Centralized HTTP client, headers, base URLs            | Missing auth tokens across endpoints             |
| **CRUD Operations**      | Standardized `GET`, `POST`, `PUT`, `DELETE` methods    | Mismatched HTTP verbs / missing payloads         |
| **Service Layer**        | DTO conversion & endpoint encapsulation                | UI breaking when backend changes field names     |
| **Response Mapping**     | Sanitizing raw API data before reaching UI             | Null/undefined properties crashing components    |
| **HTTP Status Handling** | Map status codes (`401`, `403`, `404`, `409`, `500`)   | Unhandled server errors showing blank screens    |
| **Retry Logic**          | Exponential backoff for transient glitches             | Momentary network dropped packets                |
| **Circuit Breaker**      | Failing fast when backend is unresponsive              | Flooding a down server with thousands of retries |
| **Network Timeout**      | Aborting requests taking longer than threshold (`10s`) | UI hung indefinitely in loading spinner state    |

With these layers wired together properly, your frontend is resilient, easy to unit test, and ready for production at scale.
