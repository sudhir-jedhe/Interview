Here is a production-ready, highly flexible `useEventListener` React hook that works with DOM elements, the `window`, `document`, or media query lists—complete with TypeScript/JSDoc signatures for strict typing.

```jsx
import { useEffect, useRef } from "react";

/**
 * Custom hook to attach event listeners to any DOM element, window, document, or event target.
 *
 * @param {string} eventName - The event name to listen for (e.g., 'click', 'keydown', 'resize').
 * @param {Function} handler - The callback function executed when the event triggers.
 * @param {React.RefObject|EventTarget} [target=window] - Optional target element or ref (defaults to window).
 * @param {boolean|AddEventListenerOptions} [options] - Event listener options (e.g., { capture, passive, once }).
 */
export function useEventListener(eventName, handler, target, options) {
  // Store the handler in a ref to avoid re-binding listeners when the handler reference changes
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    // Determine the actual event target (supports RefObject or raw EventTarget)
    const targetElement = target && "current" in target ? target.current : target;

    // Default to window if no target is provided (and window exists for SSR safety)
    const element = targetElement ?? (typeof window !== "undefined" ? window : null);

    if (!element?.addEventListener) return;

    const eventListener = (event) => {
      if (handlerRef.current) {
        handlerRef.current(event);
      }
    };

    element.addEventListener(eventName, eventListener, options);

    return () => {
      element.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, target, options]);
}

```

---

### Usage Examples

#### 1. Listening to Global Key Presses (`window`)

```jsx
function KeyboardShortcut() {
  useEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      console.log("Escape pressed!");
    }
  });

  return <div>Press ESC to trigger action</div>;
}

```

#### 2. Listening to Specific Ref Element

```jsx
import { useRef } from "react";

function HoverCard() {
  const buttonRef = useRef(null);

  useEventListener("mouseenter", () => console.log("Hovered!"), buttonRef);
  useEventListener("mouseleave", () => console.log("Left!"), buttonRef);

  return <button ref={buttonRef}>Hover me</button>;
}

```

#### 3. Listening with Event Options (`passive`, `capture`)

```jsx
function ScrollTracker() {
  useEventListener(
    "scroll",
    (event) => {
      console.log("Scroll position:", window.scrollY);
    },
    typeof window !== "undefined" ? window : null,
    { passive: true } // Optimizes scroll performance
  );

  return <div style={{ height: "200vh" }}>Scroll down</div>;
}

```

---

### Key Features

* **Ref-Based Handler Mirroring:** Stores the callback in `handlerRef` so the underlying event listener is never needlessly torn down and re-attached when state changes inside the handler.
* **Flexible Target Resolution:** Accepts `React.RefObject` (e.g., `buttonRef`), raw `EventTarget` (e.g., `document`, `window`), or defaults safely to `window`.
* **SSR Safe:** Guards against missing `window` objects during server-side rendering in Next.js or Remix.
* **Full Options Support:** Transparently passes standard `AddEventListenerOptions` (such as `{ passive: true }` or `{ capture: true }`).
