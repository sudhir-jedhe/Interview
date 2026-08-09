// Throttling is a way/technique to restrict the number of function execution/call. For example, consider a lucky draw number generator, we want to get a number only after a particular time.

// Excessive function invocations in javascript applications hamper the performance drastically. To optimize an app we need to handle this correctly.

// There are scenarios where we may invoke functions when it isn’t necessary. For example, consider a scenario where we want to make an API call to the server on a button click.

// If the user spam the click then this will make an API call on each click. This is not what we want, we want to restrict the no of API calls that can be made. The other call will be made only after a specified interval of time.

// We have already seen how to implement throttle function in JavaScript.

// Let us see how to create a useThrottle() hook in React with the leading and trailing flag.

// When leading is enabled the first function will invoke right away and then after the specified delay, while when trailing is enabled the first function will invoke after the delay and so on.

// We will be using useRef() to track the timerId of setTimeout so that we can reset it as an when required and previous arguments.

// Also, we will wrap the logic inside the useCallback() to avoid needless re-renderings as the callback function returns a memoized function that only change when one of the dependency changes.

```js
const useThrottle = (fn, wait, option = { leading: true, trailing: true }) => {
    const timerId = useRef(); // track the timer
    const lastArgs = useRef(); // track the args

    // create a memoized debounce
    const throttle = useCallback(
      function (...args) {
        const { trailing, leading } = option;
        // function for delayed call
        const waitFunc = () => {
          // if trailing invoke the function and start the timer again
          if (trailing && lastArgs.current) {
            fn.apply(this, lastArgs.current);
            lastArgs.current = null;
            timerId.current = setTimeout(waitFunc, wait);
          } else {
            // else reset the timer
            timerId.current = null;
          }
        };

        // if leading run it right away
        if (!timerId.current && leading) {
          fn.apply(this, args);
        }
        // else store the args
        else {
          lastArgs.current = args;
        }

        // run the delayed call
        if (!timerId.current) {
          timerId.current = setTimeout(waitFunc, wait);
        }
      },
      [fn, wait, option]
    );

    return throttle;
  };


  Input:
const Example = () => {
  const print = () => {
    console.log("hello");
  };

  const throttled = useThrottle(print, 2500, { leading: true, trailing: false });

  return <button onClick={throttled}> click me</button>;
};

Output:
"hello" // immediately
"hello" // after 2500 milliseconds of last call
"hello" // after 2500 milliseconds of last call




Input:
const Example = () => {
  const print = () => {
    console.log("hello");
  };

  const throttled = useThrottle(print, 2500, { leading: false, trailing: true });

  return <button onClick={throttled}> click me</button>;
};

Output:
"hello" // after 2500 milliseconds
"hello" // after 2500 milliseconds of last call
"hello" // after 2500 milliseconds of last call
```

Here are production-ready, clean implementations of both `useDebounce` and `useThrottle` hooks, along with value-based variants (`useDebounceValue` / `useThrottleValue`).

---

## 1. `useDebounce` & `useDebounceValue`

Debouncing delays invoking a function or updating a state value until after a specified delay has elapsed since the last call.

```jsx
import { useEffect, useState, useRef, useCallback } from "react";

/**
 * Debounces a value (useful for auto-complete search inputs).
 */
export function useDebounceValue(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Debounces a callback function (useful for API calls, resize/scroll events).
 */
export function useDebounce(callback, delay = 500) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef(null);

  // Keep callback reference updated to avoid stale closures
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const debouncedCallback = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (callbackRef.current) {
          callbackRef.current(...args);
        }
      }, delay);
    },
    [delay]
  );

  return debouncedCallback;
}

```

### Usage Examples

```jsx
// Example 1: Debouncing Search Input Value
function SearchInput() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounceValue(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      // Trigger API fetch with debounced query
      fetchSearchResults(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}

// Example 2: Debounced Action Callback
function SaveButton() {
  const handleSave = useDebounce((data) => {
    saveToDatabase(data);
  }, 1000);

  return <button onClick={() => handleSave({ id: 1 })}>Save</button>;
}

```

---

## 2. `useThrottle` & `useThrottleValue`

Throttling enforces a maximum number of times a function or value update can execute over time (e.g., at most once every `limit` milliseconds).

```jsx
import { useEffect, useState, useRef, useCallback } from "react";

/**
 * Throttles a value update.
 */
export function useThrottleValue(value, limit = 300) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecutedRef = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastExecutedRef.current >= limit) {
        setThrottledValue(value);
        lastExecutedRef.current = Date.now();
      }
    }, limit - (Date.now() - lastExecutedRef.current));

    return () => clearTimeout(handler);
  }, [value, limit]);

  return throttledValue;
}

/**
 * Throttles a callback function execution.
 */
export function useThrottle(callback, limit = 300) {
  const callbackRef = useRef(callback);
  const lastRanRef = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const throttledCallback = useCallback(
    (...args) => {
      const now = Date.now();
      const timeRemaining = limit - (now - lastRanRef.current);

      if (timeRemaining <= 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        lastRanRef.current = now;
        callbackRef.current(...args);
      } else if (!timeoutRef.current) {
        // Trailing execution: ensure the final call is executed after the limit window
        timeoutRef.current = setTimeout(() => {
          lastRanRef.current = Date.now();
          timeoutRef.current = null;
          callbackRef.current(...args);
        }, timeRemaining);
      }
    },
    [limit]
  );

  return throttledCallback;
}

```

