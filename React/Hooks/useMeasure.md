Here is a production-ready `useMeasure` React hook that tracks element dimensions in real time using `ResizeObserver`.

It uses a **callback ref** pattern so it works reliably with conditionally rendered elements and dynamic nodes, and returns both the standard `DOMRect` bounds and full dimensions.

```jsx
import { useState, useCallback, useRef } from "react";

/**
 * Custom hook to measure a DOM element's size and bounding rectangle using ResizeObserver.
 *
 * @returns {[Function, { width: number, height: number, top: number, left: number, bottom: number, right: number, x: number, y: number }]}
 * A tuple containing the callback ref to attach to the target element and the current dimensions object.
 */
export function useMeasure() {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0,
  });

  const observerRef = useRef(null);

  const ref = useCallback((node) => {
    // Clean up previous observer instance
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (node) {
      // Create ResizeObserver instance
      observerRef.current = new ResizeObserver(([entry]) => {
        if (!entry) return;

        // Obtain precise client bounding rect
        const rect = node.getBoundingClientRect();

        setDimensions({
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
          bottom: rect.bottom,
          right: rect.right,
          x: rect.x,
          y: rect.y,
        });
      });

      observerRef.current.observe(node);
    }
  }, []);

  return [ref, dimensions];
}

```

---

### Usage Examples

#### 1. Responsive Container Dimension Tracking

```jsx
function ResizableCard() {
  const [measureRef, { width, height }] = useMeasure();

  return (
    <div
      ref={measureRef}
      style={{
        resize: "both",
        overflow: "auto",
        border: "1px solid #ccc",
        padding: "1rem",
        minWidth: "200px",
        minHeight: "100px",
      }}
    >
      <h3>Drag corner to resize me</h3>
      <p>
        Width: <strong>{Math.round(width)}px</strong> | Height:{" "}
        <strong>{Math.round(height)}px</strong>
      </p>
    </div>
  );
}

```

#### 2. Adaptive Rendering Based on Element Width

```jsx
function AdaptiveWidget() {
  const [measureRef, { width }] = useMeasure();

  return (
    <div ref={measureRef} className="widget-container">
      {width > 600 ? (
        <DesktopMultiColumnView />
      ) : (
        <MobileCompactView />
      )}
    </div>
  );
}

```

---

### Key Features

* **Callback Ref Pattern:** Handles dynamically mounted or conditional components (`{isOpen && <div ref={measureRef} />}`) without losing measurement synchronization.
* **`getBoundingClientRect` Accuracy:** Captures exact sub-pixel positions, scroll-relative placement, and borders alongside standard width and height.
* **Leak-Free Observer Cleanup:** Automatically disconnects the `ResizeObserver` when elements unmount or target nodes change.
* **Zero Window Thrashing:** Listens directly to element size modifications via browser layout engines without expensive `window.resize` polling.
