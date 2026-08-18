Implementing silent JWT refresh with Axios requires solving the **thundering herd** problem: when multiple concurrent requests receive a `401 Unauthorized` because an access token expired, the client must trigger **only one** refresh network call while queuing all other failed requests until the new token is acquired.

---

### 1. Token Store & State Management (`utils/tokenStore.ts`)

Keep the access token in memory (or secure store) and expose getter/setter methods:

```typescript
let inMemoryAccessToken: string | null = null;

export const tokenStore = {
  getAccessToken: () => inMemoryAccessToken,
  setAccessToken: (token: string | null) => {
    inMemoryAccessToken = token;
  },
  clear: () => {
    inMemoryAccessToken = null;
  },
};

```

---

### 2. Axios Client with Request Queuing (`services/apiClient.ts`)

Use two flags and a promise callback queue:

* `isRefreshing`: Tracks if a refresh API call is currently in-flight.
* `failedQueue`: Holds callbacks for requests waiting on the new token.

```typescript
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenStore } from '../utils/tokenStore';

// Extend Axios config to track retry attempts
declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Needed if your refresh token lives in an HttpOnly cookie
});

// Dedicated client for token refresh to avoid interceptor recursion
const authClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// -------------------------------------------------------------
// 1. Request Interceptor: Attach Current Access Token
// -------------------------------------------------------------
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStore.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------------------------------------------------
// 2. Response Interceptor: Handle 401 & Concurrent Refresh
// -------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Pass through non-401 errors or requests missing configuration
    if (!error.response || error.response.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // If the 401 is already on a retry or from the refresh endpoint itself, log out
    if (originalRequest._retry || originalRequest.url?.includes('/auth/refresh')) {
      tokenStore.clear();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // If a refresh is ALREADY in flight, queue this request until it resolves
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // Otherwise, this request is the first to hit 401: Initiate Refresh
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Refresh endpoint returns the new access token
      // (Refresh token is sent via HttpOnly cookie or body)
      const { data } = await authClient.post<{ accessToken: string }>('/auth/refresh');
      const newAccessToken = data.accessToken;

      tokenStore.setAccessToken(newAccessToken);

      // Re-set default header for subsequent requests
      apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

      // Flush and resolve all queued in-flight requests with the new token
      processQueue(null, newAccessToken);

      // Retry the original request that failed first
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      // If refresh token has expired, purge queue, clear state, and redirect
      processQueue(refreshError, null);
      tokenStore.clear();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

```

---

### Request Execution Flow

```
Page Load / Multiple Concurrent Calls
  ├── Request A (401 Expired) ──> isRefreshing = true  ──> Calls /auth/refresh
  ├── Request B (401 Expired) ──> isRefreshing = true  ──> Pushed to failedQueue[]
  └── Request C (401 Expired) ──> isRefreshing = true  ──> Pushed to failedQueue[]
                                         │
                               /auth/refresh returns 200 (New Token)
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
         Retries Request A                    processQueue() flushes B & C
     (Resolves with new token)               (Both retried with new token)

```

---

### Key Protections & Edge Cases

* **Dedicated `authClient` Instance:** Using a separate Axios instance for `/auth/refresh` prevents infinite loops if the refresh endpoint itself returns a `401`.
* **Cookie-Based Refresh Tokens (`HttpOnly`):** `withCredentials: true` ensures the browser sends the refresh token cookie securely without exposing it to JavaScript/XSS vectors.
* **`_retry` Guard:** Marks requests that have already been retried once to prevent recursive retry loops if an endpoint persistently rejects credentials.
* **Synchronous Queue Flush:** If `/auth/refresh` fails with a 403 or network error, `processQueue(refreshError, null)` rejects every waiting promise at once so no unresolved promises hang in memory.
