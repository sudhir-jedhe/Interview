A **Custom Hook** is a JavaScript function whose name starts with **`use`** (e.g., `useFetch`, `useLocalStorage`) and that can call other React hooks (`useState`, `useEffect`, `useCallback`, etc.).

Custom hooks allow you to extract component logic into reusable functions. Instead of duplicating state management, side effects, or event handling across multiple components, you encapsulate that logic once inside a custom hook and share it cleanly across your application.

---

## 1. Rules for Custom Hooks

1. **Must Start with `use`:** React’s linter uses the `use` prefix to enforce the Rules of Hooks (e.g., ensuring hooks are called unconditionally at the top level).
2. **Call Other Hooks:** A custom hook must use at least one built-in React hook (`useState`, `useEffect`, etc.). If a function doesn't use any React hooks, it should just be a standard utility function.
3. **Isolated State:** Each time a component calls a custom hook, all state and effects inside that hook are **completely isolated**. Calling the same hook in two different components does *not* share state between them—they get independent state instances.

---

## 2. Designing a Production-Ready Custom Hook

Let's design a reusable, type-safe **`useFetch`** hook for React 19 that handles data fetching, loading/error states, auto-re-fetching on parameter changes, and race-condition cancellation using `AbortController`.

### The Hook Implementation (`useFetch.ts`)

```typescript
import { useState, useEffect, useCallback } from 'react';

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

interface FetchOptions extends RequestInit {
  // Option to skip automatic execution
  enabled?: boolean; 
}

export function useFetch<T = unknown>(url: string, options: FetchOptions = {}) {
  const { enabled = true, ...fetchOptions } = options;

  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: enabled,
    error: null,
  });

  // Stable memoized fetch function allowing manual refetching
  const executeFetch = useCallback(async (signal?: AbortSignal) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(url, { ...fetchOptions, signal });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result: T = await response.json();
      setState({ data: result, isLoading: false, error: null });
    } catch (err: any) {
      // Ignore abort errors caused by intentional cancellation
      if (err.name === 'AbortError') return;

      setState({ data: null, isLoading: false, error: err instanceof Error ? err : new Error('Unknown error') });
    }
  }, [url, JSON.stringify(fetchOptions)]);

  useEffect(() => {
    if (!enabled || !url) return;

    // Create AbortController to prevent race conditions on fast URL changes
    const controller = new AbortController();

    executeFetch(controller.signal);

    // Cleanup: Cancel pending request if URL changes or component unmounts
    return () => {
      controller.abort();
    };
  }, [url, enabled, executeFetch]);

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    refetch: () => executeFetch(), // Manual refetch trigger
  };
}

```

---

## 3. How to Use the Custom Hook in Components

Now any component can consume this complex data-fetching, loading, error, and cancellation logic in a single line:

```tsx
import React from 'react';
import { useFetch } from './useFetch';

interface User {
  id: number;
  name: string;
  email: string;
}

export function UserProfile({ userId }: { userId: number }) {
  // Clean, declarative consumption!
  const { data: user, isLoading, error, refetch } = useFetch<User>(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  if (isLoading) return <div>Loading user details...</div>;
  if (error) return <div>Error: {error.message} <button onClick={refetch}>Retry</button></div>;
  if (!user) return <div>No user found</div>;

  return (
    <div className="card">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={refetch}>Reload Profile</button>
    </div>
  );
}

```

---

## 4. Best Practices for Custom Hook Design

1. **Accept Options & Return Objects:** Accept configurable parameters (like `options`) and return an object `{ data, isLoading, error }` instead of an array `[data, isLoading]`. An object allows consumers to destructure only what they need and prevents order-dependent bugs.
2. **Handle Cleanup Properly:** Always clean up side effects (e.g., clearing timers, removing event listeners, or aborting HTTP requests using `AbortController`).
3. **Keep Hooks Focused (Single Responsibility):** A hook should do one job well (e.g., `useLocalStorage`, `useWindowSize`, `useDebounce`). If a hook becomes too large, compose smaller custom hooks inside it.
4. **Preserve Referential Equality:** Wrap functions returned by custom hooks in `useCallback` so consumers can safely pass them into dependency arrays or child components without causing extra re-renders.
