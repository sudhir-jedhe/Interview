Here is a production-ready `useLocalStorageWithTTL` React hook. It wraps values in a metadata structure containing an expiration timestamp (`expiry`), automatically clears and ignores expired items on read, syncs changes across browser tabs/components, and provides manual expiry controls.

```jsx
import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook for localStorage state with Time-To-Live (TTL) expiration support.
 *
 * @param {string} key - The localStorage key.
 * @param {any} initialValue - Default value if key doesn't exist or has expired.
 * @param {number|null} [ttlMs=null] - Time-To-Live in milliseconds (e.g. 1000 * 60 * 60 for 1 hour). Pass null for infinite.
 */
export function useLocalStorageWithTTL(key, initialValue, ttlMs = null) {
  // Store initialValue and ttlMs in refs to avoid re-runs when unmemoized objects/numbers are passed
  const initialValueRef = useRef(initialValue);
  const ttlMsRef = useRef(ttlMs);

  useEffect(() => {
    initialValueRef.current = initialValue;
    ttlMsRef.current = ttlMs;
  });

  // Helper function to resolve default initial value
  const getInitialFallback = useCallback(() => {
    return typeof initialValueRef.current === "function"
      ? initialValueRef.current()
      : initialValueRef.current;
  }, []);

  // Safely read and validate value (and check TTL) from localStorage
  const readValue = useCallback(() => {
    if (typeof window === "undefined") {
      return getInitialFallback();
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        const parsed = JSON.parse(item);

        // Check if stored item follows { value, expiry } shape
        if (parsed && typeof parsed === "object" && "expiry" in parsed) {
          const now = Date.now();

          // If expired, clean up storage and return initial fallback
          if (parsed.expiry !== null && now > parsed.expiry) {
            window.localStorage.removeItem(key);
            return getInitialFallback();
          }

          return parsed.value;
        }

        // Return direct parsed value if no expiry metadata envelope exists
        return parsed;
      }

      return getInitialFallback();
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return getInitialFallback();
    }
  }, [key, getInitialFallback]);

  const [storedValue, setStoredValue] = useState(readValue);

  // Set value with optional override TTL or global TTL
  const setValue = useCallback(
    (value, customTtlMs) => {
      if (typeof window === "undefined") {
        console.warn(
          `Tried setting localStorage key "${key}" even though window is not defined`
        );
        return;
      }

      try {
        setStoredValue((currentValue) => {
          const newValue =
            typeof value === "function" ? value(currentValue) : value;

          const effectiveTtl =
            customTtlMs !== undefined ? customTtlMs : ttlMsRef.current;

          const expiry =
            effectiveTtl !== null && effectiveTtl > 0
              ? Date.now() + effectiveTtl
              : null;

          const itemToStore = {
            value: newValue,
            expiry,
          };

          window.localStorage.setItem(key, JSON.stringify(itemToStore));

          // Dispatch custom event to sync within the SAME tab across instances
          window.dispatchEvent(
            new CustomEvent("local-storage-ttl", {
              detail: { key, newValue, expiry },
            })
          );

          return newValue;
        });
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  // Clear value manually
  const removeItem = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.removeItem(key);
      setStoredValue(getInitialFallback());

      window.dispatchEvent(
        new CustomEvent("local-storage-ttl", {
          detail: { key, newValue: getInitialFallback(), expiry: null },
        })
      );
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, getInitialFallback]);

  // Synchronize state across browser tabs & same-tab instances
  useEffect(() => {
    // Sync state post-mount to prevent SSR hydration mismatch
    setStoredValue(readValue());

    const handleStorageChange = (event) => {
      // Native window 'storage' event (fires across different tabs)
      if (event instanceof StorageEvent) {
        if (event.key !== key || event.storageArea !== window.localStorage) return;
        setStoredValue(readValue());
      }
      // Custom event (fires within the same tab)
      else if (event.detail && event.detail.key === key) {
        setStoredValue(event.detail.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage-ttl", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage-ttl", handleStorageChange);
    };
  }, [key, readValue]);

  return [storedValue, setValue, removeItem];
}

```

---

### Usage Examples

#### 1. Caching Auth Token or User Session (1 Hour Expiry)

```jsx
const ONE_HOUR = 1000 * 60 * 60;

function AuthStatus() {
  const [token, setToken, clearToken] = useLocalStorageWithTTL(
    "auth_token",
    null,
    ONE_HOUR
  );

  const login = () => {
    // Sets token with default 1-hour TTL
    setToken("secret_jwt_token_xyz");
  };

  return (
    <div>
      {token ? (
        <div>
          <p>Logged in! Token expires in 1 hour.</p>
          <button onClick={clearToken}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
}

```

#### 2. Temporary Banner Dismissal with Custom Overrides

```jsx
const ONE_DAY = 1000 * 60 * 60 * 24;

function PromoBanner() {
  const [isDismissed, setIsDismissed] = useLocalStorageWithTTL(
    "banner_dismissed",
    false
  );

  const handleDismissForAWeek = () => {
    const SEVEN_DAYS = ONE_DAY * 7;
    // Override the TTL dynamically on write
    setIsDismissed(true, SEVEN_DAYS);
  };

  if (isDismissed) return null;

  return (
    <div className="banner">
      <p>Special Offer! Get 20% off today.</p>
      <button onClick={handleDismissForAWeek}>Dismiss for 7 Days</button>
    </div>
  );
}

```

---

### Key Features

* **Time-To-Live Envelope:** Automatically wraps values in `{ value, expiry }`. If the item is read past its `expiry` timestamp, it is automatically removed from `localStorage` and falls back to `initialValue`.
* **Dynamic TTL Overrides:** `setValue(val, customTtlMs)` allows setting custom expiration windows per call.
* **Multi-Tab & Same-Tab Synchronization:** Listens to both native `storage` events (cross-tab) and custom `local-storage-ttl` events (same-tab) to keep all UI instances synchronized.
* **SSR Safe & Hydration Friendly:** Post-mount evaluation avoids hydration mismatch errors in SSR frameworks like Next.js or Remix.
* **Explicit `removeItem` Handler:** Returns `[value, setValue, removeItem]` for quick manual clearing.
