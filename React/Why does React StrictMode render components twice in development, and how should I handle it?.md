React **StrictMode** intentionally renders components twice (and invokes certain lifecycles twice) in **development mode only** to help you catch subtle bugs before they reach production.

It does **not** run twice in production builds, nor does it impact production performance.

---

### Why Does StrictMode Double-Render?

React 18+ introduced **Concurrent Rendering** capabilities (such as `useTransition`, `useDeferredValue`, and automatic batching). In a concurrent environment, React may pause, abort, or restart rendering a component before committing it to the screen.

For concurrent rendering to work safely without memory leaks or UI bugs, your component's rendering logic **must be pure** (side-effect-free).

StrictMode intentionally double-renders components to surface:

1. **Impure Render Logic:** Modifying variables outside the component during render (e.g., mutating global objects or arrays).
2. **Missing Cleanup Functions in Effects:** Forgetting to clear timers, event listeners, or WebSockets inside `useEffect`.
3. **Deprecated/Legacy APIs:** Usage of legacy lifecycle methods like `componentWillMount` or `findDOMNode`.

---

### What Exactly Runs Twice in Development?

In development, StrictMode double-invokes:

* Functional Component **bodies** (all code evaluated during render).
* `useState`, `useMemo`, and `useReducer` **initializers**.
* `useEffect` and `useLayoutEffect` **callbacks** (React runs `setup → cleanup → setup`).
* Class component `constructor`, `render`, `shouldComponentUpdate`, and `getDerivedStateFromProps` methods.

---

### Common Issues & How to Handle Them

#### 1. API Calls Firing Twice on Mount (`useEffect`)

##### ❌ Common Mistake (Manual Cancellation Flags)

Developers often get confused when seeing duplicate network requests in the browser Network tab during development and try to "hack" it using a `useRef` flag:

```jsx
// DON'T DO THIS: Hacky workaround to prevent double-fetch
function UserList() {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return; // Breaks StrictMode testing!
    isMounted.current = true;

    fetchUsers();
  }, []);
}

```

##### ✅ Correct Solution (Use AbortController or Dedicated Fetching Libraries)

In standard `useEffect`, provide a proper **cleanup function** using native `AbortController`:

```jsx
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        const res = await fetch('/api/users', { signal: controller.signal });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      }
    }

    loadData();

    // Proper Cleanup: Aborts the duplicate request when StrictMode unmounts/remounts
    return () => controller.abort();
  }, []);

  return <div>{/* Render users */}</div>;
}

```

> **Note:** If you use modern data-fetching libraries like **TanStack Query (React Query)**, **SWR**, or **RTK Query**, automatic deduplication and cleanup are handled for you out-of-the-box.

---

#### 2. Duplicate Subscriptions or Event Listeners

##### ❌ Impure Effect (Creates memory leaks in production)

```jsx
useEffect(() => {
  window.addEventListener('resize', handleResize);
  // Missing cleanup! StrictMode will attach 2 listeners in dev.
}, []);

```

##### ✅ Correct Solution (Always Return Cleanup)

```jsx
useEffect(() => {
  window.addEventListener('resize', handleResize);

  // Proper Cleanup: Removes listener when component unmounts
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

```

---

#### 3. Impure Mutations During Render

##### ❌ Impure Render Logic

```jsx
let guestCount = 0; // Global/outer variable

function Cup() {
  // Bad: Mutating an external variable during render!
  guestCount = guestCount + 1; 
  return <h2>Tea cup for guest #{guestCount}</h2>;
}

```

*In StrictMode, `guestCount` will jump by +2 instead of +1 on mount, exposing the impurity.*

##### ✅ Pure Render Logic

```jsx
function Cup({ guestNumber }) {
  // Pure: Calculation relies entirely on props/local variables
  return <h2>Tea cup for guest #{guestNumber}</h2>;
}

```

---

### Should You Disable StrictMode?

**No.** While it might be tempting to remove `<React.StrictMode>` from `index.js` or `main.jsx` to make console logs look cleaner, doing so hides real bugs—such as memory leaks, stale subscriptions, and state corruption—that will still occur in production when users navigate around your app.

Embrace double-rendering during development: if your component breaks under StrictMode, it is a signal that your cleanup logic or render purity needs fixing.
