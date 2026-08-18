Managing asynchronous network requests with `AbortController` prevents **race conditions** (where an older, slower request overwrites newer data) and avoids memory/state updates after a component unmounts.

---

**Pattern 1: Declarative Data-Fetching Hook (`useFetch`)**

This hook cancels the in-flight request automatically whenever the `url` changes or the component unmounts.

```typescript
import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export function useFetch<T = unknown>(url: string | null): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(url));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!url) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    // 1. Create a new instance per effect run
    const controller = new AbortController();
    const { signal } = controller;

    setIsLoading(true);
    setError(null);

    fetch(url, { signal })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json() as Promise<T>;
      })
      .then((json) => {
        setData(json);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        // 2. Ignore abort errors – they are expected cancellations
        if (err.name === 'AbortError') {
          return;
        }
        setError(err);
        setIsLoading(false);
      });

    // 3. Cleanup: abort in-flight fetch when url changes or component unmounts
    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, isLoading, error };
}

```

---

**Pattern 2: Imperative / Debounced Async Hook (`useDebouncedFetch`)**

When requests are triggered by user actions (like a debounced search input), keep a mutable `controllerRef` to abort the previous in-flight request before dispatching a new one.

```typescript
import { useState, useRef, useEffect, useCallback } from 'react';

type FetcherFn<T, Args extends unknown[]> = (signal: AbortSignal, ...args: Args) => Promise<T>;

export function useDebouncedAsync<T, Args extends unknown[]>(
  fetcher: FetcherFn<T, Args>,
  delay = 300
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const controllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetcherRef = useRef(fetcher);

  // Keep fetcher reference fresh
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  // Clean up any ongoing timer or request on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, []);

  const trigger = useCallback((...args: Args) => {
    // Clear scheduled timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      // 1. Abort previous in-flight request before starting a new one
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      const controller = new AbortController();
      controllerRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        const result = await fetcherRef.current(controller.signal, ...args);
        setData(result);
      } catch (err: unknown) {
        const errorObject = err instanceof Error ? err : new Error(String(err));
        if (errorObject.name !== 'AbortError') {
          setError(errorObject);
        }
      } finally {
        // Clear active controller reference if this request was the current one
        if (controllerRef.current === controller) {
          controllerRef.current = null;
          setIsLoading(false);
        }
      }
    }, delay);
  }, [delay]);

  return { trigger, data, isLoading, error };
}

```

---

**Usage Example: Debounced Search Input**

```tsx
import React from 'react';
import { useDebouncedAsync } from './useDebouncedAsync';

interface User {
  id: number;
  name: string;
}

export function LiveUserSearch() {
  const { trigger, data: users, isLoading, error } = useDebouncedAsync(
    async (signal: AbortSignal, query: string): Promise<User[]> => {
      if (!query.trim()) return [];
      const res = await fetch(`https://jsonplaceholder.typicode.com/users?q=${encodeURIComponent(query)}`, {
        signal,
      });
      return res.json();
    },
    350
  );

  return (
    <div style={{ maxWidth: '350px', padding: '16px' }}>
      <input
        type="text"
        placeholder="Search users..."
        onChange={(e) => trigger(e.target.value)}
        style={{ width: '100%', padding: '8px' }}
      />

      {isLoading && <p style={{ color: '#666' }}>Searching...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

      <ul>
        {users?.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

```

---

**Key Guardrails**

* **Catch `AbortError`:** Aborted fetches reject with a DOMException named `'AbortError'`. Always filter out `err.name === 'AbortError'` in catch blocks to avoid treating normal cancellations as user-facing errors.
* **Axios Support:** Axios supports standard `AbortSignal` directly via its config: `axios.get(url, { signal: controller.signal })`.
* **Axios-specific error handling:** Check with `axios.isCancel(err)` or `err.name === 'CanceledError'`.
