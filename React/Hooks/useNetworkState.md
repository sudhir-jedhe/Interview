Here is a production-ready `useNetworkState` React hook that tracks detailed browser connection metrics using the Network Information API (`navigator.connection`) and `useSyncExternalStore` (React 18+).

It tracks metrics like effective connection type (`4g`, `3g`), round-trip time (`rtt`), downlink speed (`downlink`), and data-saver mode (`saveData`), while falling back gracefully on unsupported browsers.

```jsx
import { useSyncExternalStore, useCallback } from "react";

const DEFAULT_NETWORK_STATE = {
  online: true,
  since: undefined,
  effectiveType: undefined,
  downlink: undefined,
  downlinkMax: undefined,
  rtt: undefined,
  saveData: undefined,
  type: undefined,
};

/**
 * Safely extracts connection info from navigator.connection / navigator.mozConnection / navigator.webkitConnection
 */
function getNetworkConnection() {
  if (typeof navigator === "undefined") return null;
  return (
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection ||
    null
  );
}

/**
 * Custom hook to monitor network connectivity and detailed connection metrics (RTT, Downlink, Data-Saver).
 *
 * @param {Object} [serverFallback=DEFAULT_NETWORK_STATE] - Fallback state returned during SSR.
 * @returns {Object} Network state details.
 */
export function useNetworkState(serverFallback = DEFAULT_NETWORK_STATE) {
  // Subscribe to network online/offline and connection change events
  const subscribe = useCallback((callback) => {
    if (typeof window === "undefined") {
      return () => {};
    }

    window.addEventListener("online", callback);
    window.addEventListener("offline", callback);

    const connection = getNetworkConnection();
    if (connection) {
      connection.addEventListener("change", callback);
    }

    return () => {
      window.removeEventListener("online", callback);
      window.removeEventListener("offline", callback);
      if (connection) {
        connection.removeEventListener("change", callback);
      }
    };
  }, []);

  // Client snapshot reader
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return serverFallback;
    }

    const online = navigator.onLine;
    const connection = getNetworkConnection();

    return {
      online,
      since: online ? new Date() : undefined,
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink,
      downlinkMax: connection?.downlinkMax,
      rtt: connection?.rtt,
      saveData: connection?.saveData,
      type: connection?.type,
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

#### 1. Adaptive Quality Video / Image Preloading

```jsx
function AdaptiveMedia() {
  const { online, effectiveType, downlink, saveData } = useNetworkState();

  if (!online) {
    return <div>You are currently offline.</div>;
  }

  // Downgrade quality on slow networks (2g/3g) or when Data-Saver mode is enabled
  const isSlowConnection =
    saveData || effectiveType === "2g" || effectiveType === "slow-2g" || (downlink && downlink < 1.5);

  return (
    <div>
      <h3>Connection Profile</h3>
      <p>Effective Type: {effectiveType ?? "Unknown"}</p>
      <p>Estimated Speed: {downlink ? `${downlink} Mbps` : "N/A"}</p>

      {isSlowConnection ? (
        <img src="/images/hero-lowres.jpg" alt="Low resolution banner" />
      ) : (
        <img src="/images/hero-4k.jpg" alt="High resolution banner" />
      )}
    </div>
  );
}

```

#### 2. Network Performance Monitor Widget

```jsx
function NetworkMetricsCard() {
  const { online, rtt, downlink, effectiveType, saveData } = useNetworkState();

  return (
    <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h4>Network Health</h4>
      <ul>
        <li>Status: <strong>{online ? "Online🟢" : "Offline🔴"}</strong></li>
        <li>Effective Connection: <strong>{effectiveType?.toUpperCase() ?? "N/A"}</strong></li>
        <li>Round Trip Time (RTT): <strong>{rtt !== undefined ? `${rtt} ms` : "N/A"}</strong></li>
        <li>Downlink Bandwidth: <strong>{downlink !== undefined ? `${downlink} Mbps` : "N/A"}</strong></li>
        <li>Data Saver Mode: <strong>{saveData ? "Enabled" : "Disabled"}</strong></li>
      </ul>
    </div>
  );
}

```

---

### Key Features

* **React 18 Concurrent-Safe:** Uses `useSyncExternalStore` for immediate, tearing-free updates across concurrent state renders.
* **Network Information API Metrics:** Captures `rtt` (Round-Trip Time latency in ms), `downlink` (bandwidth estimate in Mbps), `effectiveType` (`4g`, `3g`, `2g`, `slow-2g`), and `saveData` boolean flag.
* **SSR Hydration Safe:** Accepts a configurable `serverFallback` to prevent client-server hydration mismatch issues in Next.js or Remix.
* **Cross-Browser Safe:** Handles browser vendor prefixes (`mozConnection`, `webkitConnection`) and falls back cleanly on browsers that lack Network Information API support (e.g. Safari).
