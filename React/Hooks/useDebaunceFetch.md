Here is a custom React hook `useDebouncedFetch` that packages debouncing, `AbortController` cancellation, state management (`data`, `loading`, `error`), and automatic unmount cleanup.

---

## Complete Custom Hook Implementation

```jsx
import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Custom React hook to execute debounced async fetches with AbortController cancellation.
 * 
 * @param {Function} fetcherFn - Function returning a promise: (query, { signal }) => Promise
 * @param {number} delay - Debounce delay in milliseconds
 */
export function useDebouncedFetch(fetcherFn, delay = 300) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // References to preserve state across renders without causing re-renders
  const timeoutRef = useRef(null);
  const controllerRef = useRef(null);
  const fetcherRef = useRef(fetcherFn);

  // Keep fetcherRef updated to avoid stale closure issues
  useEffect(() => {
    fetcherRef.current = fetcherFn;
  }, [fetcherFn]);

  // Cancel both pending timers and active in-flight network requests
  const cancel = useCallback((reason = 'Operation cancelled') => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (controllerRef.current) {
      controllerRef.current.abort(reason);
      controllerRef.current = null;
    }
    setLoading(false);
  }, []);

  // Main trigger function returned to the component
  const trigger = useCallback(
    (...args) => {
      // 1. Abort any previous timer and active network request
      cancel('Cancelled by new debounced invocation');

      setLoading(true);
      setError(null);

      return new Promise((resolve, reject) => {
        // 2. Set the debounce timer
        timeoutRef.current = setTimeout(async () => {
          timeoutRef.current = null;

          // 3. Create a fresh AbortController for this fetch
          const controller = new AbortController();
          controllerRef.current = controller;

          try {
            const result = await fetcherRef.current(...args, {
              signal: controller.signal,
            });

            setData(result);
            setLoading(false);
            resolve(result);
          } catch (err) {
            // Ignore intentional aborts in component error state
            if (err.name === 'AbortError') {
              reject(err);
              return;
            }

            setError(err);
            setLoading(false);
            reject(err);
          } finally {
            if (controllerRef.current === controller) {
              controllerRef.current = null;
            }
          }
        }, delay);
      });
    },
    [delay, cancel]
  );

  // Automatically cancel pending timer/requests when the component unmounts
  useEffect(() => {
    return () => {
      cancel('Component unmounted');
    };
  }, [cancel]);

  return { trigger, data, loading, error, cancel };
}

```

---

## Component Usage Example

```jsx
import React, { useState } from 'react';
import { useDebouncedFetch } from './useDebouncedFetch';

// API call wrapper accepting { signal }
const searchUsersApi = async (query, { signal }) => {
  if (!query.trim()) return [];
  const res = await fetch(`https://jsonplaceholder.typicode.com/users?q=${encodeURIComponent(query)}`, {
    signal,
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export function UserSearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { trigger: searchUsers, data: users, loading, error, cancel } = useDebouncedFetch(
    searchUsersApi,
    400
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      // Call debounced trigger
      searchUsers(value).catch((err) => {
        // Ignore AbortError in call site if needed
        if (err.name !== 'AbortError') console.error(err);
      });
    } else {
      cancel('Input cleared');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleInputChange}
        style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
      />

      {loading && <p>Loading results...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

      {users && !loading && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name} ({user.email})</li>
          ))}
        </ul>
      )}
    </div>
  );
}

```

---

## Key Design Considerations

1. **Unmount Protection:** The `useEffect` cleanup handler ensures that if a user navigates away or unmounts the component mid-request, both the timer and the HTTP request are cancelled immediately, avoiding memory leaks and state updates on unmounted components.
2. **Ref-Stable Fetcher:** Using `fetcherRef` ensures that changing inline function declarations passed as `fetcherFn` won't invalidate or recreate the debounced callback on every render.
3. **Promise Pass-through:** The returned `trigger` method returns a `Promise`, allowing you to either read state from `{ data, loading, error }` or use `await trigger(...)` directly inside event handlers.

Here is the fully typed TypeScript version of the `useDebouncedFetch` hook. It uses generics to automatically infer the return type of your fetch function as well as its parameters.

---

## TypeScript Implementation

```typescript
import { useState, useRef, useCallback, useEffect } from 'react';

