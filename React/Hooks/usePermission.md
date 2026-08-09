Here is a production-ready `usePermission` React hook that queries permission status (`granted`, `denied`, `prompt`) for browser features (such as `geolocation`, `camera`, `notifications`, `clipboard-read`, etc.) using the native `navigator.permissions` API.

It listens for status updates when a user modifies permissions in their browser settings and handles compatibility gracefully.

```jsx
import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook to query and subscribe to browser permission status using the Permissions API.
 *
 * @param {PermissionDescriptor|string} permissionDesc - Permission descriptor object (e.g. { name: 'geolocation' }) or string name.
 * @returns {Object} { state, isSupported, isLoading, error }
 */
export function usePermission(permissionDesc) {
  const [permissionState, setPermissionState] = useState({
    state: "prompt", // 'granted' | 'denied' | 'prompt'
    isSupported: true,
    isLoading: true,
    error: null,
  });

  // Store descriptor in ref to stabilize comparisons across re-renders
  const descriptorRef = useRef(permissionDesc);
  useEffect(() => {
    descriptorRef.current = permissionDesc;
  }, [permissionDesc]);

  const queryPermission = useCallback(async () => {
    if (
      typeof window === "undefined" ||
      typeof navigator === "undefined" ||
      !navigator.permissions ||
      !navigator.permissions.query
    ) {
      setPermissionState({
        state: "prompt",
        isSupported: false,
        isLoading: false,
        error: null,
      });
      return;
    }

    const descriptor =
      typeof descriptorRef.current === "string"
        ? { name: descriptorRef.current }
        : descriptorRef.current;

    if (!descriptor || !descriptor.name) {
      setPermissionState({
        state: "prompt",
        isSupported: false,
        isLoading: false,
        error: new Error("Invalid permission descriptor provided."),
      });
      return;
    }

    try {
      const status = await navigator.permissions.query(descriptor);

      setPermissionState({
        state: status.state,
        isSupported: true,
        isLoading: false,
        error: null,
      });

      const handleChange = () => {
        setPermissionState((prev) => ({
          ...prev,
          state: status.state,
        }));
      };

      // Subscribe to permission changes (e.g., user toggles settings in address bar)
      if ("addEventListener" in status) {
        status.addEventListener("change", handleChange);
      } else {
        status.onchange = handleChange;
      }

      return () => {
        if ("removeEventListener" in status) {
          status.removeEventListener("change", handleChange);
        } else {
          status.onchange = null;
        }
      };
    } catch (err) {
      // Browsers throw TypeError for unsupported feature names (e.g., 'camera' in Firefox)
      setPermissionState({
        state: "prompt",
        isSupported: false,
        isLoading: false,
        error: err,
      });
    }
  }, []);

  useEffect(() => {
    let cleanupFn;

    queryPermission().then((cleanup) => {
      cleanupFn = cleanup;
    });

    return () => {
      if (cleanupFn) {
        cleanupFn();
      }
    };
  }, [queryPermission]);

  return permissionState;
}

```

---

### Usage Examples

#### 1. Geolocation Access Guard

```jsx
function GeolocationWidget() {
  const { state: geoPermission, isSupported, isLoading } = usePermission("geolocation");

  if (!isSupported) {
    return <div>Permissions API is not supported in this browser.</div>;
  }

  if (isLoading) {
    return <div>Checking permission status...</div>;
  }

  return (
    <div>
      <h3>Location Access</h3>
      {geoPermission === "granted" && <p style={{ color: "green" }}>✅ Location access granted!</p>}
      {geoPermission === "prompt" && <p style={{ color: "orange" }}>⚠️ Location permission will prompt on request.</p>}
      {geoPermission === "denied" && (
        <p style={{ color: "red" }}>
          ❌ Location access is blocked. Please enable it in browser settings.
        </p>
      )}
    </div>
  );
}

```

#### 2. Clipboard Access Control

```jsx
function PasteButton({ onPaste }) {
  const { state, isSupported } = usePermission({ name: "clipboard-read" });

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onPaste(text);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  return (
    <button onClick={handlePaste} disabled={isSupported && state === "denied"}>
      {state === "denied" ? "Clipboard Blocked" : "Paste from Clipboard"}
    </button>
  );
}

```

---

### Key Features

* **Flexible Descriptors:** Accepts either a string shorthand (`"geolocation"`, `"notifications"`) or full descriptor object (`{ name: "microphone" }`).
* **Real-Time Status Synchronization:** Listens to `PermissionStatus.onchange` so state immediately reflects user changes in browser settings or address bar site toggles.
* **Feature & Browser Safety:** Catches unsupported feature queries (e.g. `camera` or `microphone` which vary across Firefox/Safari) and sets `isSupported: false` instead of breaking.
* **SSR Safe:** Guards against missing `window` or `navigator` instances during server rendering.
