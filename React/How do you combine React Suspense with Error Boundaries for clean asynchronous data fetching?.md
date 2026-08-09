Combining **React Suspense** with **Error Boundaries** creates a clean, declarative paradigm for asynchronous data fetching often called the **"Suspense Fallback Pattern"**.

Instead of littering your components with `if (loading)` and `if (error)` conditional checks, you let React delegate loading states to `<Suspense>` and runtime errors to an `<ErrorBoundary>`.

---

### Declarative Architecture Pattern

```text
┌────────────────────────────────────────────────────────┐
│ <ErrorBoundary fallback={<ErrorUI />}>                 │
│   ┌──────────────────────────────────────────────────┐ │
│   │ <Suspense fallback={<LoadingSpinner />}>         │ │
│   │   ┌────────────────────────────────────────────┐ │ │
│   │   │ <UserProfile /> (Clean business logic)     │ │ │
│   │   │ Reads data as if it were already loaded    │ │ │
│   │   └────────────────────────────────────────────┘ │ │
│   └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘

```

When `<UserProfile/>` fetches data:

1. **While Pending:** The component "suspends" (throws a Promise), causing React to render the nearest `<Suspense>` fallback (`<LoadingSpinner/>`).
2. **If Fulfilled:** The component renders its UI with the resolved data directly.
3. **If Rejected:** The data source throws an error, causing React to unwind to the nearest `<ErrorBoundary>` fallback (`<ErrorUI/>`).

---

### Complete Code Implementation

The easiest way to implement this pattern in modern React is using **`react-error-boundary`** paired with **TanStack Query (React Query)** or **RTK Query**, which natively support the `suspense: true` flag.

#### 1. Install `react-error-boundary`

```bash
npm install react-error-boundary @tanstack/react-query

```

#### 2. Create the Fallback Components

```jsx
// LoadingFallback.jsx
export function LoadingFallback() {
  return (
    <div className="skeleton-loader" style={{ padding: '20px', background: '#f0f0f0' }}>
      <p>🌀 Loading user profile...</p>
    </div>
  );
}

// ErrorFallback.jsx
export function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="error-card" style={{ padding: '20px', border: '1px solid red', color: 'red' }}>
      <h3>⚠️ Failed to load profile!</h3>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
}

```

#### 3. Create the Data-Fetching Component (Clean & Synchronous-Looking)

Notice how `<UserProfile/>` contains **zero `if (isLoading)` or `if (isError)` checks**. It assumes the data is available synchronously:

```jsx
// UserProfile.jsx
import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchUser = async (userId) => {
  const res = await axios.get(`https://api.example.com/users/${userId}`);
  return res.data;
};

export function UserProfile({ userId }) {
  // useSuspenseQuery guarantees 'data' is defined and resolved on render
  const { data: user } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  return (
    <div className="user-card">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}

```

#### 4. Combine Suspense and ErrorBoundary at the Container Level

Wrap your suspended component with `<ErrorBoundary>` on the outside and `<Suspense>` on the inside:

```jsx
// App.jsx
import React from 'react';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { UserProfile } from './UserProfile';
import { LoadingFallback } from './LoadingFallback';
import { ErrorFallback } from './ErrorFallback';

export default function App() {
  // Helper from React Query to clear query errors on boundary reset
  const { reset } = useQueryErrorResetBoundary();

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h1>Dashboard</h1>

      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
        <Suspense fallback={<LoadingFallback />}>
          <UserProfile userId="123" />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

```

---

### How Custom Data Resources Work Under the Hood (Without Libraries)

If you are not using TanStack Query or SWR, you can create a custom Suspense resource wrapper. Suspense works by catching a **thrown Promise**:

```javascript
// wrapPromise.js
export function wrapPromise(promise) {
  let status = 'pending';
  let result;

  let suspender = promise.then(
    (res) => {
      status = 'success';
      result = res;
    },
    (err) => {
      status = 'error';
      result = err;
    }
  );

  return {
    read() {
      if (status === 'pending') {
        throw suspender; // Triggers <Suspense> fallback
      } else if (status === 'error') {
        throw result;    // Triggers <ErrorBoundary> fallback
      } else if (status === 'success') {
        return result;   // Renders normal UI
      }
    },
  };
}

```

---

### Benefits of Combining Suspense + Error Boundaries

| Traditional Approach                                                                                 | Suspense + Error Boundary Pattern                                         |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Imperative:** Component manages 3 states (`data`, `isLoading`, `isError`).                         | **Declarative:** Component only manages the happy-path `data`.            |
| **Boilerplate:** Every component repeats `if (loading) return <Spinner/>`.                           | **Centralized UI:** Fallback UI can be reused across multiple components. |
| **Waterfall Rendering:** Nested children wait for parent fetches to resolve before loading their UI. | **Parallel Loading:** React streams components as their data resolves.    |
