```js
window.myLocalStorage = {
  getItem(key) {
    // get the parsed value of the given key
    let result = JSON.parse(window.localStorage.getItem(key));

    // if the key has value
    if (result) {
      // if the entry is expired
      // remove the entry and return null
      if (result.expireTime <= Date.now()) {
        window.localStorage.removeItem(key);
        return null;
      }

      // else return the value
      return result.data;
    }

    // if the key does not have value
    return null;
  },

  // add an entry
  // default expiry is 30 days in milliseconds
  setItem(key, value, maxAge = 30 * 60 * 60 * 1000) {
    // store the value as object
    // along with expiry date
    let result = {
      data: value,
    };

    if (maxAge) {
      // set the expiry
      // from the current date
      result.expireTime = Date.now() + maxAge;
    }

    // stringify the result
    // and the data in original storage
    window.localStorage.setItem(key, JSON.stringify(result));
  },

  // remove the entry with the given key
  removeItem(key) {
    window.localStorage.removeItem(key);
  },

  // clear the storage
  clear() {
    window.localStorage.clear();
  },
};

Input: myLocalStorage.setItem("foo", "bar", 1000);

setTimeout(() => {
  console.log(myLocalStorage.getItem("foo"));
}, 1500);

Output: null;
```

Here is a simple, lightweight wrapper around `localStorage` that adds **time-to-live (TTL) expiration** support in JavaScript.

Since native `localStorage` has no built-in expiration mechanism, this pattern stores a JSON object containing both your `value` and an `expiry` timestamp (`Date.now() + ttlInMs`).

---

### Implementation Code

```javascript
const storageWithExpiry = {
  /**
   * Set an item in localStorage with an expiration time
   * @param {string} key
   * @param {any} value
   * @param {number} ttlInMs Time to live in milliseconds
   */
  setItem(key, value, ttlInMs) {
    const now = new Date();

    const item = {
      value: value,
      expiry: now.getTime() + ttlInMs, // Expiration timestamp in ms
    };

    localStorage.setItem(key, JSON.stringify(item));
  },

  /**
   * Get an item from localStorage. Returns null if missing or expired.
   * @param {string} key
   * @returns {any|null}
   */
  getItem(key) {
    const itemStr = localStorage.getItem(key);

    // If the item doesn't exist, return null
    if (!itemStr) {
      return null;
    }

    try {
      const item = JSON.parse(itemStr);
      const now = new Date();

      // Check if the item has expired
      if (now.getTime() > item.expiry) {
        // Item is expired -> remove it from storage and return null
        localStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (e) {
      // In case the stored value wasn't JSON-parsed properly
      return null;
    }
  },

  /**
   * Remove an item from localStorage
   * @param {string} key
   */
  removeItem(key) {
    localStorage.removeItem(key);
  },

  /**
   * Clear expired items from localStorage to free up space
   */
  clearExpired() {
    const now = new Date().getTime();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        const item = JSON.parse(localStorage.getItem(key));
        if (item && item.expiry && now > item.expiry) {
          localStorage.removeItem(key);
        }
      } catch (e) {
        // Skip non-JSON or unmanaged items
      }
    }
  },
};
```

---

### How to Use

```javascript
// Store user profile for 1 hour (3,600,000 milliseconds)
const ONE_HOUR = 60 * 60 * 1000;

storageWithExpiry.setItem(
  "user_profile",
  { name: "Sudhir", role: "Developer" },
  ONE_HOUR,
);

// Retrieve item immediately (Valid)
console.log(storageWithExpiry.getItem("user_profile"));
// Output: { name: "Sudhir", role: "Developer" }

// After 1 hour has passed:
console.log(storageWithExpiry.getItem("user_profile"));
// Output: null (Automatically deleted from storage!)
```

---

### Proactive Cleanup (Optional)

Lazy deletion happens when you call `getItem()`. If an item is stored and never read again, it will linger in `localStorage`.

You can run `storageWithExpiry.clearExpired()` on app initialization (e.g., in your React `useEffect` or main JS entrypoint) to clean up stale data:

```javascript
// Clean up all expired keys when app loads
window.addEventListener("DOMContentLoaded", () => {
  storageWithExpiry.clearExpired();
});
```

Here is how you can turn that `localStorage` with expiry logic into a reusable custom React hook: **`useLocalStorageWithExpiry`**.

This hook behaves just like React's standard `useState`, but seamlessly syncs with `localStorage` and automatically handles time-to-live (TTL) expiration on initialization.

---

### Custom Hook Implementation

