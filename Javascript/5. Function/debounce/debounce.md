Below is a consolidated and detailed implementation of `debounce` functions based on your requirements, examples, and additional scenarios. These implementations include basic debounce, debounce with options for `leading` and `trailing` execution, and comments to clarify their behavior.

---

### Basic Debounce Function

This version delays the function execution until the user stops triggering the event for a specific time (`delay`).

```javascript
function debounce(func, delay) {
  let timeout;

  return function (...args) {
    const context = this;

    // Clear the existing timer
    clearTimeout(timeout);

    // Set a new timer
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

// Example usage
const logMessage = () => console.log("Debounced function executed");
const debouncedLog = debounce(logMessage, 500);

// Trigger the debounced function
debouncedLog();
debouncedLog();
debouncedLog();
// Only one log will appear 500ms after the last call.
```

---

### Debounce with `leading` and `trailing` Options

This version allows specifying whether the function should execute on the leading edge (immediately) or the trailing edge (after the delay).

```javascript
function debounce(func, delay, options = { leading: false, trailing: true }) {
  let timeout;
  let lastArgs;

  // Return a debounced function
  return function (...args) {
    const context = this;
    const shouldCallNow = options.leading && !timeout;

    // Save the latest arguments
    lastArgs = args;

    // Clear any existing timer
    clearTimeout(timeout);

    // If `leading` is true and no active timer, call immediately
    if (shouldCallNow) {
      func.apply(context, args);
    }

    // Set up the timer
    timeout = setTimeout(() => {
      timeout = null;

      // If `trailing` is true, call with the latest arguments
      if (options.trailing && lastArgs) {
        func.apply(context, lastArgs);
      }

      lastArgs = null; // Reset arguments after execution
    }, delay);
  };
}

// Example usage
const logEvent = () => console.log("Debounced with options");
const debouncedEvent = debounce(logEvent, 1000, { leading: true, trailing: false });

// Immediate execution (leading)
debouncedEvent();
debouncedEvent();
```

---

### Advanced Debounce with Edge Cases Handling

This version addresses edge cases like calling the debounced function in different contexts or when multiple calls occur during the wait period.

```javascript
function debounce(func, delay) {
  let timeout;

  return function (...args) {
    const context = this;

    clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

// Example to handle mouse move events
function onMouseMove(e) {
  console.clear();
  console.log(`Mouse moved: (${e.clientX}, ${e.clientY})`);
}

const debouncedMouseMove = debounce(onMouseMove, 100);

window.addEventListener("mousemove", debouncedMouseMove);
```

---

### Explanation of Techniques Used

1. **Using Closures**:
   - A private `timeout` variable is retained for each instance of the debounced function.

2. **Context Handling**:
   - The `this` context and function arguments are captured and forwarded using `.apply()` to ensure correct behavior.

3. **Edge Cases**:
   - Leading/trailing execution options are handled.
   - Ensures proper behavior even with frequent calls.

---

These examples demonstrate how to implement debounce in various scenarios, allowing you to tailor the behavior to specific requirements.