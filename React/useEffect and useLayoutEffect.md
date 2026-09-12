The primary difference between `useEffect` and `useLayoutEffect`—and their respective cleanups—is **when they execute in relation to the browser's paint cycle**.

---

### Execution Timeline Comparison

| Stage                              | `useLayoutEffect`                                                                                  | `useEffect`                                                                          |
| ---------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Execution Style**                | **Synchronous**                                                                                    | **Asynchronous** (Deferred)                                                          |
| **Runs Relative to Browser Paint** | **Before** paint (blocks paint)                                                                    | **After** paint (does not block paint)                                               |
| **Cleanup Timing**                 | Runs synchronously **before** the new layout effect and **before** the DOM updates paint to screen | Runs asynchronously **before** the next effect, **after** the previous paint         |
| **Impact on UI**                   | Guarantees no visual flicker, but can delay visual responsiveness if expensive                     | Fast and non-blocking, but DOM mutations made here may cause visual jumps/flickering |

---

### Step-by-Step Lifecycle Flow

When a component re-renders (state or prop update):

1. **React Render Phase**: React calculates changes and updates the virtual DOM.
2. **Commit Phase (Mutate DOM)**: React applies changes to the actual DOM.
3. **`useLayoutEffect` Cleanup**: Runs **synchronously**. Cleans up the previous layout effect.
4. **`useLayoutEffect` Execution**: Runs **synchronously**. Executes the effect callback.
5. **Browser Paint**: The browser paints the updated DOM and layout changes to the screen. The user sees the changes here.
6. **`useEffect` Cleanup**: Runs **asynchronously**. Cleans up the previous `useEffect`.
7. **`useEffect` Execution**: Runs **asynchronously**. Executes the effect callback.

---

### Why the Cleanup Timing Matters

#### `useEffect` Cleanup

* Runs after the browser has rendered the next screen to the user.
* **Best for non-visual cleanups**: Canceling fetch requests (`AbortController`), unsubscribing from WebSockets or event emitters, clearing timer intervals (`clearInterval`).
* Because it is non-blocking, it keeps UI transitions and animations fluid.

#### `useLayoutEffect` Cleanup

* Runs synchronously before the next layout effect and before the user sees the newly calculated frame.
* **Best for DOM measurement or synchronization**: Cleaning up external canvas contexts, imperative animations, or layout-dependent event handlers (like dragging coordinates or measuring element bounding boxes).
* If you manipulate the DOM inside `useLayoutEffect` (or tear down visual bindings in its cleanup), the user never sees an intermediate, broken state because it completes before the browser paints.

---

### Code Example: Avoiding Visual Flicker

```javascript
import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';

function Tooltip({ targetRect }) {
  const ref = useRef();
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  // If you use useEffect here:
  // The browser will paint the tooltip at { top: 0, left: 0 } first,
  // then run useEffect, re-render, and snap it to the bottom. (Noticeable flicker)

  // Using useLayoutEffect:
  // The layout math and state update happen BEFORE the browser paints.
  // The user only sees the final, properly positioned tooltip.
  useLayoutEffect(() => {
    const tooltipHeight = ref.current.getBoundingClientRect().height;
    setCoords({
      top: targetRect.bottom + 8,
      left: targetRect.left,
    });

    return () => {
      // Synchronous cleanup before the next measurement or unmount
    };
  }, [targetRect]);

  return (
    <div
      ref={ref}
      style={{ position: 'fixed', top: coords.top, left: coords.left }}
    >
      Tooltip Content
    </div>
  );
}

```

Use `useEffect` by default for virtually all side effects. Reserve `useLayoutEffect` strictly for measuring layout (`getBoundingClientRect`, `scrollHeight`, scroll positions) or synchronously mutating the DOM before the browser paints.
