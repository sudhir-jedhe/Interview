**Throttling** and **debouncing** are both techniques used to limit the rate at which a function is executed, typically in response to events like scroll, resize, or keypress. They help optimize performance by reducing the number of function calls, especially when those events are triggered frequently. However, they have distinct behaviors and use cases.

### **Debouncing**

Debouncing ensures that a function is executed **only once** after a certain period of time has passed since the last event was triggered.

- **How it works**: When an event is triggered, the function is delayed for a specified time (a "waiting period"). If the event is triggered again before the time is over, the previous call is canceled, and the timer restarts.
- **Use case**: It is ideal for scenarios where you want to wait until the user has finished an action (e.g., typing in an input field) before executing a function. For example, it’s useful for **search autocompletion** where you don’t want to make an API request with every keystroke.

#### **Example: Debouncing** (with `setTimeout`)

```javascript
let debounceTimer;
function handleInput(event) {
  clearTimeout(debounceTimer); // Clear the previous timer
  debounceTimer = setTimeout(() => {
    console.log("API call with input value:", event.target.value);
  }, 500); // Execute function after 500ms of no input
}

const inputElement = document.getElementById("searchInput");
inputElement.addEventListener("input", handleInput);
```

- **Behavior**: If the user types rapidly, the function will only be executed **after they stop typing** for 500 milliseconds. If the user types again before 500ms, the timer is reset.

### **Throttling**

Throttling ensures that a function is executed at **regular intervals**. Even if the event is triggered continuously, the function will only run once within the specified time period.

- **How it works**: The function is executed immediately when the event is triggered for the first time, then it ignores subsequent triggers for a certain time period (i.e., a "cooldown period"). After that period, it can be triggered again.
- **Use case**: It is ideal for scenarios where you want to limit the frequency of function execution (e.g., on scroll or window resizing). For example, it can be used to **optimize scroll event handling** where you don't want to perform expensive operations on every scroll event.

#### **Example: Throttling** (with `setTimeout`)

```javascript
let lastExecutionTime = 0;
function handleScroll(event) {
  const now = Date.now();
  if (now - lastExecutionTime >= 1000) {
    // Execute once per second
    console.log("Handling scroll event");
    lastExecutionTime = now;
  }
}

window.addEventListener("scroll", handleScroll);
```

- **Behavior**: In this example, the `handleScroll` function will only be executed **once every 1000 milliseconds (1 second)**, even if the scroll event fires multiple times during that period.

---

### **Key Differences**

| **Feature**          | **Debouncing**                                                                  | **Throttling**                                                                      |
| -------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Goal**             | Delay the function call until a certain period of inactivity.                   | Ensure the function is executed at regular intervals.                               |
| **Execution**        | Executes only once after a delay of inactivity.                                 | Executes at regular intervals, regardless of how many times the event is triggered. |
| **When to Use**      | When you want to wait until an action finishes (e.g., after user stops typing). | When you want to limit the frequency of function execution (e.g., while scrolling). |
| **Example Use Case** | Autocomplete search, window resizing, form validation after input stops.        | Tracking scroll position, resize events, or handling click events in animations.    |
| **Result**           | Executes the function once after a series of triggers.                          | Executes the function at fixed intervals.                                           |

---

### **Use Case Scenarios**

1. **Debouncing**:
   - **Search Input**: If you're building a live search feature, you don’t want to make an API call every time the user types a character. Instead, you wait until the user stops typing for a specified amount of time (e.g., 300-500ms) before sending the request.
   - **Form Validation**: If you have real-time form validation, you want to wait until the user finishes typing in an input field before performing the validation.

2. **Throttling**:
   - **Scroll Events**: When handling `scroll` events to display infinite scroll, or when updating elements based on the scroll position, throttling ensures that the function doesn't run too frequently and helps improve performance.
   - **Window Resize**: When adjusting layout on window resize, you typically want to limit how often the resizing logic runs, e.g., execute resizing logic every 200ms or 300ms.

---

### **Visualizing Throttling vs Debouncing**

- **Debouncing**:
  - Event fired multiple times → Wait for inactivity → Execute once.
