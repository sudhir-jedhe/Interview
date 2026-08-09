In React, **HOC** stands for **Higher-Order Component**.

It is an advanced pattern used for **reusing component logic**. An HOC is not part of the React API—it is a design pattern that emerges from React’s compositional nature.

Specifically: **A Higher-Order Component is a function that takes a component as an argument and returns a new component.**

$$\text{Higher-Order Component} = \text{Component} \rightarrow \text{New Component}$$

---

## Why Use an HOC?

HOCs allow you to share common functionality across multiple components without duplicating code. Examples of common HOC use cases include:

* **Authentication/Authorization:** Restricting pages based on user roles or login status.
* **Data Fetching:** Wrapping components to load and pass data automatically.
* **Logging/Analytics:** Tracking component mounts, renders, or user interactions.
* **Theming/Styling:** Injecting global theme props or styles into components.

---

## Code Example: Authentication Guard HOC

Here is a practical example of an HOC that checks if a user is logged in before rendering a page:

```tsx
import React from 'react';
import { Navigate } from 'react-router';

// Simulated Auth state
const isAuthenticated = () => false;

// 1. The Higher-Order Component
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  // Returns a NEW component
  return function AuthenticatedComponent(props: P) {
    if (!isAuthenticated()) {
      // Redirect if not logged in
      return <Navigate to="/login" replace />;
    }

    // Render the original component with its props if authenticated
    return <WrappedComponent {...props} />;
  };
}

```

### Using the HOC

```tsx
// 2. Standard Component
function Dashboard({ username }: { username: string }) {
  return <h1>Welcome to your Dashboard, {username}!</h1>;
}

// 3. Create a Protected Version of Dashboard using the HOC
export const ProtectedDashboard = withAuth(Dashboard);

```

---

## HOCs vs. Modern React Hooks

Before React 16.8, HOCs (along with Render Props) were the primary way to share stateful logic in React. However, **React Hooks** (`useCustomHook`) have largely replaced HOCs for most modern applications.

| Feature             | Higher-Order Components (HOC)                                  | Custom Hooks                                         |
| ------------------- | -------------------------------------------------------------- | ---------------------------------------------------- |
| **Syntax**          | Wraps component outside render tree                            | Called inside the component body                     |
| **DOM Hierarchy**   | Can introduce "wrapper hell" (deeply nested trees in DevTools) | Zero extra wrapper nodes                             |
| **Prop Collisions** | Risk of HOC overwriting existing component props               | Explicit values returned directly to local variables |
| **Type Safety**     | Requires complex TypeScript generics                           | Standard TypeScript function types                   |

---

## Rules & Best Practices for HOCs

1. **Don't Use HOCs Inside the Render Method:** Always create HOCs outside component render functions. Creating an HOC inside `render()` re-creates the component on every render, causing React to unmount and remount it completely, losing all subtree state.
2. **Pass Unrelated Props Through:** The returned component should pass all incoming props to `WrappedComponent` (`<WrappedComponent {...props}/>`).
3. **Copy Static Methods:** If the original component has static methods attached to it, wrapping it in an HOC hides those methods unless you explicitly copy them (e.g., using `hoist-non-react-statics`).

Here is a side-by-side comparison of fetching user data using both a **Higher-Order Component (HOC)** and a **Custom React Hook**.

---

### Scenario Requirements

Fetch user data from `/api/user/123`, handle `loading` and `error` states, and pass the resulting data to a `UserProfile` component.

---

## 1. Implementation

### Approach A: Higher-Order Component (`withUserData`)

```tsx
// withUserData.tsx (HOC)
import React, { useEffect, useState } from 'react';

export interface User {
  name: string;
  email: string;
}

export interface WithUserProps {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export function withUserData<P extends WithUserProps>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithUserDataComponent(props: Omit<P, keyof WithUserProps>) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      fetch('/api/user/123')
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setIsLoading(false);
        })
        .catch(() => {
          setError('Failed to load user.');
          setIsLoading(false);
        });
    }, []);

    // Passes injected data alongside any original incoming props
    return (
      <WrappedComponent
        {...(props as P)}
        user={user}
        isLoading={isLoading}
        error={error}
      />
    );
  };
}

```

### Approach B: Custom React Hook (`useUserData`)

```tsx
// useUserData.ts (Custom Hook)
import { useState, useEffect } from 'react';

export interface User {
  name: string;
  email: string;
}

export function useUserData() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/user/123')
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Failed to load user.');
        setIsLoading(false);
      });
  }, []);

  return { user, isLoading, error };
}

```

---

## 2. Consuming in the Component

### Consuming the HOC

The UI component must expect injected props from the HOC wrapper:

```tsx
// UserProfile.tsx (HOC Version)
import React from 'react';
import { withUserData, WithUserProps } from './withUserData';

// Component expects user, isLoading, and error as incoming props
function BaseUserProfile({ user, isLoading, error }: WithUserProps) {
  if (isLoading) return <div>Loading user...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
    </div>
  );
}

// Export the wrapped version
export const UserProfile = withUserData(BaseUserProfile);

```

### Consuming the Custom Hook

The UI component calls the hook directly inside its body:

```tsx
// UserProfile.tsx (Custom Hook Version)
import React from 'react';
import { useUserData } from './useUserData';

export function UserProfile() {
  // Call hook inside the component
  const { user, isLoading, error } = useUserData();

  if (isLoading) return <div>Loading user...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
    </div>
  );
}

```

---

## 3. Side-by-Side Comparison

| Feature                    | Higher-Order Component (HOC)                                                                  | Custom React Hook                                                                       |
| -------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Component Wrapper**      | Adds a wrapper component node to the React virtual DOM tree ("wrapper hell").                 | Adds **zero** extra DOM or virtual nodes.                                               |
| **Prop Naming Collisions** | High risk—if the parent passes a prop named `user`, the HOC will overwrite it silently.       | Zero risk—destructured variables are scoped explicitly inside the component body.       |
| **TypeScript Complexity**  | High—requires generics (`P extends WithUserProps`), prop omission (`Omit`), and type casting. | Low—uses standard TypeScript return types.                                              |
| **Composition**            | Nested wrapping functions (`withAuth(withUserData(withTheme(Component)))`).                   | Inline hook invocation calls stacked sequentially inside the component body.            |
| **Flexibility**            | Injected values are fixed by the HOC's wrapper contract.                                      | The component can pass parameters directly into the hook (e.g., `useUserData(userId)`). |

---

## Verdict

* **Use Custom Hooks** for almost all modern stateful/asynchronous logic sharing. They are easier to write, strongly typed, and keep DevTools trees clean.
* **Use HOCs** primarily for cross-cutting layout or router guards where you want to conditionally prevent a component from rendering or executing entirely (such as auth guards or analytics trackers).