```typescript
import { useState, useEffect, useCallback } from "react";

interface StorageItem<T> {
  value: T;
  expiry: number;
}

/**
 * Custom React hook for localStorage with TTL expiration
 *
 * @param key - The localStorage key
 * @param initialValue - Default value if key doesn't exist or is expired
 * @param ttlInMs - Time-To-Live in milliseconds
 */
export function useLocalStorageWithExpiry<T>(
  key: string,
  initialValue: T | (() => T),
  ttlInMs: number,
) {
  // Helper to read and validate the item from localStorage
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") {
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue;
    }

    try {
      const itemStr = window.localStorage.getItem(key);
      if (!itemStr) {
        return typeof initialValue === "function"
          ? (initialValue as () => T)()
          : initialValue;
      }

      const item: StorageItem<T> = JSON.parse(itemStr);
      const now = Date.now();

      // Check if item has expired
      if (now > item.expiry) {
        window.localStorage.removeItem(key);
        return typeof initialValue === "function"
          ? (initialValue as () => T)()
          : initialValue;
      }

      return item.value;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue;
    }
  }, [key, initialValue]);

  // Initialize state with stored or initial value
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that updates localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      if (typeof window === "undefined") {
        console.warn(
          `Tried setting localStorage key "${key}" even though window is not defined.`,
        );
        return;
      }

      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Create storage item object with expiration timestamp
        const item: StorageItem<T> = {
          value: valueToStore,
          expiry: Date.now() + ttlInMs,
        };

        // Save state and localStorage
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(item));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, ttlInMs, storedValue],
  );

  // Helper function to remove item manually
  const removeItem = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      const resetValue =
        typeof initialValue === "function"
          ? (initialValue as () => T)()
          : initialValue;
      setStoredValue(resetValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Sync across tabs if another window updates localStorage
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        setStoredValue(readValue());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, readValue]);

  return [storedValue, setValue, removeItem] as const;
}
```

---

### Usage Example

```tsx
import React from "react";
import { useLocalStorageWithExpiry } from "./useLocalStorageWithExpiry";

const ONE_HOUR = 60 * 60 * 1000;

export const UserBanner: React.FC = () => {
  // Store "userPreferences" with a 1-hour expiration
  const [preferences, setPreferences, clearPreferences] =
    useLocalStorageWithExpiry(
      "userPreferences",
      { theme: "light", dismissBanner: false },
      ONE_HOUR,
    );

  const handleDismiss = () => {
    setPreferences((prev) => ({ ...prev, dismissBanner: true }));
  };

  if (preferences.dismissBanner) {
    return (
      <div>
        <p>Banner dismissed! (Will reappear after 1 hour or if cleared)</p>
        <button onClick={clearPreferences}>Reset Banner</button>
      </div>
    );
  }

  return (
    <div
      style={{ padding: "12px", background: "#e2e8f0", borderRadius: "6px" }}
    >
      <p>Welcome! Check out our new features.</p>
      <button onClick={handleDismiss}>Dismiss for 1 hour</button>
    </div>
  );
};
```

---

### Key Features of this Hook

1. **State & Storage Sync**: Updating state with `setPreferences()` instantly persists the item with a freshly computed `expiry` timestamp.
2. **Cross-Tab Synchronization**: Listens to native `storage` events so changes made in one browser tab automatically update state in other open tabs.
3. **SSR Safety**: Safely handles Next.js / SSR rehydration by verifying `typeof window !== 'undefined'` before accessing browser storage.
4. **Supports Functional Updates**: Works seamlessly with updater callbacks (e.g., `setValue(prev => prev + 1)`).

When caching large amounts of data on the client side, choosing between **`localStorage`** and **`IndexedDB`** comes down to **performance, storage limits, and API complexity**.

Here is a detailed breakdown of the trade-offs between the two storage options.

---

## Quick Comparison Matrix

| Feature                | `localStorage`                                             | `IndexedDB`                                            |
| ---------------------- | ---------------------------------------------------------- | ------------------------------------------------------ |
| **API Type**           | Synchronous, Blocking                                      | Asynchronous (Event/Promise-driven)                    |
| **Data Types**         | Strings only (Requires `JSON.stringify`)                   | Native JS objects, Files, Blobs, ArrayBuffers          |
| **Storage Capacity**   | ~5 MB per origin                                           | ~50% of available disk space (Hundreds of GBs)         |
| **Performance**        | Fast for small keys, **Blocks main thread** for large JSON | High performance, non-blocking asynchronous operations |
| **Query Capabilities** | Key-Value pairs only                                       | Indexes, Key Ranges, Cursor-based queries              |
| **Transactions**       | No transactional support                                   | Full ACID transaction support                          |

---

## 1. Storage Capacity & Data Limits

### `localStorage` (Severe Constraints)

- Limited to **5 MB per origin** in almost all modern browsers.
- Storing large JSON objects will quickly trigger a `QuotaExceededError`.
- **String Overhead:** Because `localStorage` only supports strings, complex objects must be converted with `JSON.stringify()`, which inflates data size by 20–50% due to JSON key duplication and escaping.

### `IndexedDB` (Generous Quotas)

- Can store **hundreds of megabytes to gigabytes** of data.
- Chrome and Edge allow origins to use up to **60% of available disk space**; Firefox allows up to **50%**.
- Native object support means you can store raw `File` objects, `Blob` instances, images, and typed arrays (`Uint8Array`) directly without serializing to strings.

---

## 2. Performance & Thread Blocking

### `localStorage` (Main-Thread Blocker)

- **Synchronous Execution:** Every read (`getItem`) or write (`setItem`) blocks the main JavaScript thread.
- If you read or write a 2 MB JSON string, the UI will freeze, resulting in skipped frames, laggy animations, and delayed user input handling.

