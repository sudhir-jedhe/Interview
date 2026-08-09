`useEffect` is a React Hook that synchronizes a component with an external system (such as fetching data, subscribing to services, setting up timers, or manually manipulating the DOM).

It bridges the **React rendering cycle** with **side effects** that happen outside of React.

---

## 1. Basic Syntax

`useEffect` takes an **effect function** (which can return a cleanup function) and an optional **dependencies array**:

```tsx
import { useEffect } from 'react';

useEffect(() => {
  // 1. Setup / Side Effect Logic
  const subscription = api.subscribe(id);

  // 2. Optional Cleanup Function
  return () => {
    subscription.unsubscribe();
  };
}, [id]); // 3. Dependencies Array

```

---

## 2. Dependency Array Rules

The execution timing of `useEffect` depends on what you pass in the second argument:

| Dependency Array                                | When the Effect Runs                                   | When the Cleanup Runs                              |
| ----------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------- |
| **No Array** (`useEffect(() => {})`)            | On **initial mount AND after every single re-render**. | Before every re-render and on unmount.             |
| **Empty Array** (`useEffect(() => {}, [])`)     | **Once** after the initial mount.                      | Once when the component unmounts.                  |
| **With Values** (`useEffect(() => {}, [a, b])`) | On mount **AND** whenever `a` or `b` change.           | Before re-running with new values, and on unmount. |

---

## 3. The Execution Sequence

1. **Render Phase:** React renders the component and updates the DOM.
2. **Browser Paint:** The browser paints the updated DOM on screen.
3. **Cleanup Phase:** If dependencies changed, React runs the cleanup function from the *previous* render.
4. **Effect Phase:** React runs the new `useEffect` logic.

---

## 4. Common Use Cases & Code Examples

### A. Subscribing to Browser Events (with Cleanup)

```tsx
import { useState, useEffect } from 'react';

function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // Cleanup: Prevents memory leaks and duplicate listeners
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array = setup once on mount

  return <p>Window width: {width}px</p>;
}

```

### B. Fetching Data with Race Condition Guard

```tsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (isCurrent) setUser(data); // Prevents stale response updates
      });

    return () => {
      isCurrent = false; // Marks request as stale if userId changes rapidly
    };
  }, [userId]);

  return <div>{user ? user.name : 'Loading...'}</div>;
}

```

---

## 5. What NOT to Do with `useEffect`

1. **Don't use it to transform data for rendering:** Calculate values directly during render or use `useMemo`.
2. **Don't use it for user event handlers:** Place logic inside `onClick` or `onSubmit` handlers rather than setting state and listening for it in `useEffect`.
3. **Don't omit dependencies:** Omitting dependencies used inside the effect leads to stale closures and bugs. Always include all reactive values or re-architect the logic.
q
