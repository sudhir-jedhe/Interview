`useDeferredValue` is a React hook introduced in **React 18** that lets you defer updating a non-critical part of the UI. It accepts a value (like state or a prop) and returns a "lagging" version of that value that updates in the background.

---

## Syntax

```tsx
const deferredValue = useDeferredValue(value, initialValue?);

```

- **`value`**: The value you want to defer (e.g., a query string or a complex object).
- **`initialValue`** _(optional, React 19+)_: An initial value used during the initial render.

---

## How It Works

1. **Initial Render:** React renders the UI with the initial value immediately.
2. **When Value Changes:**

- React **first re-renders** the UI using the _old_ deferred value alongside the _new_ urgent state (keeping typing/clicking responsive).
- React **then attempts a background re-render** with the _new_ deferred value.
- If a new user action occurs mid-render (e.g., the user keeps typing), React **interrupts and discards** the background render to process the user input immediately.

---

## Real-World Example: Deferring a Slow List Component

Use `useDeferredValue` when passing a fast-changing state (like text input) down to a slow, heavy child component:

```tsx
import { useState, useDeferredValue, memo } from "react";

export function SearchPage() {
  const [query, setQuery] = useState("");

  // Create a deferred version of 'query'
  const deferredQuery = useDeferredValue(query);

  // Check if the displayed data is currently stale
  const isStale = query !== deferredQuery;

  return (
    <div>
      {/* Input updates instantly on every keystroke */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search thousands of items..."
      />

      {/* Dim the list slightly when displaying stale (deferred) results */}
      <div style={{ opacity: isStale ? 0.5 : 1, transition: "opacity 0.2s" }}>
        <SlowList text={deferredQuery} />
      </div>
    </div>
  );
}

// Optimization Note: Wrap heavy child in React.memo so it only re-renders
// when 'text' (the deferred value) actually updates!
const SlowList = memo(function SlowList({ text }: { text: string }) {
  const items = Array.from({ length: 2000 }, (_, i) => `${text} result #${i}`);
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
});
```

---

## Crucial Requirement: Combine with `React.memo`

For `useDeferredValue` to actually prevent unnecessary re-renders in child components, the receiving child component **must be wrapped in `React.memo**`.

Without `React.memo`, the child component will re-render anyway whenever the parent state updates, defeating the purpose of deferring the value.

---

## How It Compares to Debouncing and Throttling

| Approach                | Timing                                                   | Responsiveness                                                                                |
| ----------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Debounce / Throttle** | Fixed delay (e.g., waits 300ms after user stops typing). | Can feel laggy on fast devices or still freeze UI on slow devices if 300ms isn't enough.      |
| **`useDeferredValue`**  | Dynamic (zero artificial delay).                         | React starts rendering in the background immediately and yields only when the user interacts. |

While both `useTransition` and `useDeferredValue` leverage React 18's **Concurrent Rendering** to prevent low-priority updates from blocking the UI, they approach the problem from opposite directions.

Here is the direct comparison: **`useTransition` wraps the code that changes state**, whereas **`useDeferredValue` wraps the value resulting from a state change**.

---

## Side-by-Side Comparison

| Feature                    | `useTransition`                                                                      | `useDeferredValue`                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| **Primary Target**         | State update function (`setState` / `dispatch`).                                     | A specific value (prop, state, or primitive).                                                       |
| **Control Point**          | **Source / Cause:** Use when you own and call the state setter function directly.    | **Consumer / Effect:** Use when you receive a value (like props) and can't control when it updates. |
| **Pending Indicator**      | **Built-in:** Provides `isPending` boolean flag (`true` while transition processes). | **Manual:** Requires comparing `value !== deferredValue` to check if stale.                         |
| **Component Requirements** | Works on standard components without extra wrapping.                                 | Requires wrapping receiving child components in `React.memo`.                                       |
| **Mental Model**           | _"Run this state update in the background."_                                         | _"Give me a version of this value that updates in the background."_                                 |

---

## Code Comparison

### Option A: Using `useTransition` (State Control)

Use this when you write the event handler that updates state:

```tsx
function SearchPage() {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Wrap state setter in startTransition
    startTransition(() => {
      setQuery(e.target.value);
    });
  };

  return (
    <div>
      <input onChange={handleChange} />
      {/* 2. Built-in pending status */}
      {isPending && <Spinner />}
      <HeavyList query={query} />
    </div>
  );
}
```

### Option B: Using `useDeferredValue` (Value/Prop Control)

Use this when receiving a value from an external source or parent component where you don't control `setQuery`:

```tsx
function SearchPage({ externalQuery }: { externalQuery: string }) {
  // 1. Wrap incoming prop/value directly
  const deferredQuery = useDeferredValue(externalQuery);

  // 2. Derive pending status manually
  const isStale = externalQuery !== deferredQuery;

  return (
    <div style={{ opacity: isStale ? 0.6 : 1 }}>
      {/* 3. Pass deferred value to a memoized child */}
      <HeavyList query={deferredQuery} />
    </div>
  );
}

// NOTE: HeavyList MUST be wrapped in React.memo!
const HeavyList = React.memo(function HeavyList({ query }: { query: string }) {
  // Expensive rendering logic...
});
```

---

## Decision Matrix: Which Should You Pick?

### Choose `useTransition` if:

- You own the state setting function (e.g., `setTab`, `setFilter`, `dispatch`).
- You want to execute multiple state updates simultaneously as a single background transition.
- You need a clean, out-of-the-box loading state (`isPending`) to show spinners or disable UI elements.

### Choose `useDeferredValue` if:

- You are receiving data as `props` from a parent component or third-party hook.
- You want a "debounced-like" effect without arbitrary timer delays, letting React update as fast as the device allows.
- You are passing values down to heavy, memoized subtrees (`React.memo`).
