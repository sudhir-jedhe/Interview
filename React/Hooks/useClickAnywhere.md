Here is a production-ready `useClickAnywhere` hook that listens for global pointer clicks (`mousedown` or `pointerdown`) and triggers a callback with the click event.

```jsx
import { useEffect, useRef } from "react";

export function useClickAnywhere(handler, { eventType = "pointerdown" } = {}) {
  // Keep handler reference updated to avoid stale closures inside event listeners
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const listener = (event) => {
      if (handlerRef.current) {
        handlerRef.current(event);
      }
    };

    window.addEventListener(eventType, listener);

    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType]);
}

```

### Usage Examples

#### 1. Close Menu or Overlay on Outside Click

```jsx
import { useState, useRef } from "react";

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useClickAnywhere((event) => {
    // If click happened outside the container, close the dropdown
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  });

  return (
    <div ref={containerRef}>
      <button onClick={() => setIsOpen((prev) => !prev)}>Toggle Menu</button>
      {isOpen && <ul><li>Option 1</li><li>Option 2</li></ul>}
    </div>
  );
}

```

#### 2. Global Analytics / Idle Trigger

```jsx
function App() {
  // Log global interaction coordinates
  useClickAnywhere((event) => {
    console.log("Global click at:", event.clientX, event.clientY);
  });

  return <div>App Content</div>;
}

```

### Key Features

* **Stale Closure Prevention:** Uses `useRef` to cache the latest handler, avoiding unnecessary removal and re-binding of global event listeners when the handler changes.
* **Modern Event Support:** Defaults to `pointerdown` for fast response across mobile touch, pen, and mouse inputs (configurable to `mousedown` or `click`).
* **SSR Safe:** Guards against `window` being undefined during server-side rendering.
