Before React 18, all state updates were treated with equal, urgent priority. If a large list re-rendered or a heavy chart recalculated while a user was typing in an input field, the browser main thread blocked, causing visible UI lag or frozen typing indicators.

React 18 introduced **Concurrent Rendering**—a mechanism that allows React to interrupt, pause, or yield long-running renders to prioritize urgent user interactions like typing, clicking, or dragging.

Two primary hooks make concurrent rendering accessible in application code: **`useTransition`** and **`useDeferredValue`**.

---

## 1. `useTransition`: Non-Blocking State Updates

### What It Does

`useTransition` lets you mark a state update as a **non-urgent transition**. This tells React that user input (like typing into a search box) should be prioritized immediately, while the secondary update (like filtering a 10,000-item list) can be processed in the background without freezing the input UI.

### Syntax

```tsx
const [isPending, startTransition] = useTransition();

```

* **`startTransition(callback)`:** Wraps state setter calls that trigger heavy, non-urgent re-renders.
* **`isPending`:** A boolean flag indicating whether the background transition is currently being processed.

### Code Example: Search Filter Without UI Lag

```tsx
import React, { useState, useTransition } from 'react';

// Generates a mock list of 10,000 items
const items = Array.from({ length: 10000 }, (_, i) => `Item #${i + 1}`);

export function SearchFilter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredList, setFilteredList] = useState(items);
  
  // 1. Initialize useTransition hook
  const [isPending, startTransition] = useTransition();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // A. Urgent Update: Reflect typed character immediately in the input field
    setSearchTerm(value);

    // B. Non-Urgent Update: Filter 10,000 items in a background transition
    startTransition(() => {
      const results = items.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredList(results);
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Type to filter 10,000 items..."
      />

      {/* Show pending indicator while background render executes */}
      {isPending && <p style={{ color: 'gray' }}>Updating list...</p>}

      <ul style={{ opacity: isPending ? 0.6 : 1, maxHeight: '300px', overflowY: 'auto' }}>
        {filteredList.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

```

---

## 2. `useDeferredValue`: Deferring Secondary Values

### What It Does

While `useTransition` wraps the **state setter function** when you control the state update logic yourself, **`useDeferredValue`** defers a **value** itself.

It is ideal when:

* You receive a prop or state value from a parent component or third-party library, so you don't own the state setter function.
* You want a heavy child component to lag behind an urgent value update slightly until the main thread frees up.

### Code Example: Deferring Heavy Child Renders

```tsx
import React, { useState, useDeferredValue, memo } from 'react';

// Heavy list component wrapped in React.memo
const HeavyList = memo(function HeavyList({ query }: { query: string }) {
  console.log(`Rendering HeavyList for query: "${query}"`);
  
  // Artificial slowdown to simulate heavy calculations
  const items = Array.from({ length: 5000 }, (_, i) => {
    return `${query} - Result #${i + 1}`;
  });

  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
});

export function DeferredSearchApp() {
  const [text, setText] = useState('');
  
  // 1. Create a deferred version of `text`
  // `deferredText` lags behind `text` until urgent main-thread renders finish
  const deferredText = useDeferredValue(text);

  const isStale = text !== deferredText;

  return (
    <div style={{ padding: '20px' }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type here..."
      />

      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        <HeavyList query={deferredText} />
      </div>
    </div>
  );
}

```

---

## `useTransition` vs. `useDeferredValue`: Comparison

| Feature                     | `useTransition`                                                               | `useDeferredValue`                                                                         |
| --------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **What It Wraps**           | The **state setter function** (`startTransition(() => setState(...))`)        | An existing **variable or prop value** (`useDeferredValue(value)`)                         |
| **When To Use**             | When you own the state setter and want to dispatch a non-urgent state update. | When receiving a prop from above or consuming third-party state without access to setters. |
| **Pending State Indicator** | Provides `isPending` boolean flag automatically.                              | Checked manually by comparing `value !== deferredValue`.                                   |
| **Primary Goal**            | Keeps interactive controls responsive during heavy updates.                   | Prevents heavy sub-trees from blocking main thread input execution.                        |

---

## 3. Other React 18 Concurrent Features to Know

### A. Automatic Batching

React 18 automatically batches multiple state updates into a single re-render, even inside asynchronous callbacks (`fetch`, `setTimeout`, native event handlers, or Promises).

```tsx
// React 18 batches both state updates into 1 re-render automatically!
setTimeout(() => {
  setCount((c) => c + 1);
  setFlag((f) => !f);
}, 1000);

```

### B. `useId`

Generates unique, deterministic IDs that remain consistent across client and server renders (SSR), preventing hydration mismatch warnings for form field accessibility attributes.

```tsx
import { useId } from 'react';

export function FormInput({ label }: { label: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </div>
  );
}

```

---

## Performance Summary Checklist

1. **Don't use `useTransition` everywhere:** Only apply it to state updates that cause noticeable lag or heavy DOM sub-tree calculations.
2. **Combine `useDeferredValue` with `React.memo`:** For `useDeferredValue` to effectively skip child re-renders during rapid input typing, the heavy child component **must be wrapped in `React.memo**`.
