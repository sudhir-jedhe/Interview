Here is a complete, production-grade **senior-level scenario interview question** on the `fetch` API that is frequently used in Frontend and Full-Stack JavaScript interviews to evaluate architectural design and error-handling mastery.

---

### The Interview Scenario

> *"We want you to design and implement a robust, production-ready **API Client wrapper** around the native `fetch` API. In a large-scale application, a simple `fetch()` call is not enough. Your wrapper must handle four critical requirements: automatic authentication headers, request timeouts, automatic token refresh when a `401 Unauthorized` occurs, and an automatic retry mechanism for flaky network conditions."*

---

### Step-by-Step Architectural Breakdown

To solve this, your implementation needs to address:

1. **Default Configuration & Auth Injection:** Automatically attach content-type headers and JWT tokens from storage.
2. **Timeout Protection:** Prevent requests from hanging infinitely using `AbortController` and `setTimeout`.
3. **Token Refresh Interception:** Catch `401` responses, request a new token using a refresh token, and transparently retry the failed request without bothering the user.
4. **Resilient Retries:** Handle transient network errors or server crashes (`5xx`) with a retry loop.

---

### The Complete Production Solution

```javascript
// Helper for handling timeouts
async function fetchWithTimeout(url, options, timeoutMs = 8000) {
  const controller = new AbortController();
  // Merge signal if user passed one, or use our timeout controller
  const signal = options.signal || controller.signal;

  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...options, signal });
    clearTimeout(timer);
    return response;
  } catch (error) {
    clearTimeout(timer);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
}

// Global flag to prevent multiple simultaneous token refresh calls
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

// Main Production API Client Wrapper
async function apiClient(endpoint, options = {}, retries = 2) {
  const token = localStorage.getItem('accessToken');

  // 1. Setup Headers and Body Serialization
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...(options.headers || {})
  };

  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    body = JSON.stringify(body);
  }

  const config = {
    ...options,
    headers,
    body
  };

  try {
    // 2. Execute Request with Timeout
    const response = await fetchWithTimeout(endpoint, config, options.timeout || 10000);

    // 3. Handle 401 Unauthorized (Token Expiration & Refresh)
    if (response.status === 401 && !options._retry) {
      if (isRefreshing) {
        // If a refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(newToken => {
          config.headers['Authorization'] = `Bearer ${newToken}`;
          options._retry = true;
          return apiClient(endpoint, options, retries);
        }).catch(err => {
          throw err;
        });
      }

      options._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const refreshResponse = await fetch('/api/v1/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });

        if (!refreshResponse.ok) {
          throw new Error('Refresh token expired');
        }

        const data = await refreshResponse.json();
        localStorage.setItem('accessToken', data.accessToken);
        isRefreshing = false;

        processQueue(null, data.accessToken);

        // Retry original request with new token
        config.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return apiClient(endpoint, options, retries);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = '/login'; // Force re-authentication
        throw refreshError;
      }
    }

    // 4. Handle Server or Client Errors
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const errorMessage = errorBody.message || `HTTP Error! Status: ${response.status}`;
      
      // If it's a 5xx server error and we have retries left, trigger retry logic
      if (response.status >= 500 && retries > 0) {
        throw new Error('SERVER_ERROR');
      }

      throw new Error(errorMessage);
    }

    // 5. Parse Response Safely (Handle 204 No Content)
    if (response.status === 204) return null;
    return await response.json();

  } catch (error) {
    if (error.message === 'SERVER_ERROR' && retries > 0) {
      console.warn(`Retrying request... Attempts left: ${retries}`);
      await new Promise(res => setTimeout(res, 1000)); // 1s delay
      return apiClient(endpoint, options, retries - 1);
    }
    throw error;
  }
}

```

---

### Key Discussion Points Expected by Interviewers

1. **Preventing Infinite Refresh Loops:** Notice the `options._retry` flag. If a token refresh succeeds, but a subsequent request *still* returns `401`, setting `_retry = true` prevents the app from getting stuck in an infinite token-refresh loop.
2. **Request Queueing (`failedQueue`):** If 5 concurrent API calls are made while the access token is expired, you don't want to trigger 5 separate refresh requests. The queue pattern ensures only *one* refresh call happens, and all pending requests wait for its result and then retry simultaneously.
3. **Idempotency & Retries:** Mentioning that automatic retries should only be performed on safe/idempotent methods (`GET`, `PUT`, `DELETE`) or explicit `5xx` server failures, while `POST` requests require careful duplicate handling to prevent creating duplicate records (like double-charging a credit card).
