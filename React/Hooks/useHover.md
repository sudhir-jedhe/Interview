```js
import { Ref, useCallback, useRef, useState } from "react";
import { Ref, useCallback, useRef, useState } from "react";
import { useCallback, useLayoutEffect, useState } from "react";

export function useHover<T extends HTMLElement>(): [Ref<T>, boolean] {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  const ref = useRef<T>();
  const callbackRef = useCallback(node => {
    if (ref.current) {
      ref.current.removeEventListener('mouseenter', handleMouseEnter);
      ref.current.removeEventListener('mouseleave', handleMouseLeave);
    }
    ref.current = node;
    if (ref.current) {
      ref.current.addEventListener('mouseenter', handleMouseEnter);
      ref.current.addEventListener('mouseleave', handleMouseLeave);
    }
  }, [handleMouseEnter, handleMouseLeave]);
  // your code here
  return [callbackRef, isHovered];
}
// if you want to try your code on the right panel
// remember to export App() component like below
// export function App() {
//   return <div>your app</div>
// }



/************************ */


mport { Ref, useRef, useState, useEffect } from 'react'
export function useHover<T extends HTMLElement>(): [Ref<T | undefined>, boolean] {
  const ref = useRef<T>()
  const [isHovering, setHovering] = useState(false)
  useEffect(() => {
    // false by default if ref.current changes
    setHovering(false)
    const element = ref.current
    if (!element)
      return
    const setYes = () => setHovering(true)
    const setNo = () => setHovering(false)

    element.addEventListener('mouseenter', setYes)
    element.addEventListener('mouseleave', setNo)
    return () => {
      element.removeEventListener('mouseenter', setYes)
      element.removeEventListener('mouseleave', setNo)
    }
  }, [ref.current]) // now we could pass a dependency array for better performances.
  return [ref, isHovering]
}
 17
 mute

 /******************************* */

 Using AbortController removes the need of saving the reference to the callback function in order to successfully do the cleanup

export function useHover<T extends HTMLElement>(): [Ref<T>, boolean] {
   const [isHovered, setIsHovered] = useState<boolean>(false);
   const controllerRef = useRef(new AbortController());
  const ref = useRef<T>();
  const callbackRef = useCallback(node => {
    if (ref.current) {
      controllerRef.current.abort();
      controllerRef.current = new AbortController();
    }
    const { signal } = controllerRef.current
    ref.current = node;
    if (ref.current) {
      ref.current.addEventListener('mouseenter', () => setIsHovered(true), { signal });
      ref.current.addEventListener('mouseleave', () => setIsHovered(false), { signal });
    }
  }, []);
  // your code here
  return [callbackRef, isHovered];
}


/******************************** */


export function useHover<T extends HTMLElement | null>(): [
  (_ref: T) => void,
  boolean
] {
  const [node, setNode] = useState<T>();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const ref = useCallback((_ref: T) => setNode(_ref), []);
  useLayoutEffect(() => {
    if (!node) return;
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [node]);
  return [ref, isHovered];
}
```

Here is a production-ready `useHover` React hook. It uses a callback ref pattern so it works reliably even with dynamically rendered elements, conditional components, or refs passed down to children.

```jsx
import { useState, useCallback, useRef } from "react";

/**
 * Custom hook to track whether a mouse is currently hovering over a target DOM element.
 *
 * @returns {[Function, boolean]} A tuple containing the callback ref to attach to the element, and the current hover state boolean.
 */
export function useHover() {
  const [isHovered, setIsHovered] = useState(false);

  // Store active element and handlers to ensure clean teardown
  const elementRef = useRef(null);
  const handlersRef = useRef(null);

  const ref = useCallback((node) => {
    // Teardown previous event listeners if node changes or component unmounts
    if (elementRef.current && handlersRef.current) {
      const { handleMouseEnter, handleMouseLeave } = handlersRef.current;
      elementRef.current.removeEventListener("mouseenter", handleMouseEnter);
      elementRef.current.removeEventListener("mouseleave", handleMouseLeave);
    }

    elementRef.current = node;

    // Attach listeners if a valid DOM node is attached
    if (node) {
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);

      handlersRef.current = { handleMouseEnter, handleMouseLeave };

      node.addEventListener("mouseenter", handleMouseEnter);
      node.addEventListener("mouseleave", handleMouseLeave);
    }
  }, []);

  return [ref, isHovered];
}

```

---

### Usage Examples

#### 1. Standard Button Hover

```jsx
function HoverButton() {
  const [hoverRef, isHovered] = useHover();

  return (
    <button
      ref={hoverRef}
      style={{
        backgroundColor: isHovered ? "#0056b3" : "#007bff",
        color: "#ffffff",
        padding: "10px 20px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
      }}
    >
      {isHovered ? "Hovering!" : "Hover Me"}
    </button>
  );
}

```

#### 2. Conditional / Dynamically Rendered Element

```jsx
function DynamicCard() {
  const [hoverRef, isHovered] = useHover();
  const [showCard, setShowCard] = useState(true);

  return (
    <div>
      <button onClick={() => setShowCard((prev) => !prev)}>Toggle Card</button>
      {showCard && (
        <div
          ref={hoverRef}
          style={{
            padding: "20px",
            marginTop: "10px",
            border: "1px solid #ccc",
            boxShadow: isHovered ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
          }}
        >
          {isHovered ? "Mouse is inside card" : "Mouse is outside card"}
        </div>
      )}
    </div>
  );
}

```

---

### Key Features

* **Callback Ref Pattern:** Uses a callback ref instead of a static `useRef` object. This ensures event listeners attach reliably even if the element is conditionally rendered (`{show && <div ref={hoverRef} />}`) or swapped dynamically.
* **Modern Pointer/Mouse Handling:** Uses `mouseenter` and `mouseleave` rather than `mouseover`/`mouseout` to avoid event bubbling artifacts when moving between nested child elements inside the target container.
* **Leak-Free Teardown:** Guarantees listeners are detached when elements unmount or nodes swap out.
