**`useCallback`** is a built-in React Hook that **caches (memoizes) a function definition** between component re-renders.

It prevents React from recreating a new function instance on every single render unless one of its specified dependencies changes.

---

## 1. Syntax

```tsx
const cachedFn = useCallback(fn, dependencies);

```

* **`fn`**: The function you want to cache across renders.
* **`dependencies`**: An array of reactive values (props, state, or variables declared inside the component body) that `fn` references.
* **Returns**: The exact same function instance on subsequent renders until a value in `dependencies` changes.

---

## 2. The Problem `useCallback` Solves

In JavaScript, functions are objects. Every time a component renders, all functions defined inside its body are **re-created with new memory references**:

```tsx
function Parent() {
  // ❌ A NEW handleSave function object is created on EVERY render!
  const handleSave = () => {
    console.log('Saved');
  };

  // Because handleSave has a new memory reference each render,
  // MemoizedChild will re-render EVERY single time, ruining React.memo!
  return <MemoizedChild onSave={handleSave} />;
}

```

By wrapping `handleSave` in `useCallback`, you ensure the function keeps the **exact same memory reference** across renders.

---

## 3. Primary Use Cases

### Case 1: Passing callbacks to optimized child components (`React.memo`)

If you pass an inline callback to a child component wrapped in `React.memo`, the child will re-render anyway unless the callback reference stays stable.

```tsx
import React, { useState, useCallback } from 'react';

// Child wrapped in React.memo
const FastButton = React.memo(({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => {
  console.log(`[Rendered Child]: ${children}`);
  return <button onClick={onClick}>{children}</button>;
});

export function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // ✅ Memoized callback: Keeps stable reference unless `count` changes
  const handleIncrement = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []); // Empty deps because functional update (prev => prev + 1) is used!

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type here..." />
      <p>Count: {count}</p>
      
      {/* FastButton will NOT re-render when typing in the input! */}
      <FastButton onClick={handleIncrement}>Increment</FastButton>
    </div>
  );
}

```

---

### Case 2: Preventing custom hooks or `useEffect` loops

When a function is listed as a dependency in `useEffect` (or custom hooks), missing `useCallback` triggers infinite re-render loops or unnecessary effect execution:

```tsx
import { useState, useEffect, useCallback } from 'react';

export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);

  // ✅ Memoized fetcher function
  const fetchUser = useCallback(async () => {
    const res = await fetch(`/api/users/${userId}`);
    const data = await res.json();
    setUser(data);
  }, [userId]); // Only updates if userId changes

  useEffect(() => {
    fetchUser();
  }, [fetchUser]); // Safe dependency!

  return <div>{user ? JSON.stringify(user) : 'Loading...'}</div>;
}

```

---

## 4. `useCallback` vs `useMemo`

| Hook                             | What it caches               | Typical usage                                                                        |
| -------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------ |
| **`useCallback(fn, deps)`**      | **Function instance itself** | Passing callbacks to memoized children or effect dependencies.                       |
| **`useMemo(() => value, deps)`** | **Result of a calculation**  | Expensive calculations (filtering large lists, sorting) or memoizing context values. |

> `useCallback(fn, deps)` is identical to `useMemo(() => fn, deps)`.

---

## 5. Common Pitfall: Overusing `useCallback`

**Do NOT wrap every function in `useCallback`.**

1. `useCallback` itself has performance cost—React must allocate memory for the dependency array and compare values on every render.
2. If the receiving component is **not** wrapped in `React.memo` or used in a `useEffect` dependency array, `useCallback` provides **zero performance benefit**.

### Rule of Thumb

* **Use `useCallback` if:**
* The function is passed as a prop to a component wrapped in `React.memo`.
* The function is a dependency of `useEffect`, `useMemo`, or another hook.
* You are writing a custom hook that returns functions to consumer components.

* **Skip `useCallback` for:**
* Standard event handlers on raw DOM elements (e.g., `<button onClick={() => ...}>`).

Show a detailed example of using React.memo and useCallback together to prevent child component re-renders.

Here is a complete, hands-on example showing how **`React.memo`** and **`useCallback`** work together to prevent unnecessary child component re-renders.

---

## The Scenario

We have a parent component managing two independent pieces of state:

1. **`count`**: A counter state.
2. **`text`**: A text input state.

Inside the parent, we render two child components:

* `<ExpensiveList/>`: A component wrapped in `React.memo` that receives an item array and an `onDeleteItem` callback.
* `<CountDisplay/>`: A simple component showing the current count.

---

## 1. Complete Example Code

