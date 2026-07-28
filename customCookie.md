The code you're providing implements a custom cookie-like system using JavaScript. It allows setting, getting, and managing "cookies" (stored in memory) with expiration handling. Below is an explanation of how both implementations (`useCustomCookie` and `install`) work and how they manage cookie-like behavior:

### First Implementation: `useCustomCookie`

This implementation uses a `Map` to store cookie-like key-value pairs with expiration handling.

- **`store`**: A `Map` to store cookies where the key is the cookie name and the value is an object that contains the cookie value and expiration timestamp.
- **`Object.defineProperty`**: This defines a custom property `myCookie` on the `document` object that mimics the behavior of cookies.
  - **Getter**: Returns a string of all cookies that haven't expired. It checks if any cookies have expired based on the current time, and deletes them if they have.
  - **Setter**: Parses a cookie string and stores it in the `store`. It handles the `max-age` option to set the expiration time for cookies.

### Code Breakdown for `useCustomCookie`:

```javascript
function useCustomCookie() {
  // Map to store cookie key-value pairs along with expiration info
  const store = new Map();

  // Defining a getter and setter for document.myCookie
  Object.defineProperty(document, "myCookie", {
    configurable: true,

    // Getter for 'myCookie'
    get() {
      const cookies = [];
      const time = Date.now();

      // Loop through the stored cookies to filter expired ones
      for (const [name, { value, expires }] of store) {
        // If expired, remove it
        if (expires <= time) {
          store.delete(name);
        } else {
          // Otherwise, keep the cookie
          cookies.push(`${name}=${value}`);
        }
      }

      // Return all valid cookies as a single string
      return cookies.join("; ");
    },

    // Setter for 'myCookie'
    set(val) {
      const { key, value, options } = parseCookieString(val);

      // Default expiration time is Infinity if not provided
      let expires = Infinity;
      if (options["max-age"]) {
        expires = Date.now() + Number(options["max-age"]) * 1000;
      }

      // Store the cookie in the Map
      store.set(key, { value, expires });
    },
  });
}

function parseCookieString(val) {
  // Parse the cookie string into key, value, and options
  const [keyValuePair, ...optionsArr] = val.split(";");
  const [key, value] = keyValuePair.split("=");
  const options = {};

  optionsArr.forEach((option) => {
    const [optKey, optValue] = option.split("=");
    if (optKey && optValue) {
      options[optKey] = optValue;
    }
  });

  return { key, value, options };
}
```

### Explanation:

1. **`get`**:
   - The getter retrieves cookies and checks if any have expired.
   - It removes expired cookies and returns a formatted string of active cookies.
2. **`set`**:
   - The setter parses the input string to extract key, value, and options.
   - If the `max-age` option is provided, it calculates the expiration timestamp.
   - The cookie is stored in the `store` map.

### Example Usage:

```javascript
useCustomCookie();

// Setting cookies
document.myCookie = "blog=learnersbucket";
document.myCookie = "name=prashant;max-age=1";

// Checking cookies immediately
console.log(document.myCookie); // Output: blog=learnersbucket; name=prashant

// After 1.5 seconds (prashant cookie expires)
setTimeout(() => {
  console.log(document.myCookie); // Output: blog=learnersbucket
}, 1500);
```

In this example:

- `blog=learnersbucket` is set first and doesn't expire.
- `name=prashant` is set with a 1-second expiration, so it will expire after 1 second.

---

### Second Implementation: `install`

The `install` function is an alternative version that also provides similar functionality for setting, getting, and expiring cookies.

- **`store`**: A `Map` object is used to store cookies with an added `maxAge` for expiration.
- **`Object.defineProperty`**: This is used to define the getter and setter for `document.myCookie`, similar to the previous implementation.

- **Expiration Handling**: The `maxAge` is provided in seconds. Each time a cookie is accessed, it checks if the cookie has expired based on the current time.

### Code Breakdown for `install`:

