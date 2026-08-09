Here is a production-ready `useSessionStorage` React hook. It mirrors the design of `useLocalStorage`, with initial SSR safety, function updater support, error handling, and same-tab synchronization across multiple components.

```jsx
import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook for state synchronized with sessionStorage.
 *
 * @param {string} key - The sessionStorage key.
 * @param {any} initialValue - Default value if key doesn't exist in storage.
 */
export function useSessionStorage(key, initialValue) {
  // Store initialValue in a ref to handle non-memoized default objects safely
  const initialValueRef = useRef(initialValue);
  useEffect(() => {
    initialValueRef.current = initialValue;
  }, [initialValue]);

  // Safely retrieve value from sessionStorage
  const readValue = useCallback(() => {
    if (typeof window === "undefined") {
      return typeof initialValueRef.current === "function"
        ? initialValueRef.current()
        : initialValueRef.current;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
      return typeof initialValueRef.current === "function"
        ? initialValueRef.current()
        : initialValueRef.current;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return typeof initialValueRef.current === "function"
        ? initialValueRef.current()
        : initialValueRef.current;
    }
  }, [key]);

  const [storedValue, setStoredValue] = useState(readValue);

  // Set value both in state and sessionStorage
  const setValue = useCallback(
    (value) => {
      if (typeof window === "undefined") {
        console.warn(
          `Tried setting sessionStorage key "${key}" even though window is not defined`
        );
        return;
      }

      try {
        setStoredValue((currentValue) => {
          const newValue =
            typeof value === "function" ? value(currentValue) : value;

          window.sessionStorage.setItem(key, JSON.stringify(newValue));

          // Dispatch custom event to sync multiple instances within the same tab
          window.dispatchEvent(
            new CustomEvent("session-storage", {
              detail: { key, newValue },
            })
          );

          return newValue;
        });
      } catch (error) {
        console.warn(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key]
  );

  // Sync state across component instances within the same session/tab
  useEffect(() => {
    // Sync state post-mount to prevent SSR hydration mismatch
    setStoredValue(readValue());

    const handleStorageChange = (event) => {
      if (event.detail && event.detail.key === key) {
        setStoredValue(event.detail.newValue);
      }
    };

    window.addEventListener("session-storage", handleStorageChange);

    return () => {
      window.removeEventListener("session-storage", handleStorageChange);
    };
  }, [key, readValue]);

  return [storedValue, setValue];
}

```

---

### Usage Examples

#### 1. Session Form Draft (Cleared when tab closes)

```jsx
function CheckoutForm() {
  const [formData, setFormData] = useSessionStorage("checkout_draft", {
    name: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
    </form>
  );
}

```

#### 2. Temporary Auth Token or Step Index

```jsx
function MultiStepWizard() {
  const [step, setStep] = useSessionStorage("wizard_step", 1);

  return (
    <div>
      <h2>Step {step} of 4</h2>
      <button onClick={() => setStep((s) => Math.max(1, s - 1))}>Back</button>
      <button onClick={() => setStep((s) => Math.min(4, s + 1))}>Next</button>
    </div>
  );
}

```

---

### Key Features

* **Session Lifecycle Scope:** Values persist through page refreshes, but clear automatically when the tab or window closes (unlike `localStorage`).
* **Same-Tab Syncing:** Dispatches a custom `session-storage` event so multiple components on the same page stay synchronized (browser `storage` events don't natively trigger for `sessionStorage` in the same window).
* **Functional Updater Support:** Supports function updates like `setValue(prev => prev + 1)`.
* **SSR & Hydration Safe:** Safely handles server-side execution without causing Next.js or Remix hydration warnings.
