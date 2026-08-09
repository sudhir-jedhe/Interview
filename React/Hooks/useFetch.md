A **`useFetch`** hook is one of the most common Senior React interview questions. A production-ready implementation should support:

✅ Loading state  
✅ Error handling  
✅ Cancellation (`AbortController`)  
✅ Refetch capability  
✅ Generic TypeScript support  
✅ Prevent memory leaks  
✅ Optional dependencies

---

# Basic useFetch Hook

```tsx
import { useEffect, useState } from "react";

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }

        const result = await response.json();

        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [url]);

  return {
    data,
    loading,
    error,
  };
}
```

---

# Usage

```tsx
type User = {
  id: number;
  name: string;
};

function Users() {
  const { data, loading, error } = useFetch<User[]>(
    "https://jsonplaceholder.typicode.com/users",
  );

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  return (
    <ul>
      {data?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

# Production Ready Version

Supports:

- AbortController
- Refetch
- Generic types
- Proper cleanup

```tsx
import { useCallback, useEffect, useState } from "react";

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useFetch<T>(url: string, options?: RequestInit) {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
        }));

        const response = await fetch(url, {
          ...options,
          signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();

        setState({
          data: result,
          loading: false,
          error: null,
        });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          error: err as Error,
        }));
      }
    },
    [url, options],
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}
```

---

# Usage with Refetch

```tsx
function Users() {
  const { data, loading, error, refetch } = useFetch<User[]>("/api/users");

  return (
    <>
      <button onClick={() => refetch()}>Refresh</button>

      {loading && <p>Loading...</p>}

      {error && <p>{error.message}</p>}

      {data?.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </>
  );
}
```

---

# Interview-Level Enhancements

## 1. Cache Responses

```tsx
const cache = new Map();
```

```tsx
if (cache.has(url)) {
  return cache.get(url);
}
```

Useful for:

- Search APIs
- Dropdown APIs
- Autocomplete

---

## 2. Request Deduplication

```tsx
const pendingRequests = new Map();
```

Avoids multiple requests:

```text
/api/users
/api/users
/api/users
```

Only one network call.

---

## 3. Retry Logic

```tsx
async function retryFetch(retries = 3) {
  try {
    return await fetch(url);
  } catch {
    if (retries > 0) {
      return retryFetch(retries - 1);
    }

    throw error;
  }
}
```

---

## 4. Polling

```tsx
setInterval(() => {
  fetchData();
}, 30000);
```

Useful for dashboards.

---

## 5. Stale-While-Revalidate (SWR Pattern)

```text
Return Cached Data Immediately
            ↓
Background API Call
            ↓
Update UI
```

Very common in enterprise applications.

---

# Advanced Generic API Hook

Instead of hardcoding `fetch`, create a reusable API layer.

```tsx
const apiClient = {
  get: (url: string) => fetch(url).then((r) => r.json()),

  post: (url: string, body: unknown) =>
    fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((r) => r.json()),
};
```

Hook:

```tsx
const { data } = useFetch<User[]>("/api/users");
```

---

# Senior React Interview Discussion

When discussing `useFetch`, mention:

### Performance

- Caching (LRU Cache)
- Request Deduplication
- Memoization

### Reliability

- AbortController
- Retry Mechanism
- Error Boundaries

### UX

- Loading States
- Empty States
- Skeleton Loaders

### Scalability

- SWR Pattern
- React Query / TanStack Query
- Server State vs Client State

### Complexity

| Operation          | Complexity           |
| ------------------ | -------------------- |
| Fetch              | O(1) Network Request |
| Cache Lookup       | O(1)                 |
| LRU Cache Eviction | O(1)                 |

### Interview Tip

If you're interviewing for a **React Lead / Frontend Architect** role, explain that in real-world applications you would typically prefer **TanStack Query (React Query)** over a custom `useFetch`, because it provides caching, retries, background refetching, request deduplication, optimistic updates, and stale-while-revalidate behaviour out of the box. A custom `useFetch` is valuable for understanding hooks fundamentals and for lightweight projects.

Here is a production-ready `useFetch` hook built with native `AbortController` cancellation, automated retry logic with exponential backoff, state management, and refetch capabilities.

```jsx
import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for HTTP data fetching with cancellation, retry logic, and cache support.
 *
 * @param {string} url - The target endpoint URL.
 * @param {Object} [options] - Standard RequestInit options plus hook configurations.
 * @param {boolean} [options.manual=false] - If true, delays fetching until execute() is called manually.
 * @param {number} [options.retries=3] - Maximum number of automated retry attempts.
 * @param {number} [options.retryDelay=1000] - Initial delay between retries in ms (exponential backoff).
 * @param {Function} [options.onSuccess] - Callback executed on successful fetch.
 * @param {Function} [options.onError] - Callback executed on failed fetch after all retries.
 */
export function useFetch(url, options = {}) {
  const {
    manual = false,
    retries = 0,
    retryDelay = 1000,
    onSuccess,
    onError,
    ...fetchOptions
  } = options;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(!manual);

  // Store options in refs to keep functions stable without stale closure issues
  const optionsRef = useRef(fetchOptions);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    optionsRef.current = fetchOptions;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  });

  // Track AbortController instance to cancel ongoing requests
  const abortControllerRef = useRef(null);

  const execute = useCallback(
    async (overrideUrl, overrideOptions) => {
      // Abort previous in-flight request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setError(null);

      const targetUrl = overrideUrl || url;
      const mergedOptions = {
        ...optionsRef.current,
        ...overrideOptions,
        signal: controller.signal,
      };

      let attempt = 0;

      while (attempt <= retries) {
        try {
          const response = await fetch(targetUrl, mergedOptions);

          if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
          }

          const result = await response.json();

          if (!controller.signal.aborted) {
            setData(result);
            setIsLoading(false);
            if (onSuccessRef.current) {
              onSuccessRef.current(result);
            }
          }
          return result;
        } catch (err) {
          // If explicitly aborted, break loop cleanly without reporting error
          if (err.name === "AbortError" || controller.signal.aborted) {
            return;
          }

          attempt++;

          if (attempt > retries) {
            if (!controller.signal.aborted) {
              setError(err);
              setIsLoading(false);
              if (onErrorRef.current) {
                onErrorRef.current(err);
              }
            }
            throw err;
          }

          // Exponential backoff delay before retrying
          const backoff = retryDelay * Math.pow(2, attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, backoff));
        }
      }
    },
    [url, retries, retryDelay]
  );

  useEffect(() => {
    if (!manual && url) {
      execute();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [url, manual, execute]);

  return {
    data,
    error,
    isLoading,
    refetch: execute,
    abort: () => abortControllerRef.current?.abort(),
  };
}

```

---

### Usage Examples

#### 1. Automatic Auto-Fetch with Retry Logic

```jsx
function UserProfile({ userId }) {
  const { data, isLoading, error, refetch } = useFetch(
    `https://api.example.com/users/${userId}`,
    {
      retries: 3, // Retries up to 3 times on network failure
      retryDelay: 500, // 500ms, 1000ms, 2000ms exponential backoff
      onSuccess: (data) => console.log("Loaded profile:", data),
    }
  );

  if (isLoading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error.message} <button onClick={refetch}>Retry</button></div>;

  return <div>Welcome, {data?.name}</div>;
}

```

#### 2. Manual Trigger (Form Submission / Mutation)

```jsx
function CreatePost() {
  const { execute, isLoading, error } = useFetch(
    "https://api.example.com/posts",
    { manual: true }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    await execute(undefined, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Post" }),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit Post"}
      </button>
      {error && <p style={{ color: "red" }}>{error.message}</p>}
    </form>
  );
}

```

---

### Key Features

- **Automatic Cancellation:** Uses native `AbortController` to cancel ongoing HTTP requests when the component unmounts or when `url` changes, preventing memory leaks and state updates on unmounted components.
- **Exponential Backoff Retries:** Retries failed requests up to `retries` times with configurable dynamic delay progression ($delay \times 2^{attempt}$).
- **Manual Mode (`manual: true`):** Can act as an imperative trigger for mutations (`POST`, `PUT`, `DELETE`) or user-initiated actions.
- **Refetch & Abort Manual Controls:** Returns `refetch` and explicit `abort()` functions to give consumer components full control.