```javascript
function install() {
  // Map to store cookies with expiration info
  const store = new Map();

  // Define getter and setter for 'myCookie' property on document
  Object.defineProperty(document, "myCookie", {
    get() {
      const result = [];
      for (let [key, entry] of store.entries()) {
        if (entry.maxAge !== undefined) {
          if (Date.now() - entry.createdAt >= entry.maxAge) {
            // Expired cookie, remove it
            store.delete(key);
            continue;
          }
        }
        // Add valid cookies to the result
        result.push(`${key}=${entry.value}`);
      }
      return result.join("; ");
    },

    set(valueStr) {
      const [keyValuePair, ...options] = valueStr.replace(/ /g, "").split(";");
      const [key, value] = keyValuePair.split("=");
      if (!key || !value) return;

      const entry = {
        value,
        createdAt: Date.now(),
      };

      options.forEach((option) => {
        const [optionKey, optionValue] = option.split("=");
        if (!optionKey || !optionValue) return;

        // If 'max-age' is provided, set the expiration time
        if (optionKey === "max-age") {
          const maxAge = parseInt(optionValue, 10);
          if (Number.isNaN(maxAge)) return;
          entry.maxAge = maxAge * 1000; // Convert max-age to milliseconds
        }
      });

      // Store the cookie
      store.set(key, entry);
    },

    configurable: true,
  });
}

// Uninstall 'myCookie' from document
function uninstall() {
  delete document.myCookie;
}
```

### Explanation:

1. **`get`**:
   - Retrieves all cookies and checks for expiration.
   - If expired, it removes the cookie from the `store`.
   - Returns all valid cookies in a semicolon-separated string.

2. **`set`**:
   - The setter parses the cookie string to extract the key, value, and options.
   - If `max-age` is specified, it calculates the expiration timestamp.
   - The cookie is stored with the key, value, and the expiration timestamp.

### Example Usage:

```javascript
install();

// Setting cookies
document.myCookie = "blog=learnersbucket";
document.myCookie = "name=prashant;max-age=1";

// Checking cookies immediately
console.log(document.myCookie); // Output: blog=learnersbucket; name=prashant

// After 1.5 seconds (prashant cookie expires)
setTimeout(() => {
  console.log(document.myCookie); // Output: blog=learnersbucket
}, 1500);

// Uninstall the custom cookie implementation
uninstall();
```

### Summary:

Both implementations provide custom handling for "cookies" in JavaScript, but there are slight differences in how they store and manage expiration:

- **`useCustomCookie`** stores the cookies with `expires` and removes them if they are expired during each access.
- **`install`** uses `max-age` and a `createdAt` timestamp to handle expiration.

Both can be used to simulate cookie storage and expiration in memory, useful for simple scenarios where you want to handle temporary data without actual browser cookies.

useCustomCookieHere's my take: To build a custom **`useCookie`** React hook, you wrap `document.cookie` in React component state so that changes re-render your components automatically.

---

### Production-Grade `useCookie` Hook

This hook provides a `[value, updateCookie, deleteCookie]` tuple, supporting expiration days, path scoping, and `SameSite` options.

```javascript
import { useState, useCallback } from "react";

// Helper to parse document.cookie string into a key-value pair
const getItem = (key) => {
  if (typeof document === "undefined") return null; // SSR Check

  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${key}=`))
      ?.split("=")[1] || null
  );
};

/**
 * Custom React Hook to read, update, and delete browser cookies.
 *
 * @param {string} key - The cookie name
 * @param {string} [initialValue=null] - Default fallback value if cookie isn't set
 * @returns {[string|null, Function, Function]} [cookieValue, setCookie, deleteCookie]
 */
