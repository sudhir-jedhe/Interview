Here is a production-ready `useLongPress` React hook for press-and-hold actions. It supports both mouse and touch events, configurable thresholds, cancellation on drag/move, and distinct callbacks for when a long press succeeds versus when a short tap/click occurs.

```jsx
import { useCallback, useRef } from "react";

/**
 * Custom hook to detect press-and-hold (long press) user interactions.
 *
 * @param {Function} onLongPress - Callback invoked when the threshold is reached.
 * @param {Object} [options] - Configuration options.
 * @param {number} [options.threshold=500] - Duration in ms before triggering onLongPress.
 * @param {Function} [options.onClick] - Callback invoked if released before the threshold (short tap).
 * @param {Function} [options.onStart] - Callback invoked immediately when press begins.
 * @param {Function} [options.onFinish] - Callback invoked when press ends normally.
 * @param {Function} [options.onCancel] - Callback invoked if press is canceled (e.g., scrolled/dragged away).
 * @param {boolean} [options.cancelOnMovement=true] - Cancels long press if touch/mouse moves beyond movementLimit.
 * @param {number} [options.movementLimit=10] - Pixel movement threshold to cancel long press.
 */
export function useLongPress(onLongPress, options = {}) {
  const {
    threshold = 500,
    onClick,
    onStart,
    onFinish,
    onCancel,
    cancelOnMovement = true,
    movementLimit = 10,
  } = options;

  const timerRef = useRef(null);
  const isLongPressActiveRef = useRef(false);
  const isPressedRef = useRef(false);
  const startCoordinatesRef = useRef({ x: 0, y: 0 });

  // Keep references to options up-to-date to avoid stale closure issues
  const callbacksRef = useRef({
    onLongPress,
    onClick,
    onStart,
    onFinish,
    onCancel,
  });

  callbacksRef.current = {
    onLongPress,
    onClick,
    onStart,
    onFinish,
    onCancel,
  };

  const getCoordinates = (event) => {
    if ("touches" in event && event.touches.length > 0) {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
    if ("clientX" in event) {
      return { x: event.clientX, y: event.clientY };
    }
    return { x: 0, y: 0 };
  };

  const start = useCallback(
    (event) => {
      // Ignore right clicks or secondary touches
      if ("button" in event && event.button !== 0) return;

      isPressedRef.current = true;
      isLongPressActiveRef.current = false;

      const coords = getCoordinates(event);
      startCoordinatesRef.current = coords;

      if (callbacksRef.current.onStart) {
        callbacksRef.current.onStart(event);
      }

      timerRef.current = setTimeout(() => {
        isLongPressActiveRef.current = true;
        if (callbacksRef.current.onLongPress) {
          callbacksRef.current.onLongPress(event);
        }
      }, threshold);
    },
    [threshold]
  );

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const cancel = useCallback(
    (event) => {
      if (!isPressedRef.current) return;

      clearTimer();
      isPressedRef.current = false;

      if (callbacksRef.current.onCancel) {
        callbacksRef.current.onCancel(event);
      }
    },
    [clearTimer]
  );

  const move = useCallback(
    (event) => {
      if (!cancelOnMovement || !isPressedRef.current || isLongPressActiveRef.current) {
        return;
      }

      const currentCoords = getCoordinates(event);
      const deltaX = Math.abs(currentCoords.x - startCoordinatesRef.current.x);
      const deltaY = Math.abs(currentCoords.y - startCoordinatesRef.current.y);

      // Cancel if dragged beyond threshold (e.g. user started scrolling)
      if (deltaX > movementLimit || deltaY > movementLimit) {
        cancel(event);
      }
    },
    [cancelOnMovement, movementLimit, cancel]
  );

  const end = useCallback(
    (event) => {
      if (!isPressedRef.current) return;

      clearTimer();

      if (isLongPressActiveRef.current) {
        if (callbacksRef.current.onFinish) {
          callbacksRef.current.onFinish(event);
        }
      } else {
        if (callbacksRef.current.onClick) {
          callbacksRef.current.onClick(event);
        }
      }

      isPressedRef.current = false;
      isLongPressActiveRef.current = false;
    },
    [clearTimer]
  );

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseMove: move,
    onTouchMove: move,
    onMouseUp: end,
    onTouchEnd: end,
    onMouseLeave: cancel,
  };
}

```

---

### Usage Examples

#### 1. Long Press Context Menu / Action Sheet

```jsx
function QuickActionButton() {
  const longPressHandlers = useLongPress(
    (e) => {
      console.log("Long press triggered! Show context menu.");
    },
    {
      threshold: 600,
      onClick: () => console.log("Short tap: open default view"),
    }
  );

  return (
    <button {...longPressHandlers} className="action-button">
      Press & Hold to Options
    </button>
  );
}

```

#### 2. Press and Hold to Increment Counter

```jsx
function HoldCounter() {
  const [count, setCount] = useState(0);

  const handlers = useLongPress(
    () => {
      // Rapid boost on long press
      setCount((c) => c + 10);
    },
    {
      threshold: 500,
      onClick: () => setCount((c) => c + 1), // Standard click increments by 1
    }
  );

  return (
    <div>
      <h3>Count: {count}</h3>
      <button {...handlers}>+ Increment</button>
    </div>
  );
}

```

---

### Key Features

* **Cross-Device Support:** Handles both Touch (`touchstart`, `touchend`, `touchmove`) and Mouse events (`mousedown`, `mouseup`, `mouseleave`) seamlessly.
* **Scroll & Drag Protection (`cancelOnMovement`):** Cancels the long press timer if the user moves their finger or mouse beyond `movementLimit` pixels, preventing accidental triggers while scrolling down a list.
* **Separation of Click vs. Hold (`onClick`):** Short taps trigger `onClick`, while presses sustained beyond the `threshold` trigger `onLongPress`.
* **Ref-Stabilized Callbacks:** Uses mutable callback refs to ensure state changes inside your handlers never cause event listeners to tear down or misfire.
