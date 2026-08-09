Here is a production-ready `useAsync` hook (and its imperative counterpart `useAsyncFn`). It handles promise states (`idle`, `pending`, `success`, `error`), race conditions, cancellation on unmount, and immediate or manual execution.

---

### `useAsync` / `useAsyncFn` Hook

```jsx
import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Hook for imperative async function execution.
 *
 * @param {Function} asyncFunction - The async function returning a promise.
 * @param {Array} [deps=[]] - Dependency array to re-create the runner.
 * @returns {Tuple} [state, execute] - State object and trigger function.
 */
export function useAsyncFn(asyncFunction, deps = []) {
  const [state, setState] = useState({
    status: "idle",
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  // Keep track of call count to resolve race conditions
  const callIdRef = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args) => {
      const currentCallId = ++callIdRef.current;

      setState((prev) => ({
        ...prev,
        status: "pending",
        isLoading: true,
        isSuccess: false,
        isError: false,
        error: null,
      }));

      try {
        const data = await asyncFunction(...args);

        // Prevent race condition updates and state updates after unmount
        if (isMountedRef.current && currentCallId === callIdRef.current) {
          setState({
            status: "success",
            data,
            error: null,
            isLoading: false,
            isSuccess: true,
            isError: false,
          });
        }
        return data;
      } catch (error) {
        if (isMountedRef.current && currentCallId === callIdRef.current) {
          setState({
            status: "error",
            data: null,
            error,
            isLoading: false,
            isSuccess: false,
            isError: true,
          });
        }
        throw error;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );

  return [state, execute];
}

/**
 * Hook for immediate or auto-executing async functions on mount / dependency changes.
 *
 * @param {Function} asyncFunction - The async function returning a promise.
 * @param {Array} [deps=[]] - Dependencies that trigger auto-execution when changed.
 * @param {Object} [options] - Configurations.
 * @param {boolean} [options.immediate=true] - Auto-run immediately on mount or dependency change.
 */
export function useAsync(asyncFunction, deps = [], { immediate = true } = {}) {
  const [state, execute] = useAsyncFn(asyncFunction, deps);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
  };
}

```

---

### Usage Examples

#### 1. Auto-Executing Async Task on Mount (`useAsync`)

```jsx
const fetchUserProfile = async (userId) => {
  const response = await fetch(`https://api.example.com/users/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
};

function UserCard({ userId }) {
  const { data, isLoading, error, execute } = useAsync(
    () => fetchUserProfile(userId),
    [userId]
  );

  if (isLoading) return <div>Loading user profile...</div>;
  if (error) return <div>Error: {error.message} <button onClick={execute}>Retry</button></div>;
  if (!data) return null;

  return <div>Username: {data.name}</div>;
}

```

#### 2. Imperative / Manual Action (`useAsyncFn`)

```jsx
const processPayment = async (amount) => {
  const response = await fetch("/api/checkout", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
  if (!response.ok) throw new Error("Payment failed");
  return response.json();
};

function CheckoutButton({ amount }) {
  const [{ isLoading, isError, isSuccess, error }, handlePayment] = useAsyncFn(
    () => processPayment(amount),
    [amount]
  );

  return (
    <div>
      <button onClick={handlePayment} disabled={isLoading}>
        {isLoading ? "Processing..." : `Pay $${amount}`}
      </button>
      {isSuccess && <p style={{ color: "green" }}>Payment successful!</p>}
      {isError && <p style={{ color: "red" }}>{error.message}</p>}
    </div>
  );
}

```

---

### Key Features

* **Race Condition Protection (`callIdRef`):** If multiple async requests trigger in rapid succession, only the resolution of the *latest* call updates state—discarding stale responses.
* **Unmount Safety (`isMountedRef`):** Discards state updates if the component unmounts before the promise settles, eliminating memory leak warnings.
* **Dual Design Pattern:**
* `useAsyncFn` for manual/event-driven actions (buttons, form submissions).
* `useAsync` for declarative data fetching synchronized with state or dependencies.

* **Explicit Status Enum:** Exposes a unified `status` (`idle` | `pending` | `success` | `error`) alongside boolean flags (`isLoading`, `isSuccess`, `isError`) for straightforward UI conditional rendering.
