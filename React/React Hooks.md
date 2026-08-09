Core React Hooks allow function components to manage state, handle side effects, and process complex state logic without writing class components.

Here is a breakdown of **`useState`**, **`useEffect`**, and **`useReducer`** with practical, real-world examples.

---

## 1. `useState`: Local Component State

`useState` declares a state variable in a functional component. It returns an array with two elements:

1. The **current state value**.
2. A **setter function** to update the state value and trigger a re-render.

### Key Rules

* Always use functional updates (`setCount(prev => prev + 1)`) when the new state depends on the previous state to avoid race conditions and stale closures.
* Object and array state updates must be **immutable** (create a new copy using the spread operator `...`).

### Practical Example: Toggleable Password Input

```tsx
import React, { useState } from 'react';

export function PasswordInput() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    // Functional state update
    setShowPassword((prev) => !prev);
  };

  return (
    <div style={{ padding: '16px' }}>
      <label htmlFor="pwd">Password: </label>
      <input
        id="pwd"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="button" onClick={toggleVisibility} style={{ marginLeft: '8px' }}>
        {showPassword ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}

```

---

## 2. `useEffect`: Handling Side Effects

`useEffect` lets you perform **side effects** (data fetching, DOM manipulation, timers, subscriptions) after rendering.

### Dependency Array Behavior

```
useEffect(effectFunction, [dependencies])

```

* **No array (`undefined`):** Runs after *every* render.
* **Empty array (`[]`):** Runs **once** after initial mount (equivalent to `componentDidMount`).
* **With values (`[a, b]`):** Runs after mount AND whenever `a` or `b` changes.
* **Cleanup Function:** If `useEffect` returns a function, React executes it before unmounting or re-running the effect.

### Practical Example: Window Resizer & Data Fetcher with AbortController

```tsx
import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
}

export function UserFetcher({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create AbortController to cancel pending API requests if userId changes quickly
    const controller = new AbortController();
    setLoading(true);

    async function fetchUser() {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
          signal: controller.signal,
        });
        const data = await response.json();
        setUser(data);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Fetch error:', error);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUser();

    // CLEANUP FUNCTION: Aborts stale fetch request when userId changes or component unmounts
    return () => {
      controller.abort();
    };
  }, [userId]); // Re-runs whenever userId changes

  if (loading) return <p>Loading user profile...</p>;

  return (
    <div>
      <h3>User Details</h3>
      <p>Name: {user?.name}</p>
    </div>
  );
}

```

---

## 3. `useReducer`: Managing Complex State Logic

`useReducer` is an alternative to `useState` for managing **complex state logic**, state objects with multiple sub-values, or when the next state depends on multiple previous actions.

It follows Redux-like mechanics: `(state, action) => newState`.

### When to Prefer `useReducer` over `useState`

* Multiple state values change together in response to a single event.
* State logic is complex and needs to be tested in isolation outside components.

### Practical Example: Complex Form State with Validation

```tsx
import React, { useReducer } from 'react';

// 1. Define State & Action Types
interface FormState {
  username: string;
  email: string;
  isSubmitting: boolean;
  error: string | null;
}

type FormAction =
  | { type: 'SET_FIELD'; field: 'username' | 'email'; value: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; error: string };

const initialState: FormState = {
  username: '',
  email: '',
  isSubmitting: false,
  error: null,
};

// 2. Pure Reducer Function
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        error: null, // Clear error on typing
      };
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true, error: null };
    case 'SUBMIT_SUCCESS':
      return { ...initialState }; // Reset form
    case 'SUBMIT_ERROR':
      return { ...state, isSubmitting: false, error: action.error };
    default:
      return state;
  }
}

export function RegistrationForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!state.username || !state.email) {
      dispatch({ type: 'SUBMIT_ERROR', error: 'All fields are required.' });
      return;
    }

    dispatch({ type: 'SUBMIT_START' });

    // Simulate async submission
    setTimeout(() => {
      dispatch({ type: 'SUBMIT_SUCCESS' });
      alert('Registration Successful!');
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '300px', padding: '16px' }}>
      <h3>Register</h3>

      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}

      <div>
        <label>Username: </label>
        <input
          type="text"
          value={state.username}
          onChange={(e) =>
            dispatch({ type: 'SET_FIELD', field: 'username', value: e.target.value })
          }
        />
      </div>

      <div style={{ marginTop: '8px' }}>
        <label>Email: </label>
        <input
          type="email"
          value={state.email}
          onChange={(e) =>
            dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })
          }
        />
      </div>

      <button
        type="submit"
        disabled={state.isSubmitting}
        style={{ marginTop: '12px' }}
      >
        {state.isSubmitting ? 'Registering...' : 'Submit'}
      </button>
    </form>
  );
}

```

---

## Summary Comparison

