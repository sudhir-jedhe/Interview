Here is a performance-optimized, SSR-safe `useWindowSize` hook that handles high-frequency resize events efficiently using `requestAnimationFrame`.

```jsx
import { useState, useEffect } from "react";

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  }));

  useEffect(() => {
    // Return early during SSR
    if (typeof window === "undefined") return;

    let frameId = null;

    const handleResize = () => {
      // Throttle state updates to browser repaint cycles
      if (frameId) return;

      frameId = requestAnimationFrame(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        frameId = null;
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return windowSize;
}

```

### Usage Example

```jsx
function ResponsiveBanner() {
  const { width, height } = useWindowSize();

  const isMobile = width > 0 && width < 768;

  return (
    <div>
      <p>Window Dimensions: {width}px x {height}px</p>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  );
}

```

### Key Features

* **SSR Safe:** Safely checks `typeof window !== "undefined"` to avoid `window is not defined` crashes during server-side rendering (Next.js, Remix, Gatsby).
* **Smooth Throttling (`requestAnimationFrame`):** Avoids thrashing the main thread during rapid resize events by syncing state updates with screen repaints.
* **Proper Cleanup:** Removes event listeners and cancels pending animation frames when the component unmounts.
Here are two production-ready approaches for `useWindowSize`. Option A uses **`useSyncExternalStore`** (the React 18+ standard for external browser state without layout tearing), and Option B adds **debouncing** for high-frequency layout computations.

---

### Option A: Concurrent-Safe with `useSyncExternalStore` (Recommended)

This approach ensures zero layout tearing in React 18+ concurrent mode and provides instant layout updates without unnecessary state synchronization cycles.

```jsx
import { useSyncExternalStore, useCallback } from "react";

const SERVER_FALLBACK = { width: 0, height: 0 };

/**
 * Custom hook to subscribe to window dimensions in real time.
 * Uses useSyncExternalStore for concurrent safety and zero layout tearing.
 *
 * @param {Object} [serverFallback={ width: 0, height: 0 }] - Dimensions returned during SSR.
 * @returns {{ width: number, height: number }} Current window width and height.
 */
export function useWindowSize(serverFallback = SERVER_FALLBACK) {
  // Subscribe to window resize events
  const subscribe = useCallback((callback) => {
    if (typeof window === "undefined") {
      return () => {};
    }

    window.addEventListener("resize", callback, { passive: true });

    return () => {
      window.removeEventListener("resize", callback);
    };
  }, []);

  // Read current snapshot on client
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") {
      return serverFallback;
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }, [serverFallback]);

  // Read snapshot on server (SSR / Static Generation)
  const getServerSnapshot = useCallback(
    () => serverFallback,
    [serverFallback]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

```

---

### Option B: Debounced Version (For Heavy Re-render Optimization)

If updating window dimensions triggers expensive computations or heavy re-renders (e.g., Canvas re-draws or complex chart re-layouts), use this debounced version:

```jsx
import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to track window dimensions with debouncing.
 *
 * @param {Object} [options] - Configuration options.
 * @param {number} [options.delay=150] - Debounce delay in milliseconds.
 * @param {Object} [options.initialSize={ width: 0, height: 0 }] - Initial fallback state for SSR.
 * @returns {{ width: number, height: number }} Current window dimensions.
 */
export function useDebouncingWindowSize(options = {}) {
  const { delay = 150, initialSize = { width: 0, height: 0 } } = options;

  const [windowSize, setWindowSize] = useState(() => {
    if (typeof window !== "undefined") {
      return { width: window.innerWidth, height: window.innerHeight };
    }
    return initialSize;
  });

  const timeoutRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, delay);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [delay]);

  return windowSize;
}

```

---

### Usage Examples

#### 1. Responsive Screen Orientation Guard (`useWindowSize`)

```jsx
function Dashboard() {
  const { width, height } = useWindowSize({ width: 1200, height: 800 });

  const isMobile = width < 768;

  return (
    <div>
      <p>Viewport: {width}px × {height}px</p>
      {isMobile ? <MobileNavigation /> : <DesktopSidebar />}
    </div>
  );
}

```

#### 2. Canvas Chart Re-render Optimization (`useDebouncingWindowSize`)

```jsx
function HeavyChartContainer() {
  // Debounces resize updates by 200ms to avoid re-calculating complex SVG/Canvas graphics mid-drag
  const { width } = useDebouncingWindowSize({ delay: 200 });

  return (
    <div style={{ width: "100%" }}>
      <ExpensiveDataChart chartWidth={width} />
    </div>
  );
}

```

---

### Key Features

* **Passive Event Listeners:** Attaches event listeners with `{ passive: true }` so window resize tracking never causes thread blocking or scroll stuttering.
* **SSR Hydration Safe:** Uses `getServerSnapshot` (Option A) or `typeof window !== "undefined"` guards (Option B) to prevent Next.js, Remix, or Gatsby client/server hydration mismatches.
* **Leak-Free Teardown:** Clears timers and removes global listeners properly when components unmount or configuration options change.
