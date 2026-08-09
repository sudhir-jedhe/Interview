The primary performance issue with React Context is that **whenever a Context Provider's value changes, *every* component that calls `useContext(MyContext)` will re-render**, even if it only uses a property that didn't change.

Here are the 4 essential patterns to optimize React Context and eliminate wasteful re-renders.

---

## Pattern 1: Separate State and Dispatch Contexts (Most Effective)

### The Problem

Often, a context holds both state (e.g., `user`, `theme`) and updater functions (e.g., `setUser`, `toggleTheme`). When the state changes, components that *only* need the updater functions re-render needlessly because the context object reference changes.

### The Solution

Split your context into two separate contexts:

1. **State Context:** Holds the actual dynamic values.
2. **Dispatch / Actions Context:** Holds stable updater callbacks.

```tsx
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface User {
  name: string;
  email: string;
}

// 1. Create two independent contexts
const UserStateContext = createContext<User | null>(null);
const UserActionsContext = createContext<{
  updateName: (name: string) => void;
  logout: () => void;
} | null>(null);

// 2. Combined Provider
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({ name: 'Sudhir', email: 'sudhir@example.com' });

  // Stable callbacks that never change
  const updateName = useCallback((name: string) => {
    setUser((prev) => ({ ...prev, name }));
  }, []);

  const logout = useCallback(() => {
    setUser({ name: '', email: '' });
  }, []);

  // Memoize actions object reference
  const actionsValue = useMemo(() => ({ updateName, logout }), [updateName, logout]);

  return (
    <UserStateContext.Provider value={user}>
      <UserActionsContext.Provider value={actionsValue}>
        {children}
      </UserActionsContext.Provider>
    </UserStateContext.Provider>
  );
}

// 3. Custom Hooks for clean consumption
export function useUserState() {
  const context = useContext(UserStateContext);
  if (context === undefined) throw new Error('useUserState must be used within UserProvider');
  return context;
}

export function useUserActions() {
  const context = useContext(UserActionsContext);
  if (!context) throw new Error('useUserActions must be used within UserProvider');
  return context;
}

```

### Why this works

* A component that only calls `useUserActions()` to dispatch `updateName()` will **NEVER re-render** when the `user` state changes, because `UserActionsContext`'s value reference stays completely static.

---

## Pattern 2: Memoize the Provider Value

If you must keep state and dispatch in a single context, **always memoize the value object** passed to the `.Provider` using `useMemo`.

### ❌ Vulnerable Code

```tsx
// BAD: Creates a new object literal on EVERY render of ThemeProvider,
// forcing ALL consumers to re-render even if `theme` hasn't changed.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

```

### ✅ Optimized Code

```tsx
// GOOD: `value` object reference remains identical unless `theme` changes.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('dark');

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

```

---

## Pattern 3: Use Component Selectors (Splitting Consumers)

When a component consumes a context with multiple properties, wrap sub-parts of your component tree in intermediate components or use a custom selector pattern so only the relevant sub-tree updates.

### Strategy: Extract and Memoize Sub-components

```tsx
import React, { memo } from 'react';
import { useUserState, useUserActions } from './UserContext';

// ❌ BAD: This single component re-renders when EITHER user.name or user.email changes
export function UserProfileHeader() {
  const user = useUserState();
  const { updateName } = useUserActions();

  return (
    <div>
      <h1>Name: {user?.name}</h1>
      <button onClick={() => updateName('New Name')}>Change Name</button>
    </div>
  );
}

// ✅ GOOD: Split into isolated components
const DisplayName = memo(function DisplayName() {
  const user = useUserState();
  // Only re-renders when user object updates
  return <h1>Name: {user?.name}</h1>;
});

const ActionButton = memo(function ActionButton() {
  const { updateName } = useUserActions();
  // Never re-renders on state changes!
  return <button onClick={() => updateName('New Name')}>Change Name</button>;
});

export function OptimizedUserProfileHeader() {
  return (
    <div>
      <DisplayName />
      <ActionButton />
    </div>
  );
}

```

---

## Pattern 4: Colocate State or Use Zustand / Redux Toolkit for Fine-Grained Subscriptions

If you find yourself needing to subscribe components to tiny slices of a massive context object (e.g., `const name = useStore(state => state.user.name)`), standard React Context lacks built-in selector capabilities.

If performance bottlenecks persist after splitting contexts, consider migrating complex global state to **Zustand** or **Redux Toolkit (RTK)**, which use atomic external stores and native `useSyncExternalStore` subscription selectors.

### Comparison: Context API vs. Zustand Selectors

```tsx
// Zustand fine-grained atomic selector:
// This component ONLY re-renders when state.user.name specifically changes!
import { create } from 'zustand';

const useStore = create((set) => ({
  userName: 'Sudhir',
  userRole: 'Admin',
  updateName: (name: string) => set({ userName: name }),
}));

export function UserNameDisplay() {
  const userName = useStore((state) => state.userName); // Atomic subscription
  return <h1>{userName}</h1>;
}

```

---

## Summary Checklist for Context Optimization

| Optimization Strategy                    | When to Apply                                                                        |
| ---------------------------------------- | ------------------------------------------------------------------------------------ |
| **Split State & Dispatch Contexts**      | Always apply for global providers with frequent state changes.                       |
| **`useMemo` on Provider Value**          | Always apply to ensure the context object reference is stable.                       |
| **Pass `children` as Props to Provider** | Prevents the Provider itself from re-rendering its child tree.                       |
| **Zustand / Redux Toolkit**              | Use when components need granular property-level subscriptions across large objects. |