export function useCookie(key, initialValue = null) {
  const [cookieValue, setCookieValue] = useState(() => {
    return getItem(key) ?? initialValue;
  });

  // Setter function to create or update the cookie
  const updateCookie = useCallback(
    (newValue, options = {}) => {
      const { days = 7, path = "/", sameSite = "Lax", secure = true } = options;

      // Calculate expiration date
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      const cookieOptions = `path=${path}; expires=${expires}; SameSite=${sameSite}${secure ? "; Secure" : ""}`;

      // Set cookie in browser
      document.cookie = `${key}=${encodeURIComponent(newValue)}; ${cookieOptions}`;

      // Update React state to trigger re-render
      setCookieValue(newValue);
    },
    [key],
  );

  // Function to delete the cookie by setting expiration in the past
  const deleteCookie = useCallback(
    (path = "/") => {
      document.cookie = `${key}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      setCookieValue(null);
    },
    [key],
  );

  return [cookieValue, updateCookie, deleteCookie];
}
```

---

### Example Usage in a React Component

```jsx
import React from "react";
import { useCookie } from "./useCookie";

function ThemePreference() {
  const [theme, setTheme, removeTheme] = useCookie("user_theme", "light");

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme, { days: 30, sameSite: "Lax" });
  };

  return (
    <div style={{ padding: "20px" }}>
      <p>
        Current Theme Cookie: <strong>{theme}</strong>
      </p>

      <button onClick={toggleTheme}>
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button>

      <button onClick={() => removeTheme()} style={{ marginLeft: "10px" }}>
        Reset Preference
      </button>
    </div>
  );
}

export default ThemePreference;
```

---

### Key Features Included

1. **SSR-Safe:** Guards against `document is not defined` errors during Next.js or Remix server-side rendering.
2. **Memoized Handlers:** Uses `useCallback` to maintain reference stability for `setCookie` and `deleteCookie`.
3. **Security Defaults:** Sets `SameSite=Lax` and `Secure` flags by default to guard against basic CSRF vulnerabilities.

How do you synchronize custom hook states across multiple browser tabs in React?

How do you synchronize custom hook states across multiple browser tabs in React? Here's my take: To synchronize state across multiple browser tabs in React, you need a mechanism that broadcasts state updates across browsing contexts under the same origin.

The two best tools for this are the **`BroadcastChannel` API** (ideal for general state synchronization) and the **`storage` event** (ideal for persisting and syncing `localStorage`).

---

### Option 1: The `BroadcastChannel` API (Recommended)

`BroadcastChannel` allows open tabs, windows, or iframes on the same origin to send and receive messages asynchronously via `postMessage()`.

#### Custom `useCrossTabState` Hook

```javascript
import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook to share state across multiple browser tabs in real-time.
 *
 * @param {string} channelName - Unique name for the communication channel
 * @param {any} initialValue - Default state value
 * @returns {[any, Function]} [state, setState]
 */
export function useCrossTabState(channelName, initialValue) {
  const [state, setState] = useState(initialValue);
  const channelRef = useRef(null);

  useEffect(() => {
    // 1. Initialize BroadcastChannel
    const channel = new BroadcastChannel(channelName);
    channelRef.current = channel;

    // 2. Listen for state updates coming from OTHER tabs
    channel.onmessage = (event) => {
      if (event.data !== undefined) {
        setState(event.data);
      }
    };

    // 3. Cleanup connection on unmount
    return () => {
      channel.close();
    };
  }, [channelName]);

  // Setter function to update state locally AND broadcast to other tabs
  const setCrossTabState = useCallback((newValue) => {
    setState((prevValue) => {
      const computedValue =
        typeof newValue === "function" ? newValue(prevValue) : newValue;

      // Broadcast new value to all other tabs
      if (channelRef.current) {
        channelRef.current.postMessage(computedValue);
      }

      return computedValue;
    });
  }, []);

  return [state, setCrossTabState];
}
```

---

### Option 2: The `storage` Event (`localStorage` Syncing)

When a tab updates `localStorage`, the browser automatically fires a `storage` event on **all OTHER open tabs** on the same origin.

#### Custom `useSyncedLocalStorage` Hook

```javascript
import { useState, useEffect, useCallback } from "react";

export function useSyncedLocalStorage(key, initialValue) {
  // Get initial value from localStorage or fallback
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading key "${key}":`, error);
      return initialValue;
    }
  });

  // Listen for storage events from OTHER tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key) {
        try {
          const newValue = event.newValue
            ? JSON.parse(event.newValue)
            : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Error parsing synced key "${key}":`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, initialValue]);

  // Update localStorage and local React state
  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error writing key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue];
}
```

---

### Comparison & Selection Matrix

| Feature           | `BroadcastChannel` Hook                                                                           | `storage` Event Hook                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Persistence**   | In-memory only (cleared when all tabs close).                                                     | Persisted in `localStorage`.                                                            |
| **Data Types**    | Supports complex objects, `Blob`, `ArrayBuffer`, primitives.                                      | Strings/JSON-serializable objects only.                                                 |
| **Performance**   | Faster (direct message passing without disk I/O).                                                 | Slightly slower due to disk serialization.                                              |
| **Trigger Rule**  | `postMessage()` reaches all listening channels.                                                   | `storage` event **only triggers in OTHER tabs** (not the tab making the change).        |
| **Best Use Case** | Synchronizing transient state (e.g., audio playback position, active shopping cart drawer state). | Synchronizing user preference data (e.g., auth tokens, theme toggles, locale settings). |

What are the pros and cons of writing a custom useCookie hook versus using third-party libraries like react-cookie or js-cookie?

Here's my take: Deciding between writing a custom `useCookie` hook versus bringing in third-party libraries like **`js-cookie`** or **`react-cookie`** comes down to balancing **bundle size vs. RFC spec compliance and cross-tab reactive state management**.

---

### Comparison Matrix

| Metric / Capability        | Custom `useCookie` Hook                      | `js-cookie` (~800 B)                              | `react-cookie` (~2-7 KB)                          |
| -------------------------- | -------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| **Primary Focus**          | Minimal, self-contained React state binding. | Pure JavaScript cookie parser utility.            | Full-featured React Provider & Hook system.       |
| **React State Reactivity** | ✅ Triggers component re-renders.            | ❌ Manual re-renders required (pure JS).          | ✅ Triggers component re-renders.                 |
| **RFC 6265 Compliance**    | ⚠️ Basic (`encodeURIComponent`).             | ✅ Full compliance (special characters/encoding). | ✅ Full compliance (uses `universal-cookie`).     |
| **SSR / Next.js Support**  | ⚠️ Requires manual window/document guards.   | ❌ Client-side only (`document.cookie`).          | ✅ Built-in SSR support with `<CookiesProvider>`. |
| **Bundle Impact**          | **0 KB** (Included in app code).             | **< 1 KB** gzipped.                               | **~3–5 KB** gzipped.                              |

---

### 1. Custom `useCookie` Hook

#### Pros

- **Zero Dependencies:** Eliminates supply-chain security risks and keeps your bundle slim.
- **Exact Fit:** You write only the features you need (e.g., custom expiration formatting or targeted `SameSite` policies).
- **React State Binding:** Natively updates component state, causing re-renders when the value changes locally.

#### Cons

- **Cross-Tab Reactivity Gap:** `document.cookie` does **not** emit a native browser event when updated. A basic custom hook will update state in the current component, but won't automatically sync if another tab changes the cookie unless you layer in `BroadcastChannel` or polling.
- **Edge-Case Encoding Bugs:** RFC 6265 cookie encoding has subtle rules around semicolons, quotes, spaces, and Unicode characters that plain `encodeURIComponent` doesn't always address correctly.
- **SSR Hydration Mismatches:** Reading `document.cookie` during initial state setup can cause hydration errors during Server-Side Rendering (e.g., in Next.js or Remix) if the server value differs from the browser value.

---

### 2. `js-cookie` (Utility Library)

#### Pros

- **Battle-Tested & Lightweight:** Under 1 KB gzipped, heavily tested, and handles complex RFC 6265 character encoding automatically.
- **Framework Agnostic:** Can be used anywhere (utility files, Redux middleware, API callers, or React components).

#### Cons

- **Non-Reactive:** It is a imperative DOM utility, not a React hook. Updating a cookie via `Cookies.set('key', 'val')` **will not trigger a React component re-render** unless you wrap it inside a custom React state setter.

```javascript
// Wrapping js-cookie in a custom hook for React reactivity + spec safety
import { useState, useCallback } from "react";
import Cookies from "js-cookie";

export function useJsCookie(key, defaultValue = null) {
  const [value, setValue] = useState(() => Cookies.get(key) ?? defaultValue);

  const updateCookie = useCallback(
    (newValue, options) => {
      Cookies.set(key, newValue, options);
      setValue(newValue);
    },
    [key],
  );

  const removeCookie = useCallback(
    (options) => {
      Cookies.remove(key, options);
      setValue(null);
    },
    [key],
  );

  return [value, updateCookie, removeCookie];
}
```

---

### 3. `react-cookie` (Framework Ecosystem)

#### Pros

- **Full Ecosystem Integration:** Built specifically for React using Context Providers (`<CookiesProvider>`), allowing universal access to cookies across your component tree.
- **SSR Ready:** Integrates cleanly with server-side rendered apps by allowing cookie state to be seeded from HTTP request headers.
- **Global Syncing:** Automatically updates state across multiple components when a cookie changes.

#### Cons

- **Heavier Footprint:** Pulls in external dependencies (like `universal-cookie`), making it significantly larger than a custom implementation or `js-cookie`.
- **Provider Boilerplate:** Requires wrapping your root component in `<CookiesProvider>` for full SSR/context functionality.

---

### Decision Framework: Which Should You Choose?

1. **Use a Custom Hook when:** You have a small, client-rendered React app, need to manage basic state (e.g., dismissing a banner or saving a UI preference), and want zero external dependencies.
2. **Use `js-cookie` + Custom Hook when:** You want bulletproof character encoding and cookie parsing without pulling in a heavy React framework library.
3. **Use `react-cookie` (or `nookies`) when:** You are building a complex Server-Side Rendered (SSR) application (e.g., Next.js/Remix) where session cookies must be seamlessly parsed on the server and hydrated on the client.
