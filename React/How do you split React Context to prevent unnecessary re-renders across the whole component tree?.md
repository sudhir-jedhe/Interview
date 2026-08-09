When a value inside a React Context Provider changes, **every component that calls `useContext` on that provider will re-render**, even if it only uses a piece of the context that didn't change.

If you put both **frequently changing state** (like user input, active tabs, or mouse coordinates) and **rarely changing state** (like user settings) into a single Context object, any minor update forces the entire consumer component tree to re-render.

Here are the primary strategies to split Context and prevent app-wide re-renders.

---

## Strategy 1: Separate State from Action Handlers (The Dual-Context Pattern)

The most common cause of context-driven re-renders is bundling state values together with setter functions in the same provider object:

```tsx
// ❌ ANTI-PATTERN: Changing `user` forces components that ONLY use `setUser` to re-render!
const UserContext = createContext({ user, setUser });

```

Because `user` updates on change, a new object `{ user, setUser }` is created, triggering re-renders for **all** consumers—even those that only called `setUser` and never read `user`.

### The Solution

Split into two distinct contexts:

1. **`UserStateContext`** for reading data.
2. **`UserDispatchContext`** for trigger actions (which remains referentially stable across renders).

```tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface User {
  name: string;
  theme: string;
}

type UserDispatch = {
  updateName: (name: string) => void;
  toggleTheme: () => void;
};

// 1. Create two separate contexts
const UserStateContext = createContext<User | undefined>(undefined);
const UserDispatchContext = createContext<UserDispatch | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({ name: 'Alex', theme: 'light' });

  // 2. Wrap action handlers in useCallback to keep references stable
  const updateName = useCallback((name: string) => {
    setUser((prev) => ({ ...prev, name }));
  }, []);

  const toggleTheme = useCallback(() => {
    setUser((prev) => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  }, []);

  const dispatchValue = React.useMemo(
    () => ({ updateName, toggleTheme }),
    [updateName, toggleTheme]
  );

  return (
    <UserStateContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatchValue}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

// 3. Custom hooks for clean consumption
export function useUserState() {
  const context = useContext(UserStateContext);
  if (!context) throw new Error('useUserState must be used within UserProvider');
  return context;
}

export function useUserDispatch() {
  const context = useContext(UserDispatchContext);
  if (!context) throw new Error('useUserDispatch must be used within UserProvider');
  return context;
}

```

### Why this works

A component that only triggers actions (e.g., a `<ThemeToggleButton/>`) consumes `useUserDispatch()`. Because `dispatchValue` maintains a stable reference across renders, **`<ThemeToggleButton/>` will never re-render when `user` state changes.**

---

## Strategy 2: Split Domain Contexts by Update Frequency

Avoid creating a monolithic "Global App Context". Divide your application domain into independent providers based on **how frequently** the data changes.

```
                  ┌─────────────────────────────────────┐
                  │          <AppProvider>              │
                  └──────────────────┬──────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│  <AuthContext>  │         │ <ConfigContext> │         │  <CartContext>  │
└────────┬────────┘         └────────┬────────┘         └────────┬────────┘
         │                           │                           │
  Updates: Rare               Updates: Very Rare          Updates: Frequent
(Login/Logout only)          (App settings/Locale)        (Adding items, qty)

```

By isolating `<CartContext>` from `<AuthContext>`, changing items in the shopping cart won't cause components that only care about authentication status to re-render.

---

## Strategy 3: Memoize Children or Intermediate Components

If you cannot split a context, you can isolate the re-renders by wrapping intermediate child components in **`React.memo`** or lifting `children` out of the rendering component body.

### A. Passing `children` directly (Recommended)

When a provider component holds state, updating that state re-renders the provider function itself. If child components are passed via the `children` prop, React reuses their virtual DOM references without re-rendering them.

```tsx
// ✅ Good: `children` are not re-rendered when `count` updates!
export function CounterProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  return (
    <CounterContext.Provider value={{ count, setCount }}>
      {children}
    </CounterContext.Provider>
  );
}

```

### B. Isolating Consumer Sub-trees with `React.memo`

If a component consumes context, it will re-render when context changes. However, its child components don't have to if they are wrapped in `React.memo`:

```tsx
const HeavyComponent = React.memo(() => {
  console.log('Heavy Component rendered');
  return <div>Expensive UI subtree...</div>;
});

function ContextConsumerContainer() {
  const { theme } = useTheme(); // Re-renders when theme changes

  return (
    <div className={theme}>
      {/* HeavyComponent skips re-renders because its props haven't changed */}
      <HeavyComponent /> 
    </div>
  );
}

```

---

## Summary Decision Guide

| Problem                                                                    | Recommended Solution                                                                                                                                |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Components that trigger state updates re-render when state changes**     | Split into **State Context** and **Dispatch Context**.                                                                                              |
| **Unrelated parts of the app re-render on state changes**                  | Split single context into **domain-specific contexts** (`AuthContext`, `ThemeContext`).                                                             |
| **A component re-renders expensive child elements when reading context**   | Move the context reader lower down the component tree or wrap expensive children in `React.memo`.                                                   |
| **High-frequency state changes (e.g., cursor tracking, 60fps animations)** | **Avoid React Context entirely.** Use external atomic state management tools (like Zustand, Jotai, or Signals) that support fine-grained selectors. |
