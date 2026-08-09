React performance optimization centers on one core objective: **preventing unnecessary re-renders and avoiding costly computations during the render phase.**

By default, when a parent component re-renders, **all of its child components re-render recursively**, regardless of whether their props have changed. React provides three primary memoization primitives—`React.memo`, `useMemo`, and `useCallback`—to control this behavior.

---

## 1. `React.memo`: Component-Level Memoization

### What It Does

`React.memo` is a **higher-order component (HOC)** that wraps a functional component. It skips re-rendering the component if its incoming props have not changed (via a shallow equality check).

### When to Use

* The component renders frequently with the exact same props.
* The component contains a complex visual tree (heavy DOM elements or sub-trees).

### Code Example

```tsx
import React, { memo } from 'react';

interface ExpensiveListProps {
  items: string[];
}

// Wrapped in React.memo
export const ExpensiveList = memo(function ExpensiveList({ items }: ExpensiveListProps) {
  console.log('ExpensiveList rendered');
  
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
});

```

> **The Pitfall:** If you pass an **inline object, array, or function** as a prop to a `React.memo` component, the shallow equality check will **fail on every render** because a new reference is created in memory every time the parent renders.

---

## 2. `useCallback`: Memoizing Function References

### What It Does

`useCallback` caches a **function instance** between renders. It returns the exact same function reference until one of its dependencies changes.

### Primary Purpose

`useCallback` is designed to be paired with `React.memo`. Passing a newly created function to a `React.memo` child breaks memoization unless wrapped in `useCallback`.

### Code Example

```tsx
import React, { useState, useCallback, memo } from 'react';

// Child component wrapped in React.memo
const Button = memo(({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => {
  console.log(`Button "${children}" rendered`);
  return <button onClick={onClick}>{children}</button>;
});

export function CounterApp() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // ✅ Keeps the function reference stable across renders
  const handleIncrement = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []); // Empty dependency array because state updater callback (prev) is used

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type here..." />
      <p>Count: {count}</p>
      
      {/* Button will NOT re-render when typing in the input field */}
      <Button onClick={handleIncrement}>Increment</Button>
    </div>
  );
}

```

---

## 3. `useMemo`: Memoizing Calculated Values

### What It Does

`useMemo` caches the **result of a calculation** between renders. It executes the calculation function only when one of its dependencies changes.

### Primary Purpose

1. Avoiding expensive, CPU-intensive calculations (e.g., sorting, filtering large datasets, or math transformations) on every render.
2. Preserving referential equality for complex objects or arrays passed as props to a `React.memo` child component.

### Code Example

```tsx
import React, { useState, useMemo } from 'react';

interface Item {
  id: number;
  name: string;
}

export function FilteredList({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('');

  // ✅ Recalculates ONLY when `items` or `query` changes
  const filteredItems = useMemo(() => {
    console.log('Filtering expensive items list...');
    return items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  }, [items, query]);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." />
      <ul>
        {filteredItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

```

---

## Summary Comparison Matrix

| Primitive         | What It Caches          | Main Use Case                                                                        |
| ----------------- | ----------------------- | ------------------------------------------------------------------------------------ |
| **`React.memo`**  | Entire Component Output | Skips rendering a child component if its props haven't changed.                      |
| **`useCallback`** | Function Reference      | Prevents recreating callback functions to keep `React.memo` prop checks stable.      |
| **`useMemo`**     | Evaluated Return Value  | Avoids re-executing expensive computations or preserves object referential equality. |

---

## When NOT to Optimize (The Cost of Over-Memoization)

Memoization is **not free**. Every `useMemo`, `useCallback`, and `React.memo` adds overhead:

* Allocating memory for dependency arrays and cached values.
* Executing equality comparisons on every render.

### Guidelines for Smart Usage

1. **Don't prematurely optimize:** Do not wrap simple functions or lightweight components in `useCallback` or `React.memo`. React's standard virtual DOM diffing is extremely fast for simple trees.
2. **First, optimize state structure & component composition:**

* **Lift content up:** Pass children as props (`children` pattern).
* **Move state down:** Push state as close to where it's used as possible so parent re-renders don't trigger large sub-tree renders.
