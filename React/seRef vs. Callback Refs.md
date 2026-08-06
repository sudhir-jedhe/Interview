While `useRef` is the most common way to access DOM nodes in React, **Callback Refs** provide fine-grained control over when a DOM node is attached, detached, or resized.

React 19 further refined Callback Refs by introducing **cleanup functions**, bringing their API parity closer to `useEffect`.

---

### 1. `useRef` vs. Callback Refs: The Fundamental Difference

#### `useRef` (Passive Container)

`useRef` creates a plain JavaScript object `{ current: initialValue }` that persists across re-renders.

* React updates `ref.current` during the Commit Phase, but **it does not notify your component when `ref.current` changes**.
* If a DOM node mounts conditionally, `useRef` does not trigger a re-render or callback when the node attaches or detaches.

```jsx
// ❌ useRef cannot notify you when the DOM node mounts/unmounts
const nodeRef = useRef(null);

useEffect(() => {
  // If nodeRef.current was null during initial mount (e.g., conditional render),
  // this effect won't re-run when the element actually mounts!
  if (nodeRef.current) {
    console.log(nodeRef.current.getBoundingClientRect());
  }
}, []);

```

#### Callback Ref (Active Lifecycle Event)

Instead of passing a ref object created by `useRef`, you pass a **function** to the `ref` prop. React calls this function whenever the underlying DOM node mounts or unmounts.

```jsx
// ✅ Callback Ref fires as soon as the DOM node is attached
const measureRef = useCallback((node) => {
  if (node !== null) {
    console.log("DOM Node Mounted!", node.getBoundingClientRect());
  }
}, []);

return <div ref={measureRef}>Hello</div>;

```

---

### 2. How Callback Refs Trigger on Mount and Unmount

During the **Layout Phase** of the Commit Pipeline, React evaluates all `ref` props on host components (`div`, `button`, `input`):

1. **On Mount (Element added to live DOM):**
React invokes the callback ref, passing the **real DOM node instance** as the first argument:

$$\text{refCallback}(\text{domNode})$$

1. **On Unmount (Element removed from DOM):**
Prior to React 19, React invoked the callback ref with `null` as the argument to signal detachment:

$$\text{refCallback}(\text{null})$$

```javascript
// Pre-React 19 Callback Ref Pattern
const refCallback = (node) => {
  if (node !== null) {
    // Mount phase: Node attached
    node.addEventListener('scroll', handleScroll);
  } else {
    // Unmount phase: Node detached (node is null here!)
    // Problem: You need a cached reference to remove event listeners!
  }
};

```

---

### 3. Cleanup Functions in React 19

Prior to React 19, handling cleanups inside callback refs was cumbersome because when React called the ref with `null` during unmount, you no longer had access to the previous DOM instance to remove event listeners or disconnect observers.

**React 19 introduced explicit cleanup returns for Callback Refs**, matching the familiar `useEffect` cleanup pattern.

#### React 19 Callback Ref Cleanup API

Instead of handling `null` checks for unmounting, a callback ref in React 19 can **return a cleanup function**. React calls this cleanup function when the DOM node detaches from the document.

```jsx
import { useCallback } from 'react';

function ResizableBox() {
  // ✅ React 19 Pattern: Return a cleanup function directly
  const refWithCleanup = useCallback((node) => {
    // 1. Mount Phase: Executed when <div /> is inserted into DOM
    const observer = new ResizeObserver((entries) => {
      console.log('Resized:', entries[0].contentRect);
    });

    observer.observe(node);

    // 2. Unmount Phase: Executed when <div /> is removed from DOM
    return () => {
      observer.disconnect();
    };
  }, []);

  return <div ref={refWithCleanup}>Resize Me</div>;
}

```

#### Important Rule in React 19

To prevent ambiguities, React 19 strictly expects **either**:

1. Returning a cleanup function: `(node) => { return () => { ... }; }`
2. Returning nothing (`undefined`): `(node) => { /* setup without returning */ }`

*If you return a cleanup function, React will **not** invoke the callback ref with `null` on unmount; it will run your cleanup function instead.*

---

### 4. Summary Matrix

| Feature                     | `useRef`                            | Callback Ref (Pre-React 19)       | Callback Ref (React 19+)                   |
| --------------------------- | ----------------------------------- | --------------------------------- | ------------------------------------------ |
| **Notification on Mount**   | ❌ No                                | ✅ Fires `cb(node)`                | ✅ Fires `cb(node)`                         |
| **Notification on Unmount** | ❌ No                                | ✅ Fires `cb(null)`                | ✅ Runs returned cleanup function           |
| **Conditional Rendering**   | Fails to detect node appearance     | Detects node appearance instantly | Detects node appearance instantly          |
| **DOM Observers / Measure** | Requires combining with `useEffect` | Handled inside `cb(node)`         | Handled inline with return cleanup         |
| **Cleanup Ergonomics**      | Handled in `useEffect` cleanup      | Awkward (`if (node === null)`)    | **Clean & Idiomatic** (`return () => ...`) |
