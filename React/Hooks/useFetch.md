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
