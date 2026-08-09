**`useMemo` executes first** during the **Render Phase**, while **`useEffect` executes later** during the **Commit Phase** (after the browser has painted the screen).

---

### The Execution Timeline

Even when both hooks share the exact same dependencies and run in response to the exact same state or prop change, React processes them in distinct phases of the rendering lifecycle:

```
                  ┌─────────────────────────────────────────┐
                  │ 1. State / Prop Update Triggers Render  │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │ 2. RENDER PHASE                         │
                  │    • Component function executes.       │
                  │    • `useMemo` evaluates FIRST!         │ ◄── 1st: synchronous
                  │    • JSX returned.                      │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │ 3. COMMIT & PAINT PHASE                 │
                  │    • React updates DOM nodes.           │
                  │    • Browser draws UI on screen.        │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │ 4. EFFECT PHASE                         │
                  │    • `useEffect` executes LAST!         │ ◄── 2nd: asynchronous
                  └─────────────────────────────────────────┘

```

---

### Code Demonstration

```tsx
import { useState, useMemo, useEffect } from 'react';

export function ExecutionOrderExample() {
  const [count, setCount] = useState(0);

  // 1. Synchronous during render
  const memoizedValue = useMemo(() => {
    console.log('1. useMemo executed (Render Phase)');
    return count * 2;
  }, [count]);

  // 2. Asynchronous after browser paint
  useEffect(() => {
    console.log('2. useEffect executed (Post-Paint Phase)');
  }, [count]);

  console.log('--- Component Function Render Body ---');

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count} | Doubled: {memoizedValue}
    </button>
  );
}

```

#### Console Output when clicking the button

```text
--- Component Function Render Body ---
1. useMemo executed (Render Phase)
2. useEffect executed (Post-Paint Phase)

```

---

### Key Architectural Differences

| Property              | `useMemo`                                      | `useEffect`                                                                |
| --------------------- | ---------------------------------------------- | -------------------------------------------------------------------------- |
| **Execution Timing**  | **Synchronous** during rendering.              | **Asynchronous** after browser paint.                                      |
| **Lifecycle Phase**   | **Render Phase** (computing UI output).        | **Commit / Post-Paint Phase** (side effects).                              |
| **Primary Purpose**   | Caching calculated values or reference values. | Interacting with external systems (APIs, subscriptions, DOM manipulation). |
| **Blocking Behavior** | Blocks rendering if computation is slow.       | Non-blocking (UI paints before effect runs).                               |

> ⚠️ **Rule of Thumb:** Because `useMemo` runs *during* render, you should **never perform side effects** (like API calls or state updates) inside `useMemo`. Keep side effects strictly inside `useEffect`.
