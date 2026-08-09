Here is a production-ready `useForkRef` React hook. It cleanly merges multiple refs (whether function refs or `MutableRefObject` / `RefObject` instances) into a single callback ref, ensuring proper ref assignment and cleanup during unmounts and updates.

```jsx
import { useMemo } from "react";

/**
 * Safely sets or clears a value on a function or object ref.
 */
function setRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    ref.current = value;
  }
}

/**
 * Custom hook that merges multiple React refs into a single unified callback ref.
 *
 * @param {...(React.Ref|null|undefined)} refs - Any number of React refs (callback refs or RefObjects).
 * @returns {Function|null} A merged callback ref or null if all passed refs are empty.
 */
export function useForkRef(...refs) {
  return useMemo(() => {
    // Return null if every ref passed is null or undefined
    if (refs.every((ref) => ref == null)) {
      return null;
    }

    return (node) => {
      refs.forEach((ref) => {
        setRef(ref, node);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}

```

---

### Usage Examples

#### 1. Forwarding Ref while maintaining an Internal Ref

```jsx
import { useRef, forwardRef } from "react";

const CustomInput = forwardRef((props, externalRef) => {
  const internalRef = useRef(null);

  // Merge the forwarded ref and local internal ref
  const handleRef = useForkRef(externalRef, internalRef);

  const focusInput = () => {
    internalRef.current?.focus();
  };

  return (
    <div>
      <input ref={handleRef} {...props} />
      <button onClick={focusInput}>Focus from Inside</button>
    </div>
  );
});

CustomInput.displayName = "CustomInput";

```

#### 2. Combining Custom Hook Refs with Local Component Refs

```jsx
import { useRef } from "react";

function MeasureAndHoverCard() {
  const localCardRef = useRef(null);
  
  // Custom hook that returns a callback ref
  const [hoverRef, isHovered] = useHover();

  // Merge local ref and custom hook ref
  const combinedRef = useForkRef(localCardRef, hoverRef);

  return (
    <div ref={combinedRef} className="card">
      {isHovered ? "Mouse is hovering over card!" : "Hover me"}
    </div>
  );
}

```

---

### Key Features

* **Supports All Ref Types:** Seamlessly handles callback refs (`(node) => ...`), `React.useRef()` objects (`{ current: node }`), and handles `null` / `undefined` gracefully.
* **Stable Memoization:** Uses `useMemo` with ref arguments as dependencies so the returned callback reference remains stable across re-renders unless the underlying refs change.
* **Component Library Utility:** Essential for building reusable UI library components (`forwardRef`) that also need internal DOM measurements, event listeners, or focus control.
