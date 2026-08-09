**Axios** is a popular, promise-based HTTP client library for JavaScript applications that runs in both the browser and Node.js environments. It simplifies making asynchronous network requests (`GET`, `POST`, `PUT`, `DELETE`, etc.) to REST APIs or microservices.

---

## Why Use Axios Over Native `fetch()`?

While modern browsers have a native `fetch()` API, Axios remains widely used because of several built-in conveniences:

| Feature                  | Native `fetch()`                                                                  | Axios                                                                                      |
| ------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **JSON Serialization**   | Must manually call `response.json()`.                                             | **Automatic** JSON parsing for request/response payloads.                                  |
| **Error Handling**       | Rejects promises **only** on network failure (does NOT reject on `404` or `500`). | Automatically rejects promises for HTTP status codes outside the 2xx range (`4xx`, `5xx`). |
| **Request Timeouts**     | Requires `AbortController` setup.                                                 | Built-in timeout setting (`timeout: 5000`).                                                |
| **Interceptors**         | Not supported natively.                                                           | **Supported out of the box.**                                                              |
| **Request Cancellation** | Requires `AbortController`.                                                       | Built-in support via `CancelToken` or `AbortController`.                                   |

---

## What are Axios Interceptors?

An **Interceptor** in Axios is a feature that allows you to intercept, inspect, or modify HTTP requests **before they are sent to the server** and responses **before they reach your application logic (`.then()` / `await`)**.

Think of interceptors as **middleware for network requests**.

```
[ Component Action ] ──► [ Request Interceptor ] ──► [ Backend Server ]
                                                            │
[ Component UI ]     ◄── [ Response Interceptor ] ◄─────────┘

```

---

## 1. Request Interceptors

A **Request Interceptor** runs right before a request leaves the browser.

### Primary Use Case

Automatically attaching authorization tokens (like JWTs) or custom headers to every outgoing request without duplicating header code across components.

```typescript
import axios from 'axios';

// Create an Axios instance
export const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
});

// Add a Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Read auth token from storage
    const token = localStorage.getItem('authToken');

    // Attach token to Authorization header if present
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // You can also modify headers, params, or log analytics here
    console.log(`[HTTP Outgoing] ${config.method?.toUpperCase()} -> ${config.url}`);

    return config; // Return modified config
  },
  (error) => {
    // Handle request setup errors
    return Promise.reject(error);
  }
);

```

---

## 2. Response Interceptors

A **Response Interceptor** runs immediately when a response returns from the server, right before it is returned to your `async/await` function or `.then()` handler.

### Primary Use Cases

* Unwrapping response payload wrappers (`response.data`).
* Catching global HTTP errors (e.g., redirecting to `/login` on `401 Unauthorized` or showing global toast alerts on `500 Server Error`).
* Token refresh logic (automatically getting a new token when the current one expires).

```typescript
// Add a Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Any status code within 2xx triggers this function
    // Unwraps data directly so components don't need `res.data.data`
    return response;
  },
  async (error) => {
    // Any status code outside 2xx triggers this function
    const status = error.response?.status;

    if (status === 401) {
      // Token expired or invalid: Clear auth state and redirect to login
      console.warn('Unauthorized access! Redirecting to login...');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    } else if (status === 500) {
      // Global server crash error alert
      alert('A server error occurred. Please try again later.');
    }

    return Promise.reject(error);
  }
);

```

---

## 3. Removing Interceptors

If you create an interceptor dynamically and need to eject/remove it later (e.g., during component unmounting), save the interceptor reference ID and call `.eject()`:

```typescript
// Register interceptor and save ID
const myInterceptor = apiClient.interceptors.request.use((config) => config);

// Remove interceptor
apiClient.interceptors.request.eject(myInterceptor);

```

---

## Summary of Axios Interceptor Benefits

1. **DRY Principle (Don't Repeat Yourself):** Avoid writing `headers: { Authorization: ... }` on every single API request.
2. **Centralized Authentication:** Handle session expiry, token refresh, or logouts in one central place.
3. **Unified Error Handling:** Log errors to monitoring tools like Sentry automatically when requests fail.