```tsx
import React, { useState, useCallback } from 'react';

// ==========================================
// 1. Child Component Wrapped in React.memo
// ==========================================
interface ExpensiveListProps {
  items: string[];
  onDeleteItem: (index: number) => void;
}

// React.memo performs a shallow comparison of incoming props (items and onDeleteItem).
// If props haven't changed reference, React skips rendering this child!
const ExpensiveList = React.memo(function ExpensiveList({
  items,
  onDeleteItem,
}: ExpensiveListProps) {
  console.log('🔴 [RED LIGHT] <ExpensiveList /> RERENDERED!');

  return (
    <div style={{ border: '1px solid #cbd5e1', padding: '16px', borderRadius: '8px' }}>
      <h3>Task List ({items.length})</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index} style={{ marginBottom: '8px' }}>
            {item}{' '}
            <button
              onClick={() => onDeleteItem(index)}
              style={{ color: '#ef4444', cursor: 'pointer' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});

// ==========================================
// 2. Parent Component
// ==========================================
export function ParentApp() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [items, setItems] = useState(['Task 1', 'Task 2', 'Task 3']);

  console.log('🟢 [GREEN LIGHT] <ParentApp /> RERENDERED');

  // -------------------------------------------------------------
  // KEY STEP: useCallback keeps the onDeleteItem memory reference
  // STABLE across ParentApp re-renders!
  // -------------------------------------------------------------
  const handleDeleteItem = useCallback((indexToDelete: number) => {
    setItems((prevItems) => prevItems.filter((_, index) => index !== indexToDelete));
  }, []); // Empty dependencies because we use functional state updates (prevItems => ...)

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setItems((prev) => [...prev, text]);
    setText('');
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Performance Optimization Demo</h2>

      {/* Unrelated State: Updating count re-renders ParentApp */}
      <div style={{ marginBottom: '20px', background: '#f8fafc', padding: '12px' }}>
        <p>Unrelated Counter: <strong>{count}</strong></p>
        <button onClick={() => setCount((c) => c + 1)}>Increment Counter</button>
      </div>

      {/* Form to add items */}
      <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="New task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit">Add Task</button>
      </form>

      {/* Memoized Child Component */}
      <ExpensiveList items={items} onDeleteItem={handleDeleteItem} />
    </div>
  );
}

export default ParentApp;

```

---

## 2. Why Both Are Required (The Mechanics)

If you use `React.memo` without `useCallback`—or `useCallback` without `React.memo`—the performance optimization breaks down:

### ❌ What happens without `useCallback`?

If `handleDeleteItem` is written as a standard inline function:

```tsx
const handleDeleteItem = (indexToDelete: number) => {
  setItems((prev) => prev.filter((_, i) => i !== indexToDelete));
};

```

When you click **"Increment Counter"**, `ParentApp` re-renders. A brand new `handleDeleteItem` function is instantiated in memory. Even though `<ExpensiveList/>` is wrapped in `React.memo`, it sees that `newOnDeleteItem !== oldOnDeleteItem` (reference comparison fails) and **re-renders unnecessarily**.

---

### ❌ What happens without `React.memo`?

If `<ExpensiveList/>` is NOT wrapped in `React.memo`, then even if `handleDeleteItem` maintains a 100% stable reference via `useCallback`, React's default behavior is to re-render all child components when a parent re-renders.

---

### ✅ What happens when paired together?

```
Parent Re-renders (Count changed)
       │
       ├── 1. items reference unchanged? ──► YES
       │
       ├── 2. handleDeleteItem reference unchanged (useCallback)? ──► YES
       │
       └── 3. React.memo shallow comparison checks props ──► SKIPS ExpensiveList render!

```

---

## 3. Console Log Output Comparison

Try running the application and observe the browser console logs:

| Action                        | Without `useCallback`                                      | With `React.memo` + `useCallback`                                                                 |
| ----------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Click "Increment Counter"** | 🟢 `<ParentApp/>` RERENDERED🔴 `<ExpensiveList/>` RERENDERED | 🟢 `<ParentApp/>` RERENDERED*(ExpensiveList skipped!)*                                             |
| **Type in text input**        | 🟢 `<ParentApp/>` RERENDERED🔴 `<ExpensiveList/>` RERENDERED | 🟢 `<ParentApp/>` RERENDERED*(ExpensiveList skipped!)*                                             |
| **Add or Delete a Task**      | 🟢 `<ParentApp/>` RERENDERED🔴 `<ExpensiveList/>` RERENDERED | 🟢 `<ParentApp/>` RERENDERED🔴 `<ExpensiveList/>` RERENDERED *(Expected, because `items` changed!)* |

---

## Key Rules for `useCallback` + `React.memo`

1. **Use Functional State Updates:** Notice how `setItems((prevItems) => ...)` was used inside `useCallback`. This allowed us to leave the dependency array empty `[]` because we don't reference the `items` state variable directly inside the callback body.
2. **Don't Prematurely Memoize Small Components:** For small components rendering a few HTML tags (like basic buttons), the shallow comparison overhead of `React.memo` can actually cost more CPU cycles than letting React do a lightweight re-render. Reserve this pattern for medium-to-large components or long lists.
