Here is a production-ready `useOrientation` React hook that tracks device screen orientation (portrait vs. landscape, exact angle) using `screen.orientation` and `useSyncExternalStore` (React 18+) for concurrent safety and zero layout tearing.

```jsx
import { useSyncExternalStore, useCallback } from "react";

const DEFAULT_ORIENTATION = {
  angle: 0,
  type: "portrait-primary",
  isPortrait: true,
  isLandscape: false,
};

/**
 * Custom hook to subscribe to screen orientation changes.
 *
 * @param {Object} [serverFallback=DEFAULT_ORIENTATION] - Fallback orientation object for SSR environments.
 * @returns {Object} { angle, type, isPortrait, isLandscape }
 */
export function useOrientation(serverFallback = DEFAULT_ORIENTATION) {
  // Subscribe to screen.orientation change events
  const subscribe = useCallback((callback) => {
    if (
      typeof window === "undefined" ||
      !window.screen ||
      !window.screen.orientation
    ) {
      return () => {};
    }

    const orientation = window.screen.orientation;
    orientation.addEventListener("change", callback);

    return () => {
      orientation.removeEventListener("change", callback);
    };
  }, []);

  // Client snapshot reader
  const getSnapshot = useCallback(() => {
    if (
      typeof window === "undefined" ||
      !window.screen ||
      !window.screen.orientation
    ) {
      return serverFallback;
    }

    const { angle, type } = window.screen.orientation;
    const isPortrait = type.startsWith("portrait");

    return {
      angle: angle || 0,
      type: type || "portrait-primary",
      isPortrait,
      isLandscape: !isPortrait,
    };
  }, [serverFallback]);

  // Server snapshot reader
  const getServerSnapshot = useCallback(
    () => serverFallback,
    [serverFallback]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

```

---

### Usage Examples

#### 1. Adaptive Video Player / Media Layout

```jsx
function VideoPlayer() {
  const { isLandscape, angle, type } = useOrientation();

  return (
    <div
      style={{
        width: "100%",
        height: isLandscape ? "100vh" : "auto",
        backgroundColor: "#000",
      }}
    >
      <video src="/stream.mp4" controls style={{ width: "100%" }} />
      <p style={{ color: "#fff", padding: "10px" }}>
        Orientation: {type} ({angle}°)
      </p>
    </div>
  );
}

```

#### 2. Mobile Fullscreen Mode Notice

```jsx
function GameCanvas() {
  const { isPortrait } = useOrientation();

  if (isPortrait) {
    return (
      <div className="rotate-device-banner">
        <h2>Please rotate your device to landscape to play</h2>
      </div>
    );
  }

  return <canvas id="game-stage" width={1280} height={720} />;
}

```

---

### Key Features

* **React 18 Concurrent-Safe:** Uses `useSyncExternalStore` to ensure orientation state updates cleanly without layout tearing or synchronization glitches across concurrent renders.
* **Modern `ScreenOrientation` API:** Uses `screen.orientation` (`type` and `angle`) rather than deprecated `window.orientation` or `window.onorientationchange`.
* **Convenience Booleans:** Exposes pre-computed `isPortrait` and `isLandscape` flags alongside exact angles ($0^\circ, 90^\circ, 180^\circ, 270^\circ$).
* **SSR Safe:** Accepts a `serverFallback` default to prevent client-server hydration mismatch errors during SSR (Next.js, Remix, Gatsby).