### `IndexedDB` (Asynchronous & Non-Blocking)

- **Non-blocking Operations:** Reads and writes execute asynchronously via Web IDL background threads, leaving the UI thread smooth and responsive.
- Works seamlessly inside **Web Workers** and **Service Workers**, making it ideal for offline-first caching strategies (like Progressive Web Apps).

---

## 3. Querying & Search Capabilities

### `localStorage`

- Basic key-value lookup only.
- If you need to search or filter cached data (e.g., finding all cached resumes updated after a certain date), you must load the entire string into memory, parse it, and loop over it in JavaScript.

### `IndexedDB`

- Supports **Indexes** on object properties.
- You can query specific fields using range filters (`IDBKeyRange`) without loading the entire dataset into memory.
- Example: Finding 10 items out of 50,000 cached records takes milliseconds via an IndexedDB Index, whereas `localStorage` would require parsing all 50,000 items in memory first.

---

## 4. API Complexity & Learning Curve

### `localStorage` (Dead Simple)

```javascript
// Reading and writing takes 1 line of code
localStorage.setItem("user", JSON.stringify({ name: "Sudhir" }));
const user = JSON.parse(localStorage.getItem("user"));
```

### `IndexedDB` (Verbose Native API)

The native IndexedDB API uses an older event-based callback model that is notoriously verbose:

```javascript
// Native IndexedDB boilerplate
const request = indexedDB.open("MyDatabase", 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore("users", { keyPath: "id" });
};

request.onsuccess = (event) => {
  const db = event.target.result;
  const transaction = db.transaction(["users"], "readwrite");
  const store = transaction.objectStore("users");
  store.add({ id: 1, name: "Sudhir" });
};
```

> **Pro Tip:** To overcome IndexedDB's verbosity, developers almost universally use Promise-based wrapper libraries like **`idb`** (by Jake Archibald), **`Dexie.js`**, or **`localForage`**.

---

## Recommended Abstraction: `localForage`

If you want the **simple key-value API of `localStorage**`combined with the**asynchronous performance and high capacity of`IndexedDB\*\*`, use [`localForage`](https://github.com/localForage/localForage).

`localForage` automatically uses IndexedDB in modern browsers, falls back to WebSQL or `localStorage` when unavailable, and uses a clean Promise API:

```javascript
import localforage from "localforage";

// Stores natively in IndexedDB without blocking the thread!
await localforage.setItem("large_dataset", arrayOfThousandsOfItems);

// Retrieves asynchronously
const data = await localforage.getItem("large_dataset");
```

---

## Decision Summary

- Use **`localStorage`** ONLY for small, non-sensitive string key-value configurations under ~100 KB (e.g., `theme: "dark"`, UI state flags, language preferences).
- Use **`IndexedDB`** for all large datasets, API response caching, offline app data, media files, or anything requiring querying or background worker access.

Here is a utility implementation for **`localStorage` (or `sessionStorage`) with an expiration time** in JavaScript. This allows you to store data that automatically expires and returns `null` or a default value once the TTL (Time-To-Live) has passed.

---

### Implementation (`storageWithExpiry.js`)

```javascript
const StorageWithExpiry = {
  /**
   * Set an item in localStorage with an expiration time.
   * @param {string} key - The key for the storage item.
   * @param {any} value - The value to store (will be JSON stringified).
   * @param {number} ttlMinutes - Time-to-live in minutes.
   */
  setItem(key, value, ttlMinutes) {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttlMinutes * 60 * 1000, // Convert minutes to milliseconds
    };
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  },

  /**
   * Get an item from localStorage, validating its expiration.
   * @param {string} key - The key for the storage item.
   * @returns {any|null} The stored value, or null if expired/non-existent.
   */
  getItem(key) {
    const itemStr = localStorage.getItem(key);
    
    // If the item doesn't exist, return null
    if (!itemStr) {
      return null;
    }

    try {
      const item = JSON.parse(itemStr);
      const now = new Date();

      // Compare current time with the expiry time
      if (now.getTime() > item.expiry) {
        // Expired: remove the item from storage and return null
        localStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return null;
    }
  },

  /**
   * Remove an item from localStorage.
   * @param {string} key - The key for the storage item.
   */
  removeItem(key) {
    localStorage.removeItem(key);
  }
};

export default StorageWithExpiry;

```

---

### Example Usage

```javascript
// 1. Store data that expires in 5 minutes
StorageWithExpiry.setItem('user_session', { userId: 42, role: 'admin' }, 5);

// 2. Retrieve the data (returns the object if valid, or null if expired)
const sessionData = StorageWithExpiry.getItem('user_session');

if (sessionData) {
  console.log('Active session:', sessionData);
} else {
  console.log('Session expired or not found.');
}

```

---

### Key Features

- **Automatic Cleanup:** If a user requests an expired item, it is automatically purged from `localStorage` on the spot.
- **JSON Serialization:** Safely handles complex data types like objects and arrays.
- **Framework Agnostic:** Works seamlessly in vanilla JavaScript, React, Vue, or Angular. *(Note: Swap `localStorage` for `sessionStorage` inside the utility if you want session-only persistence).*
