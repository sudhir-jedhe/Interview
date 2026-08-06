The **Layout Phase** is the third sub-phase of React's synchronous **Commit Phase**.

It runs **immediately after DOM mutations have been applied**, but **before the browser paints pixels to the screen**. At this exact moment, the live DOM in memory reflects all the new additions, deletions, and property changes, but the user is still looking at the previous frame on their display.

---

## 1. Timing in the Rendering Pipeline

```text
 [ RENDER PHASE ] ──► [ MUTATION PHASE ] ──► [ LAYOUT PHASE ] ──► [ BROWSER PAINT ] ──► [ PASSIVE EFFECTS ]
 Pure diffing          DOM Insertions /     useLayoutEffect,       Pixels rendered       useEffect
 (Offscreen)           Deletions / Updates   Ref Attachments,       to screen             (Async / Non-blocking)
                                             Class Lifecycles
                                             (Sync / Pre-Paint)

```

Because the Layout Phase runs **synchronously on the main thread**, any code executed here blocks the browser from painting. This makes it the critical phase for reading DOM layout metrics (like element widths, heights, or scroll offsets) and applying secondary adjustments without causing visual flickering.

---

## 2. Key Responsibilities of the Layout Phase

The Layout Phase performs three major operations in strict sequence:

### A. Ref Attachment (`ref.current`)

During the preceding Mutation Phase, old refs were detached (`ref.current = null`). In the Layout Phase, React binds the newly updated or mounted host DOM instances to their respective ref objects:

* **Host Components (`<div ref={myRef}>`):** Sets `myRef.current = HTMLDivElement`.
* **Class Components:** Sets `myRef.current = ClassInstance`.
* **Callback Refs (`ref={(node) => ...}`):** Executes the callback function with the DOM node instance. In React 19, callback refs can also return a cleanup function that runs during unmount.

Because ref attachment happens at the start of the Layout Phase, **refs are guaranteed to point to live, fully updated DOM nodes** inside `useLayoutEffect` and class lifecycle methods.

---

### B. Class Component Lifecycles

For class components, React executes synchronous post-mutation lifecycles:

* **`componentDidMount`:** Fires on initial mount.
* **`componentDidUpdate(prevProps, prevState, snapshot)`:** Fires on re-renders, receiving the `snapshot` returned from `getSnapshotBeforeUpdate`.

---

### C. Synchronous Execution of `useLayoutEffect`

For Function Components, React processes `useLayoutEffect` hooks in two steps:

1. **Cleanups First:** React executes the cleanup functions from the *previous* render pass for all components where dependencies changed or that are unmounting.
2. **Setups Next:** React executes the new `useLayoutEffect` setup callbacks synchronously.

---

## 3. Why `useLayoutEffect` Prevents Visual Flickering

If a component needs to measure a DOM node and adjust its layout based on that measurement, doing so inside `useEffect` causes a two-frame visual flash:

```text
 Standard useEffect Flow (Visual Flicker):
 [ DOM Update ] ──► [ BROWSER PAINTS UN-POSITIONED UI ] ──► [ useEffect fires & setState ] ──► [ BROWSER PAINTS POSITIONED UI ]

 Synchronous useLayoutEffect Flow (Flicker-Free):
 [ DOM Update ] ──► [ useLayoutEffect measures & setState ] ──► [ Re-render in memory ] ──► [ BROWSER PAINTS FINAL UI ONCE ]

```

### Code Example: Auto-Positioning Tooltip

```jsx
import React, { useState, useRef, useLayoutEffect } from 'react';

export function Tooltip({ targetRef, text }) {
  const tooltipRef = useRef(null);
  const [top, setTop] = useState(0);

  // Synchronous pre-paint execution
  useLayoutEffect(() => {
    if (targetRef.current && tooltipRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      // Position tooltip 8px above target button
      const calculatedTop = targetRect.top - tooltipRect.height - 8;
      
      // State update inside useLayoutEffect triggers an immediate synchronous re-render
      // BEFORE the browser paints. The user only ever sees the correctly positioned tooltip.
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

---

## 4. Traversal Order: Depth-First Post-Order

Just like the Mutation Phase, the Layout Phase walks the Fiber tree in **depth-first post-order** (children complete before their parents):

1. Child `ref` bindings and `useLayoutEffect` callbacks run first.
2. Parent `ref` bindings and `useLayoutEffect` callbacks run next.

This guarantees that when a parent's `useLayoutEffect` executes, all descendant DOM structures and child refs are already fully attached and readable in memory.

---

## Summary Matrix

| Metric                | Layout Phase (`useLayoutEffect`)                                                  | Passive Phase (`useEffect`)                              |
| --------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **Timing**            | Post-Mutation, **Before Browser Paint**                                           | Post-Mutation, **After Browser Paint**                   |
| **Execution**         | **Synchronous / Blocking**                                                        | **Asynchronous / Non-blocking**                          |
| **Ref State**         | `ref.current` is fully attached                                                   | `ref.current` is fully attached                          |
| **Primary Use Cases** | DOM measurement (`getBoundingClientRect`), tooltip positioning, scroll adjustment | Data fetching, event listeners, subscriptions, analytics |