// Options passed to the fetcher function by the hook
export interface FetcherOptions {
  signal: AbortSignal;
}

// Type constraint for the fetcher function
export type FetcherFn<TData, TArgs extends unknown[]> = (
  ...args: [...args: TArgs, options: FetcherOptions]
) => Promise<TData>;

// Return interface for the custom hook
export interface UseDebouncedFetchReturn<TData, TArgs extends unknown[]> {
  trigger: (...args: TArgs) => Promise<TData>;
  data: TData | null;
  loading: boolean;
  error: Error | null;
  cancel: (reason?: string) => void;
}

/**
 * Custom React hook to execute debounced async fetches with AbortController cancellation.
 *
 * @template TData - The resolved data type returned by the fetcher function
 * @template TArgs - Parameter types expected by the fetcher function (excluding { signal })
 */
export function useDebouncedFetch<TData, TArgs extends unknown[]>(
  fetcherFn: FetcherFn<TData, TArgs>,
  delay: number = 300
): UseDebouncedFetchReturn<TData, TArgs> {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const fetcherRef = useRef<FetcherFn<TData, TArgs>>(fetcherFn);

  // Keep fetcherRef synchronized without triggering re-renders
  useEffect(() => {
    fetcherRef.current = fetcherFn;
  }, [fetcherFn]);

  // Cancel active timers and in-flight HTTP requests
  const cancel = useCallback((reason: string = 'Operation cancelled'): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (controllerRef.current) {
      controllerRef.current.abort(reason);
      controllerRef.current = null;
    }
    setLoading(false);
  }, []);

  // Main trigger function with fully inferred parameter arguments
  const trigger = useCallback(
    (...args: TArgs): Promise<TData> => {
      cancel('Cancelled by new debounced invocation');

      setLoading(true);
      setError(null);

      return new Promise<TData>((resolve, reject) => {
        timeoutRef.current = setTimeout(async () => {
          timeoutRef.current = null;

          const controller = new AbortController();
          controllerRef.current = controller;

          try {
            const result = await fetcherRef.current(...args, {
              signal: controller.signal,
            });

            setData(result);
            setLoading(false);
            resolve(result);
          } catch (err) {
            const errorInstance =
              err instanceof Error ? err : new Error(String(err));

            if (errorInstance.name === 'AbortError') {
              reject(errorInstance);
              return;
            }

            setError(errorInstance);
            setLoading(false);
            reject(errorInstance);
          } finally {
            if (controllerRef.current === controller) {
              controllerRef.current = null;
            }
          }
        }, delay);
      });
    },
    [delay, cancel]
  );

  // Auto-cleanup on component unmount
  useEffect(() => {
    return () => {
      cancel('Component unmounted');
    };
  }, [cancel]);

  return { trigger, data, loading, error, cancel };
}

```

---

## Usage Example in TypeScript

The hook automatically infers argument types and return data types directly from the API function signature:

```tsx
import React, { useState, ChangeEvent } from 'react';
import { useDebouncedFetch, FetcherOptions } from './useDebouncedFetch';

interface User {
  id: number;
  name: string;
  email: string;
}

