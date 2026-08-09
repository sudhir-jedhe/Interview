Here is a production-ready `useOnClickOutside` hook that supports multiple ref targets, touch devices, and custom event types (`mousedown`, `pointerdown`, or `touchstart`).

```jsx
import { useEffect, useRef } from "react";

/**
 * Custom hook to trigger a callback when clicking outside one or multiple target elements.
 *
 * @param {React.RefObject|React.RefObject[]} ref - Single ref or array of refs to ignore clicks within.
 * @param {Function} handler - Callback invoked on outside clicks.
 * @param {string} [eventType="pointerdown"] - Event type to listen for ('pointerdown', 'mousedown', 'touchstart').
 */
export function useOnClickOutside(ref, handler, eventType = "pointerdown") {
  const handlerRef = useRef(handler);

  // Store handler in ref to prevent listener re-binding on callback re-creation
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const listener = (event) => {
      const target = event.target;

      // Handle both single ref object or array of ref objects
      const refs = Array.isArray(ref) ? ref : [ref];

      const isInside = refs.some((r) => {
        const element = r?.current;
        return element && element.contains(target);
      });

      // Execute callback if click target is outside all referenced elements
      if (!isInside && handlerRef.current) {
        handlerRef.current(event);
      }
    };

    document.addEventListener(eventType, listener);

    return () => {
      document.removeEventListener(eventType, listener);
    };
  }, [ref, eventType]);
}

```

---

### Usage Examples

#### 1. Standard Modal / Dropdown

```jsx
import { useState, useRef } from "react";

function Popover() {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  useOnClickOutside(popoverRef, () => setIsOpen(false));

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setIsOpen((prev) => !prev)}>Toggle Popover</button>

      {isOpen && (
        <div
          ref={popoverRef}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            padding: "16px",
            background: "#ffffff",
            border: "1px solid #ddd",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <p>Clicking outside this box will close it.</p>
        </div>
      )}
    </div>
  );
}

```

#### 2. Multi-Ref Ignore (Trigger Button + Portal Dropdown)

```jsx
import { useState, useRef } from "react";

function MultiRefDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  // Ignore clicks on both the toggle button and the floating menu
  useOnClickOutside([buttonRef, menuRef], () => setIsOpen(false));

  return (
    <div>
      <button ref={buttonRef} onClick={() => setIsOpen((prev) => !prev)}>
        Menu
      </button>

      {isOpen && (
        <div ref={menuRef} className="floating-menu">
          <ul>
            <li>Profile</li>
            <li>Settings</li>
            <li>Logout</li>
          </ul>
        </div>
      )}
    </div>
  );
}

```

---

### Key Features

* **Multi-Ref Support:** Accepts either a single `ref` or an array of `refs` (`[buttonRef, menuRef]`). This avoids the common bug where clicking a trigger button toggles a menu off and immediately back on.
* **Modern `pointerdown` Default:** Uses `pointerdown` for fast response across desktop mouse, mobile touch, and pen/stylus interactions.
* **Ref-Stabilized Handler:** Captures the callback in `handlerRef` to eliminate unnecessary removing and re-attaching of DOM event listeners when parent components re-render.
* **SSR Safe:** Guards against server-side rendering execution.
