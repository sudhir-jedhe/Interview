While **`useLayoutEffect`** and **`useEffect`** share identical function signatures (`useLayoutEffect(effectFn, deps)`), React executes them at fundamentally different stages of the **Commit Phase**.

The core distinction lies in **when they fire relative to the browser painting pixels to the screen** and whether their execution blocks the main thread.

---

### 1. Timing & Execution Differences

```text
 [ RENDER PHASE ] ──► [ DOM MUTATION ] ──► [ LAYOUT PHASE ] ──► [ BROWSER PAINT ] ──► [ PASSIVE EFFECTS ]
 Calculates diffs     Updates HTML DOM     useLayoutEffect      Pixels on screen     useEffect
                                           (Sync / Blocking)                          (Async / Non-blocking)

```

| Feature               | `useLayoutEffect`                                                                      | `useEffect`                                                          |
| --------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **Execution Timing**  | Post-DOM mutation, **Before Paint**                                                    | Post-DOM mutation, **After Paint**                                   |
| **Execution Mode**    | **Synchronous / Blocking**                                                             | **Asynchronous / Non-blocking**                                      |
| **Ref Reliability**   | `ref.current` is attached and readable                                                 | `ref.current` is attached and readable                               |
| **UI Impact**         | Blocks browser paint until complete                                                    | Runs in background; does not block paint                             |
| **Primary Use Cases** | Layout measurements (`getBoundingClientRect`), tooltip positioning, scroll adjustments | API data fetching, subscriptions, analytics logging, event listeners |

---

### 2. Deep Dive: `useLayoutEffect` (Synchronous & Pre-Paint)

`useLayoutEffect` fires synchronously during the **Layout Phase** of the Commit Phase, immediately after React updates the live DOM nodes in memory, but **before the browser paints the frame to the physical display**.

* **Why it blocks paint:** Because it runs synchronously on the main thread, the browser cannot execute its Layout or Paint passes until `useLayoutEffect` (and any state updates triggered inside it) completely finishes.
* **Why this is useful:** If you need to read an element's size/position and mutate the DOM based on that measurement, doing it inside `useLayoutEffect` ensures the user **never sees the intermediate visual jump** (no screen flickering).

#### Code Example: Tooltip Auto-Positioning (Preventing Flickering)

In this example, a tooltip needs to be positioned above an anchor button. To do this, React must first render the tooltip in the DOM to measure its height, then adjust its CSS `top` property.

```jsx
import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';

export function Tooltip({ targetRef, text }) {
  const tooltipRef = useRef(null);
  const [top, setTop] = useState(0);

  // 1. SYNCHRONOUS & BEFORE PAINT
  // Measures the DOM node and adjusts state BEFORE pixels hit the screen.
  useLayoutEffect(() => {
    if (targetRef.current && tooltipRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      // Position tooltip 8px above the target button
      const calculatedTop = targetRect.top - tooltipRect.height - 8;
      setTop(calculatedTop);
    }
  }, [targetRef]);

  return (
    <div
      ref={tooltipRef}
      style={{
        position: 'fixed',
        top: `${top}px`,
        left: '20px',
        backgroundColor: '#333',
        color: '#fff',
        padding: '6px 12px',
        borderRadius: '4px',
      }}
    >
      {text}
    </div>
  );
}

```

> **What happens if you use `useEffect` here instead?**
> The tooltip would briefly render at `top: 0px` on screen, the browser would paint it, and a fraction of a millisecond later `useEffect` would fire, recalculate `top`, and trigger a second paint. The user would perceive this as a **visible visual glitch or flash**.

---

### 3. Deep Dive: `useEffect` (Asynchronous & Post-Paint)

`useEffect` fires during the **Passive Effects Phase** of the Commit Phase. React queues its execution using its internal `Scheduler` package to run asynchronously **after the browser has finished painting pixels to the screen**.

* **Why it does not block paint:** Deferring `useEffect` allows the browser to deliver frame updates instantly, keeping the app responsive to user input.
* **Why this is useful:** Most side effects—such as data fetching, analytics tracking, or setting up web socket subscriptions—do not require reading live DOM dimensions before paint.

#### Code Example: Data Fetching & Subscriptions (Non-blocking)

```jsx
import React, { useState, useEffect } from 'react';

export function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  // 2. ASYNCHRONOUS & AFTER PAINT
  // Fires in the background after the screen has already rendered.
  useEffect(() => {
    let isMounted = true;

    async function fetchUserData() {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      if (isMounted) {
        setUser(data);
      }
    }

    fetchUserData();

    // Cleanup function runs asynchronously before the next effect or on unmount
    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (!user) {
    return <div>Loading user profile...</div>;
  }

  return <div>Welcome, {user.name}</div>;
}

```

---

### 4. Direct Visual Comparison: Execution Pipeline

```text
 SCENARIO: State update causes DOM mutation + secondary state update in Effect

 With useLayoutEffect:
 [ DOM Mutation ] ──► [ useLayoutEffect (setTop) ] ──► [ Re-render ] ──► [ BROWSER PAINTS SINGLE FRAME ]
 (User sees final correctly positioned UI instantly—ZERO flicker)

 With useEffect:
 [ DOM Mutation ] ──► [ BROWSER PAINTS FRAME 1 (Unpositioned) ] ──► [ useEffect (setTop) ] ──► [ BROWSER PAINTS FRAME 2 ]
 (User sees initial unpositioned UI for 1 frame, then jumps—VISUAL FLICKER)

```

---

### Summary Rules of Thumb

1. **Default to `useEffect`:** Always use `useEffect` for data fetching, state synchronization, subscriptions, timers, and non-visual side effects.
2. **Use `useLayoutEffect` only when necessary:** Use `useLayoutEffect` strictly when you need to read DOM layout properties (`offsetHeight`, `getBoundingClientRect`, `scrollTop`) and perform imperative DOM mutations or synchronous state updates **before the user sees the screen update**.