### Usage Examples

```jsx
// Example: Infinite Scroll Tracker
function ScrollTracker() {
  const handleScroll = useThrottle((event) => {
    console.log("Scroll Y position:", window.scrollY);
  }, 200);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return <div style={{ height: "300vh" }}>Scroll down to observe</div>;
}

```

---

### Key Highlights & Features

* **Stale Closure Safety:** Callbacks are kept in `useRef` to prevent old state snapshots from being called inside delayed timeouts.
* **Trailing Execution Support:** `useThrottle` ensures that the final trailing event call isn't dropped when rapid events cease.
* **Memory Leak Prevention:** All timers are cleaned up when the calling component unmounts.

Here is a production-ready implementation of both `useThrottle` (for values) and `useThrottleCallback` (for functions).

They support trailing and leading execution controls, immediate cleanup on unmount, and `useRef` stabilization to prevent stale closures and event thrashing.

---

### 1. `useThrottleCallback` (Rate-Limits Function Execution)

```jsx
import { useRef, useCallback, useEffect } from "react";

/**
 * Custom hook to throttle function execution.
 *
 * @param {Function} callback - The function to throttle.
 * @param {number} [delay=200] - Throttle interval in milliseconds.
 * @param {Object} [options] - Configuration options.
 * @param {boolean} [options.leading=true] - Execute on the leading edge (immediately).
 * @param {boolean} [options.trailing=true] - Execute on the trailing edge (after delay).
 * @returns {Function} Throttled function.
 */
export function useThrottleCallback(callback, delay = 200, options = {}) {
  const { leading = true, trailing = true } = options;

  const callbackRef = useRef(callback);
  const lastExecTimeRef = useRef(0);
  const timeoutRef = useRef(null);
  const lastArgsRef = useRef(null);

  // Keep callback reference updated to prevent stale closures
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Clean up pending timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const throttledCallback = useCallback(
    (...args) => {
      const now = Date.now();
      const elapsed = now - lastExecTimeRef.current;
      lastArgsRef.current = args;

      const execute = () => {
        lastExecTimeRef.current = Date.now();
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        callbackRef.current(...lastArgsRef.current);
      };

      // Leading edge execution
      if (elapsed >= delay) {
        if (leading) {
          execute();
        } else if (trailing && !timeoutRef.current) {
          timeoutRef.current = setTimeout(execute, delay);
        }
      } else if (trailing && !timeoutRef.current) {
        // Trailing edge execution
        const remaining = delay - elapsed;
        timeoutRef.current = setTimeout(execute, remaining);
      }
    },
    [delay, leading, trailing]
  );

  return throttledCallback;
}

```

---

### 2. `useThrottle` (Rate-Limits State / Values)

```jsx
import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to throttle a rapidly changing value.
 *
 * @param {T} value - The input value to throttle.
 * @param {number} [delay=200] - Throttle delay in milliseconds.
 * @returns {T} Throttled value.
 */
export function useThrottle(value, delay = 200) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecTimeRef = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastExecTimeRef.current;

    if (elapsed >= delay) {
      lastExecTimeRef.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastExecTimeRef.current = Date.now();
        setThrottledValue(value);
      }, delay - elapsed);

      return () => clearTimeout(timer);
    }
  }, [value, delay]);

  return throttledValue;
}

```

---

### Usage Examples

#### 1. Rate-Limiting Scroll / Mouse Events (`useThrottleCallback`)

```jsx
function ScrollTracker() {
  const [scrollPosition, setScrollPosition] = useState(0);

  // Throttles expensive state updates to at most once every 100ms
  const handleScroll = useThrottleCallback(
    () => {
      setScrollPosition(window.scrollY);
    },
    100,
    { leading: true, trailing: true }
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return <div>Scroll Y: {scrollPosition}px</div>;
}

```

#### 2. Throttling Rapid UI Input Value Changes (`useThrottle`)

```jsx
function RealtimeSearch({ query }) {
  // Throttles search query updates sent down to heavy search components
  const throttledQuery = useThrottle(query, 300);

  return (
    <div>
      <p>Raw Input: {query}</p>
      <p>Throttled Input (Updated max 1x / 300ms): {throttledQuery}</p>
      <SearchResults query={throttledQuery} />
    </div>
  );
}

```

---

### Key Features

* **Leading & Trailing Controls:** Offers options to run code immediately upon the first trigger (`leading: true`) and run a final catch-up invocation when triggers stop (`trailing: true`).
* **Stale Closure Protection:** Stores callback functions in mutable `useRef` instances so callbacks always execute with fresh component state and props.
* **Leak-Free Timer Management:** Safely clears active `setTimeout` operations when components unmount or parameters update.
* **Completely Uncoupled:** `useThrottle` handles state synchronization, while `useThrottleCallback` handles high-frequency event handlers.
