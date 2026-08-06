An **Async Fetcher with Error Handling** is a common JavaScript/React interview question. The interviewer usually expects:

✅ Async/Await  
✅ Loading State  
✅ Error Handling  
✅ Retry Logic  
✅ Timeout Handling  
✅ Request Cancellation  
✅ Generic Reusability

***

# Basic Async Fetcher

```javascript
async function fetchData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `HTTP Error: ${response.status}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Fetch Failed:", error);

    throw error;
  }
}
```

### Usage

```javascript
async function getUsers() {
  try {
    const users = await fetchData(
      "https://jsonplaceholder.typicode.com/users"
    );

    console.log(users);
  } catch (error) {
    console.error(error.message);
  }
}
```

***

# Generic Fetch Wrapper

Suitable for APIs across an application.

```javascript
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function fetcher(
  url,
  options = {}
) {
  try {
    const response = await fetch(
      url,
      options
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.message ||
          "Something went wrong"
      );
    }

    return data;
  } catch (error) {
    console.error(error);

    throw error;
  }
}
```

***

# Usage

```javascript
try {
  const users = await fetcher(
    "/api/users"
  );

  console.log(users);
} catch (error) {
  console.log(error.message);
}
```

***

# Retry Logic

Very common interview follow-up.

```javascript
async function fetchWithRetry(
  url,
  retries = 3
) {
  try {
    const response = await fetch(
      url
    );

    if (!response.ok) {
      throw new Error(
        "Network Error"
      );
    }

    return response.json();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }

    console.log(
      `Retrying... Remaining:${retries}`
    );

    return fetchWithRetry(
      url,
      retries - 1
    );
  }
}
```

### Usage

```javascript
const data =
  await fetchWithRetry(
    "/api/users",
    3
  );
```

***

# Exponential Backoff Retry

Production systems commonly use this.

```javascript
function sleep(ms) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

async function fetchWithBackoff(
  url,
  retries = 3,
  delay = 1000
) {
  try {
    const response = await fetch(
      url
    );

    if (!response.ok) {
      throw new Error(
        "Request Failed"
      );
    }

    return response.json();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }

    await sleep(delay);

    return fetchWithBackoff(
      url,
      retries - 1,
      delay * 2
    );
  }
}
```

***

# Request Timeout

Many APIs should fail after a configurable timeout.

```javascript
async function fetchWithTimeout(
  url,
  timeout = 5000
) {
  const controller =
    new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(
      url,
      {
        signal: controller.signal,
      }
    );

    clearTimeout(timer);

    return response.json();
  } catch (error) {
    if (
      error.name === "AbortError"
    ) {
      throw new Error(
        "Request Timeout"
      );
    }

    throw error;
  }
}
```

***

# Request Cancellation

Important in React search/autocomplete scenarios.

```javascript
const controller =
  new AbortController();

fetch("/api/users", {
  signal: controller.signal,
});

// Cancel Request
controller.abort();
```

***

# Production-Ready Fetch Utility

Combines:

* Retry
* Timeout
* Error Handling
* AbortController

```javascript
async function apiFetch(
  url,
  {
    method = "GET",
    headers = {},
    body,
    timeout = 5000,
    retries = 2,
  } = {}
) {
  const controller =
    new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(
      url,
      {
        method,
        headers: {
          "Content-Type":
            "application/json",
          ...headers,
        },
        body: body
          ? JSON.stringify(body)
          : undefined,
        signal: controller.signal,
      }
    );

    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    if (
      retries > 0 &&
      error.name !== "AbortError"
    ) {
      return apiFetch(url, {
        method,
        headers,
        body,
        timeout,
        retries: retries - 1,
      });
    }

    throw error;
  }
}
```

***

# React Hook Integration

```tsx
const {
  data,
  loading,
  error,
} = useFetch("/api/users");
```

Internally:

```text
Component
    ↓
useFetch
    ↓
apiFetch
    ↓
Retry / Timeout
    ↓
Response
```

***

# Senior Frontend Interview Discussion Points

When designing an async fetcher, mention:

### Reliability

* Retry mechanism
* Exponential backoff
* Timeout handling
* Request cancellation

### Performance

* Response caching
* LRU cache
* Request deduplication

### UX

* Loading state
* Skeleton loaders
* Empty state
* Error fallback UI

### Security

* Auth token injection
* CSRF protection
* Refresh token handling

### Scalability

* Centralised API client
* Axios interceptors / Fetch wrapper
* React Query / TanStack Query
* SWR (Stale-While-Revalidate)

### Architecture

```text
UI
 ↓
useFetch
 ↓
ApiClient
 ↓
Retry Layer
 ↓
Cache Layer
 ↓
Backend API
```

For a **Senior React/Frontend Lead interview**, a strong answer is not just writing `fetch()`, but demonstrating how you would handle failures, retries, cancellation, caching, and scalability in a real production application.
