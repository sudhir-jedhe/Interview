Here is a production-ready `useOnlineStatus` hook built using `useSyncExternalStore` (React 18+). It provides real-time monitoring of browser online/offline status, zero layout tearing in concurrent mode, and full SSR hydration safety.

```jsx
import { useSyncExternalStore, useCallback } from "react";

/**
 * Custom hook to track real-time network connectivity status.
 * Uses useSyncExternalStore for concurrent-safe updates and SSR compatibility.
 *
 * @param {boolean} [serverFallback=true] - Fallback online status returned during SSR.
 * @returns {boolean} True if online, false if offline.
 */
export function useOnlineStatus(serverFallback = true) {
  // Subscribe to online/offline window events
  const subscribe = useCallback((callback) => {
    if (typeof window === "undefined") {
      return () => {};
    }

    window.addEventListener("online", callback);
    window.addEventListener("offline", callback);

    return () => {
      window.removeEventListener("online", callback);
      window.removeEventListener("offline", callback);
    };
  }, []);

  // Client snapshot reader
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return serverFallback;
    }
    return navigator.onLine;
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

#### 1. Network Status Banner

```jsx
function NetworkBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      style={{
        backgroundColor: "#ff4d4f",
        color: "#ffffff",
        padding: "8px 16px",
        textAlign: "center",
        fontWeight: "bold",
      }}
    >
      ⚠️ You are currently offline. Changes will sync when reconnected.
    </div>
  );
}

```

#### 2. Disabling Action Buttons When Offline

```jsx
function SubmitForm() {
  const isOnline = useOnlineStatus();

  return (
    <form>
      <input type="text" placeholder="Type something..." />
      <button type="submit" disabled={!isOnline}>
        {isOnline ? "Submit" : "Offline"}
      </button>
    </form>
  );
}

```

---

### Key Features

* **React 18 Concurrent-Safe:** Uses `useSyncExternalStore` to prevent state tearing and ensure instant synchronization across all mounted components when network status changes.
* **SSR Hydration Safe:** Accepts `serverFallback` (defaulting to `true` to match standard web server assumptions) to prevent hydration mismatches in Next.js, Remix, or Gatsby.
* **Zero Event Thrashing:** Efficiently listens only to native browser `online` and `offline` DOM events without polling loops or background network requests.
* **Leak-Free Event Cleanup:** Properly detaches `window` listeners when components unmount.