- **Throttling**:
  - Event fired multiple times → Execute at fixed intervals (e.g., every 500ms).

### **Summary**:

- **Debouncing** is ideal for handling actions where you want to wait until a user stops performing an action, such as typing or resizing.
- **Throttling** is ideal when you want to execute an action at a consistent rate, like responding to scroll or resize events.

Both techniques optimize performance by reducing the number of function executions, but they are used in different contexts.

Both **Throttling** and **Debouncing** are rate-limiting techniques used in Web development to control how frequently a fast-firing event handler (like `scroll`, `resize`, `keyup`, or `mousemove`) is executed.

While they serve similar goals, their execution strategies are fundamental opposites.

---

## The Core Difference

- **Debouncing:** Delays execution until the user **stops taking action** for a specified delay. Every time the event triggers within the delay window, the timer resets.
- _Analogy:_ An elevator door waiting for people. It stays open as long as people keep walking in. It only closes and moves once 5 seconds pass with _no new people_.

- **Throttling:** Enforces a **maximum execution rate**, executing the handler at most once every $X$ milliseconds, no matter how many times the user fires the event.
- _Analogy:_ A water faucet dripping once every 2 seconds. No matter how hard or fast you shake the handle, it releases only one drop per interval.

---

## 1. Debouncing Examples

### Example A: Live Search Bar (Debounced API Call)

When a user types into a search input, sending an API request on _every keystroke_ floods your server. Debouncing waits until the user finishes typing before making the network request.

```jsx
import React, { useState, useEffect, useCallback } from "react";

// Custom reusable useDebounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timer to update value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Reset timer if value changes before delay expires
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchComponent() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500); // 500ms delay

  useEffect(() => {
    if (debouncedQuery) {
      console.log(`📡 Fetching API results for: "${debouncedQuery}"`);
      // API call goes here
    }
  }, [debouncedQuery]);

  return (
    <div style={{ padding: "20px" }}>
      <h3>Debounced Search Input</h3>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search..."
        style={{ padding: "8px", width: "300px" }}
      />
      <p>
        Immediate state: <b>{query}</b>
      </p>
      <p>
        Debounced state (API Trigger): <b>{debouncedQuery}</b>
      </p>
    </div>
  );
}
```

---

## 2. Throttling Examples

### Example B: Infinite Scroll / Window Scroll Listener

When listening to scroll events, debouncing would wait until the user completely stops scrolling to trigger actions. Throttling provides a smooth, continuous stream of updates at a fixed interval while scrolling is happening.

```jsx
import React, { useState, useEffect, useRef } from "react";

// Custom reusable useThrottle hook
function useThrottle(callback, delay) {
  const lastRan = useRef(Date.now());

  return useRef((...args) => {
    const handler = () => {
      if (Date.now() - lastRan.current >= delay) {
        callback(...args);
        lastRan.current = Date.now();
      }
    };
    handler();
  }).current;
}

export default function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);

  // Throttle updates so scroll handler runs at most once every 200ms
  const handleScroll = useThrottle(() => {
    console.log(`📜 Updating Scroll Position: ${window.scrollY}px`);
    setScrollY(window.scrollY);
  }, 200);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div style={{ height: "2000px", padding: "20px" }}>
      <div
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          background: "#333",
          color: "#fff",
          padding: "10px",
          borderRadius: "6px",
        }}
      >
        Current Throttled Scroll Y: {scrollY}px
      </div>
      <p>Scroll down this page to observe the throttled state updates...</p>
    </div>
  );
}
```

---

## 3. Side-by-Side Comparison

| Metric                | Debouncing                                  | Throttling                                      |
| --------------------- | ------------------------------------------- | ----------------------------------------------- |
| **Execution Trigger** | After events **pause** for $N$ milliseconds | At regular, fixed intervals during event stream |
| **Pacing**            | Resets timer on every trigger               | Ignores intermediate triggers during interval   |
| **Primary Use Cases** | • Search Input Auto-complete<br>            |

<br>• Form Field Validation on type<br>

<br>• Window Resize final layout recalculation | • Infinite Scroll page fetching<br>

<br>• Button double-click / submit protection<br>

<br>• Drag-and-drop / Mousemove coordinate tracking |
