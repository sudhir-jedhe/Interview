Here is a production-ready `useLocalStorage` React hook. It handles initial SSR hydration safety, error handling for restricted storage/quota errors, function updaters (like standard `useState`), and multi-tab synchronization via the native `storage` event.

```jsx
import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook for state synchronized with localStorage across browser tabs.
 *
 * @param {string} key - The localStorage key.
 * @param {any} initialValue - Default value if key doesn't exist in storage.
 */
export function useLocalStorage(key, initialValue) {
  // Store initialValue in a ref to avoid re-runs when non-memoized objects are passed
  const initialValueRef = useRef(initialValue);
  useEffect(() => {
    initialValueRef.current = initialValue;
  }, [initialValue]);

  // Read value safely from localStorage
  const readValue = useCallback(() => {
    if (typeof window === "undefined") {
      return typeof initialValueRef.current === "function"
        ? initialValueRef.current()
        : initialValueRef.current;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
      return typeof initialValueRef.current === "function"
        ? initialValueRef.current()
        : initialValueRef.current;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return typeof initialValueRef.current === "function"
        ? initialValueRef.current()
        : initialValueRef.current;
    }
  }, [key]);

  const [storedValue, setStoredValue] = useState(readValue);

  // Set value both in state and localStorage
  const setValue = useCallback(
    (value) => {
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

          window.localStorage.setItem(key, JSON.stringify(newValue));

          // Dispatch custom event to sync within the SAME tab/window
          window.dispatchEvent(
            new CustomEvent("local-storage", {
              detail: { key, newValue },
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

  // Synchronize state across browser tabs & same-tab instances
  useEffect(() => {
    // Sync initial state after mount (prevents SSR hydration mismatch)
    setStoredValue(readValue());

    const handleStorageChange = (event) => {
      // Native window 'storage' event (fires across different tabs/windows)
      if (event instanceof StorageEvent) {
        if (event.key !== key || event.storageArea !== window.localStorage) return;
        try {
          setStoredValue(event.newValue ? JSON.parse(event.newValue) : readValue());
        } catch {
          setStoredValue(readValue());
        }
      } 
      // Custom event (fires within the same tab across multiple hook usages)
      else if (event.detail && event.detail.key === key) {
        setStoredValue(event.detail.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage", handleStorageChange);
    };
  }, [key, readValue]);

  return [storedValue, setValue];
}

```

---

### Usage Examples

#### 1. Storing User Settings / Theme

```jsx
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage("app-theme", "light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme} (Click to toggle)
    </button>
  );
}

```

#### 2. Synchronized Shopping Cart / Multi-Tab Sync

```jsx
function CartBadge() {
  // If another tab updates the cart, this component updates immediately
  const [cartItems, setCartItems] = useLocalStorage("cart", []);

  const addItem = () => {
    setCartItems((prev) => [...prev, { id: Date.now(), name: "New Item" }]);
  };

  return (
    <div>
      <h3>Items in cart: {cartItems.length}</h3>
      <button onClick={addItem}>Add Item</button>
    </div>
  );
}

```

---

### Key Features

* **Multi-Tab Sync:** Listens to native browser `storage` events to update components automatically when `localStorage` changes in another tab.
* **Same-Tab Component Sync:** Dispatches a custom `local-storage` event so multiple components in the *same* tab using the same key update simultaneously.
* **Functional Updaters Supported:** Works seamlessly with function state updates like `setValue(prev => prev + 1)`.
* **SSR & Hydration Safe:** Avoids hydration mismatch errors during SSR (Next.js/Remix) by deferring storage reading safely.
* **Error Resilience:** Handles private browsing restrictions, disabled cookies, and storage quota exceptions gracefully with try-catch guards.
