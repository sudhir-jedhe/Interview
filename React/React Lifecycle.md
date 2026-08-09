Understanding the **React Lifecycle** is essential for managing side effects, fetching data, handling DOM interactions, and optimizing component performance.

In modern React, components are divided into **Function Components** (using React Hooks) and legacy **Class Components** (using lifecycle methods).

---

## The Three Phases of a Component Lifecycle

Every React component goes through three main phases:

1. **Mounting:** The component is created and inserted into the DOM.
2. **Updating:** The component re-renders due to changes in `props` or `state`.
3. **Unmounting:** The component is removed from the DOM.

---

## 1. Function Components (Modern React with Hooks)

In function components, lifecycle behavior is unified through **Hooks**—primarily **`useEffect`**, **`useLayoutEffect`**, and **`useInsertionEffect`**.

```
┌──────────────────────────────────────────────────────────────────┐
│                      FUNCTION COMPONENT                          │
└──────────────────────────────────────────────────────────────────┘
   │
   ├─► Render Phase (Calculates JSX, updates Virtual DOM)
   │
   ├─► Commit Phase (DOM mutation occurs)
   │
   ├─► useLayoutEffect (Fires synchronously before browser paint)
   │
   ├─► Browser Paint (User sees visual changes)
   │
   └─► useEffect (Fires asynchronously after paint)

```

### Mapping `useEffect` Dependency Array to Lifecycle Events

The dependency array (`[]`) passed to `useEffect` controls when the side effect executes:

| Lifecycle Action                       | Hook Syntax                                     | Description                                            |
| -------------------------------------- | ----------------------------------------------- | ------------------------------------------------------ |
| **Mounting** (Run once on load)        | `useEffect(() => { ... }, [])`                  | Empty array `[]`: Runs once after initial DOM render.  |
| **Updating** (Run on specific changes) | `useEffect(() => { ... }, [val1, val2])`        | Runs after mount AND when `val1` or `val2` changes.    |
| **Every Render** (No array)            | `useEffect(() => { ... })`                      | Runs after *every* single render (rarely recommended). |
| **Unmounting** (Cleanup)               | `useEffect(() => { return () => { ... } }, [])` | Returned function executes when component unmounts.    |

### Code Example: Complete Hook Lifecycle

```tsx
import React, { useState, useEffect, useLayoutEffect } from 'react';

export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<{ name: string } | null>(null);

  // 1. MOUNTING & UPDATING: Fetch user data whenever userId changes
  useEffect(() => {
    let isSubscribed = true;

    async function loadUser() {
      const res = await fetch(`https://api.example.com/users/${userId}`);
      const data = await res.json();
      if (isSubscribed) setUser(data);
    }

    loadUser();

    // 2. UNMOUNTING / CLEANUP: Runs before next effect execution or component unmount
    return () => {
      isSubscribed = false; // Prevents state updates on unmounted component
    };
  }, [userId]);

  // 3. SYNCHRONOUS DOM MEASUREMENT: Fires before browser paint
  useLayoutEffect(() => {
    // Read DOM layout/dimensions synchronously here if needed
  }, []);

  return <div>{user ? <h1>{user.name}</h1> : <p>Loading...</p>}</div>;
}

```

---

## 2. Class Components (Legacy Lifecycle Methods)

Although function components are standard in modern development, understanding class lifecycle methods is important for maintaining existing codebases.

### Mounting Phase

1. **`constructor(props)`:** Initializes state and binds event handlers.
2. **`static getDerivedStateFromProps(props, state)`:** Syncs state with props before rendering (rarely used).
3. **`render()`:** Pure function that returns the JSX structure.
4. **`componentDidMount()`:** Invoked immediately after the component is mounted into the DOM. Best place for API calls, subscriptions, or DOM measurements.

### Updating Phase

1. **`static getDerivedStateFromProps()`**
2. **`shouldComponentUpdate(nextProps, nextState)`:** Returns `true` or `false` to allow or block re-rendering (performance optimization).
3. **`render()`**
4. **`getSnapshotBeforeUpdate(prevProps, prevState)`:** Captures DOM info (e.g., scroll position) right before mutations are applied.
5. **`componentDidUpdate(prevProps, prevState, snapshot)`:** Called immediately after updating occurs. Used for side effects triggered by prop/state changes.

### Unmounting Phase

1. **`componentWillUnmount()`:** Called right before a component is destroyed and removed from the DOM. Used to cancel network requests, clear timers (`setInterval`), or remove event listeners.

### Error Handling Phase (Error Boundaries)

* **`static getDerivedStateFromError(error)`:** Updates state to render fallback UI when a child component throws an error.
* **`componentDidCatch(error, info)`:** Logs error information to an external monitoring service (e.g., Sentry).

---

## Hook Equivalent vs. Class Method Direct Comparison

| Class Method              | Equivalent Function Hook Equivalent                      |
| ------------------------- | -------------------------------------------------------- |
| `componentDidMount`       | `useEffect(() => { ... }, [])`                           |
| `componentDidUpdate`      | `useEffect(() => { ... }, [dep1, dep2])`                 |
| `componentWillUnmount`    | `useEffect(() => { return () => { ... } }, [])`          |
| `shouldComponentUpdate`   | `React.memo(Component, arePropsEqual)`                   |
| `getSnapshotBeforeUpdate` | Custom ref measurement inside `useLayoutEffect`          |
| `componentDidCatch`       | *No hook equivalent yet* (Must use Class Error Boundary) |

---

## Key Lifecycle Rules & Best Practices

1. **Avoid Side Effects in Render:** The `render()` phase or main body of a function component must remain pure. Never trigger API calls or state updates directly inside the render body.
2. **Always Clean Up Subscriptions:** Return a cleanup function inside `useEffect` to destroy event listeners, WebSockets, or intervals—otherwise, memory leaks occur.
3. **Handle Fast Unmounts:** In React 18+ Concurrent Mode, components in `<React.StrictMode>` intentionally mount $\rightarrow$ unmount $\rightarrow$ remount in development mode to catch missing cleanup logic.