// Fetcher function signature explicitly defines TData (User[]) and TArgs ([string])
const searchUsersApi = async (
  query: string,
  options: FetcherOptions
): Promise<User[]> => {
  if (!query.trim()) return [];

  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users?q=${encodeURIComponent(query)}`,
    { signal: options.signal }
  );

  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json() as Promise<User[]>;
};

export function UserSearchTS(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // TData is automatically inferred as User[], TArgs as [string]
  const {
    trigger: searchUsers,
    data: users,
    loading,
    error,
    cancel,
  } = useDebouncedFetch(searchUsersApi, 400);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      // Type safe: TypeScript enforces passing a string here
      searchUsers(value).catch((err: Error) => {
        if (err.name !== 'AbortError') {
          console.error('Fetch error:', err.message);
        }
      });
    } else {
      cancel('Input cleared');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleInputChange}
        style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
      />

      {loading && <p>Loading results...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

      {users && !loading && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

```

---

## Type Safety Benefits

1. **Parameter Tuple Inference (`TArgs`):** The spread syntax `[...args: TArgs, options: FetcherOptions]` ensures that `trigger(...)` requires the exact same parameter signatures as your fetch function, minus the trailing `{ signal }` parameter.
2. **Return Type Inference (`TData`):** `data` is automatically typed as `TData | null`, removing the need for manual type assertions (`as User[]`) inside the component.
3. **Strict Error Guarding:** `err instanceof Error` normalizes non-standard thrown objects into standard `Error` instances so `error` state is always safe to access (`error.message`).

Here is a complete, working React + TypeScript example showing how to pair a debounced state value with TanStack Query v5.

---

## 1. Custom `useDebounce` State Hook

First, create a lightweight helper hook to delay updating a value until the user stops typing:

```typescript
// useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

```

---

## 2. Main Search Component with TanStack Query

In your component, pass the **debounced value** directly into `queryKey`. TanStack Query will automatically:

1. Wait for the debounced state to change before triggering the network call.
2. Provide a signal via `{ signal }` to automatically abort in-flight requests when a new search starts.
3. Serve instant cached results if the user types a previously searched phrase.

```tsx
// UserSearchQuery.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';

interface User {
  id: number;
  name: string;
  email: string;
}

// Fetcher function receiving the auto-generated AbortSignal
const fetchUsers = async (searchTerm: string, signal?: AbortSignal): Promise<User[]> => {
  if (!searchTerm.trim()) return [];

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users?q=${encodeURIComponent(searchTerm)}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch search results');
  }

  return response.json();
};

export function UserSearchQuery() {
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Debounce the raw input state (400ms delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // 2. TanStack Query reacts directly to changes in debouncedSearchTerm
  const {
    data: users = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    // Adding debouncedSearchTerm to the queryKey causes the query to execute when it changes
    queryKey: ['users', debouncedSearchTerm],
    
    // TanStack Query automatically passes { signal } into queryFn for request cancellation
    queryFn: ({ signal }) => fetchUsers(debouncedSearchTerm, signal),

    // Prevent query execution when the input is empty
    enabled: debouncedSearchTerm.trim().length > 0,

    // Caching configuration
    staleTime: 1000 * 60 * 5, // Keep fresh in cache for 5 minutes
    placeholderData: (previousData) => previousData, // Keeps previous results visible while fetching new ones
  });

  return (
    <div style={{ padding: '20px', maxWidth: '400px', fontFamily: 'sans-serif' }}>
      <h2>User Search (TanStack Query)</h2>
      
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
      />

      <div style={{ marginTop: '10px', minHeight: '24px' }}>
        {/* Show a subtle background indicator if re-fetching existing query */}
        {isFetching && <small style={{ color: '#666' }}>Updating results...</small>}
      </div>

      {isLoading && <p>Loading initial results...</p>}

      {error && (
        <p style={{ color: 'red' }}>
          Error: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      )}

      {users.length > 0 && (
        <ul style={{ paddingLeft: '20px' }}>
          {users.map((user) => (
            <li key={user.id}>
              <strong>{user.name}</strong> ({user.email})
            </li>
          ))}
        </ul>
      )}

      {!isLoading && debouncedSearchTerm && users.length === 0 && (
        <p>No results found for "{debouncedSearchTerm}"</p>
      )}
    </div>
  );
}

```

---

## 3. App Setup / Provider Wrapper

Ensure your app root wraps components with `QueryClientProvider`:

```tsx
// App.tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserSearchQuery } from './UserSearchQuery';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserSearchQuery />
    </QueryClientProvider>
  );
}

```

---

## Why This Pattern Is Efficient

* **Auto Request Cancellation:** If `debouncedSearchTerm` changes while a previous HTTP fetch is in progress, TanStack Query calls `signal.abort()` on the prior fetch automatically.
* **UI Stability (`placeholderData`):** Using `placeholderData: (previousData) => previousData` keeps the old search results rendered on screen until the new results land, preventing disruptive layout flashes while typing.
* **Zero Custom Abort Logic:** No manual `useRef` or state updates are needed to handle unmounting or racing promises.