| Hook             | Primary Purpose                 | Returns                      | Best Used For                                                      |
| ---------------- | ------------------------------- | ---------------------------- | ------------------------------------------------------------------ |
| **`useState`**   | Local primitive/object state    | `[value, setValue]`          | Simple UI toggles, string/number inputs, basic flags.              |
| **`useEffect`**  | Side effects & lifecycle events | `void` (or cleanup function) | API calls, subscriptions, event listeners, DOM timers.             |
| **`useReducer`** | Complex state transitions       | `[state, dispatch]`          | Multi-field forms, wizard flows, state machines with many actions. |

Show me how to create reusable custom React hooks with practical examples.

Custom React Hooks are JavaScript functions whose names start with **`use`** (e.g., `useLocalStorage`, `useFetch`, `useDebounce`) that allow you to extract and reuse stateful logic across multiple components.

Instead of duplicating `useState` or `useEffect` code across different parts of your application, you bundle the logic into a standalone custom hook.

---

## The Rules of Custom Hooks

1. **Name Must Start with `use`:** React enforces this convention so linter plugins know how to enforce hook rules.
2. **Can Call Other Hooks:** Custom hooks can freely call built-in hooks (`useState`, `useEffect`, `useCallback`, etc.).
3. **Isolated State:** Each time a component calls a custom hook, all state and effects inside that custom hook are **completely isolated** to that specific component instance.

---

## Example 1: `useLocalStorage` (Persistent State)

This custom hook mirrors `useState`, but automatically syncs state changes to `window.localStorage` so data persists across page refreshes.

```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // 1. Initialize state from localStorage or fall back to initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 2. Sync state updates to localStorage whenever key or storedValue changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

```

### Component Usage

```tsx
import { useLocalStorage } from './hooks/useLocalStorage';

export function ThemeToggle() {
  // Works exactly like useState, but persists to localStorage key "app_theme"
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('app_theme', 'light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button onClick={toggleTheme}>
      Current Theme: {theme} (Click to toggle)
    </button>
  );
}

```

---

## Example 2: `useDebounce` (Optimizing Search Inputs & API Calls)

When a user types into a search input, firing an API request on every single keystroke creates performance bottlenecks. `useDebounce` delays updating a value until the user stops typing for a specified time interval (e.g., 500ms).

```typescript
// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delayMs: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update debouncedValue after delayMs
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    // Cancel timer if value or delayMs changes before timeout completes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

```

### Component Usage

```tsx
import React, { useState, useEffect } from 'react';
import { useDebounce } from './hooks/useDebounce';

export function SearchUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debounce the input by 500ms
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      console.log(`Executing API search query for: "${debouncedSearchTerm}"`);
      // Trigger API search request here
    }
  }, [debouncedSearchTerm]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <p>Immediate Value: {searchTerm}</p>
      <p>Debounced API Value: {debouncedSearchTerm}</p>
    </div>
  );
}

```

---

## Example 3: `useFetch` (Declarative Data Fetching with Cancellation)

This custom hook encapsulates asynchronous data fetching, automatic `AbortController` request cancellation on unmount, loading states, and error handling.

```typescript
// hooks/useFetch.ts
import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });

    async function fetchData() {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setState({ data, loading: false, error: null });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setState({ data: null, loading: false, error: err as Error });
        }
      }
    }

    fetchData();

    // Abort request if component unmounts or URL changes
    return () => {
      controller.abort();
    };
  }, [url]);

  return state;
}

```

### Component Usage

```tsx
import { useFetch } from './hooks/useFetch';

interface Post {
  id: number;
  title: string;
}

export function PostsList() {
  const { data: posts, loading, error } = useFetch<Post[]>('https://jsonplaceholder.typicode.com/posts');

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error loading posts: {error.message}</p>;

  return (
    <ul>
      {posts?.slice(0, 5).map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

```

---

## Example 4: `useMediaQuery` (Responsive UI in JS)

This custom hook listens to CSS media queries dynamically in JavaScript using `window.matchMedia`, allowing components to conditionally render UI based on viewport width.

```typescript
// hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

    // Modern matchMedia listener API
    mediaQueryList.addEventListener('change', listener);

    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}

```

### Component Usage

```tsx
import { useMediaQuery } from './hooks/useMediaQuery';

export function ResponsiveNavigation() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <nav>
      {isMobile ? (
        <button aria-label="Open Mobile Menu">☰ Menu</button>
      ) : (
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      )}
    </nav>
  );
}

```

---

## Summary Checklist for Creating Custom Hooks

1. **Extract repeated logic:** If you write the same `useEffect` + `useState` combo twice in different files, create a custom hook.
2. **Keep hooks focused:** A custom hook should do **one thing well** (e.g., fetch data, manage debouncing, or sync storage).
3. **Return tuple or object:**

* Return a **tuple array** (`[value, setter]`) if the user can name the returned values freely (like `useState`).
* Return an **object** (`{ data, loading, error }`) if returning 3 or more named properties (like `useFetch`).
