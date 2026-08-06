To implement the `clearAllTimeout()` function, we need to keep track of all the active timers set by `setTimeout()`. Once we have that, we can clear each of those timers when `clearAllTimeout()` is invoked.

Here are a few different approaches to solving the problem, which leverage different methods for storing the timer IDs and overriding `setTimeout` to intercept and capture the timer IDs.

### Solution 1: Using `Set` to Track Timers
This approach overrides the native `setTimeout` to capture the timer IDs, which are then stored in a `Set`. The `clearAllTimeout` function can then clear all the timers using the IDs stored in the `Set`.

```javascript
(() => {
  const originSetTimeout = setTimeout;
  const originClearTimeout = clearTimeout;
  const timers = new Set();

  // Override window.setTimeout to store timer IDs in a Set
  window.setTimeout = (callback, time, ...args) => {
    const callbackWrapper = () => {
      callback(...args);
      timers.delete(timerId); // Remove the timer once it's executed
    };
    const timerId = originSetTimeout(callbackWrapper, time);
    timers.add(timerId); // Add the timer ID to the Set
    return timerId;
  };

  // Override window.clearTimeout to remove timer IDs from the Set
  window.clearTimeout = (id) => {
    originClearTimeout(id);
    timers.delete(id); // Remove from Set when cleared manually
  };

  // Function to clear all timeouts
  window.clearAllTimeout = () => {
    for (const timerId of timers) {
      originClearTimeout(timerId); // Clear each timer
    }
    timers.clear(); // Clear the Set
  };
})();
```

#### Explanation:
- We override `setTimeout` and `clearTimeout` to capture the timer IDs and store them in a `Set`.
- When `clearAllTimeout()` is called, we loop through all the stored timer IDs in the `Set` and clear them one by one using `clearTimeout()`.
- Once all timers are cleared, we also clear the `Set` to release the references.

### Solution 2: Using Array to Track Timer IDs
In this approach, we use an array to track the IDs of all active timers. This is a simpler method compared to using a `Set`.

```javascript
const originalSetTimeout = window.setTimeout;
let timeoutIds = [];

// Override window.setTimeout to store timer IDs in an array
window.setTimeout = (callback, delay) => {
  const timerId = originalSetTimeout(callback, delay);
  timeoutIds.push(timerId); // Store the timer ID in the array
  return timerId;
};

// Function to clear all timers
const clearAllTimeout = () => {
  timeoutIds.forEach((id) => window.clearTimeout(id)); // Clear each timeout
  timeoutIds = []; // Reset the array after clearing all timeouts
};
```

#### Explanation:
- Every time a timeout is set using `setTimeout`, we store the timer ID in the `timeoutIds` array.
- `clearAllTimeout` iterates over the array, clearing each timer and then resets the array.

### Solution 3: Using a Global Array to Track Timers
This approach is similar to the previous one but involves using a global `timers` array directly.

```javascript
const timers = [];

// Override window.setTimeout to store timer IDs in an array
(() => {
  const setTimeoutCopy = setTimeout;

  window.setTimeout = (cb, time) => {
    const timeoutID = setTimeoutCopy(() => {
      cb();
    }, time);
    timers.push(timeoutID); // Store the timer ID in the global array
    return timeoutID;
  };
})();

// Function to clear all timers
const clearAllTimeout = () => {
  timers.forEach((timeoutID) => clearTimeout(timeoutID)); // Clear all timers
};
```

#### Explanation:
- We override `setTimeout` to store the timer IDs in the global `timers` array.
- `clearAllTimeout()` clears each timer by iterating over the array.

### Test the Implementation

Let's test any of these solutions by setting some timers and calling `clearAllTimeout()`.

```javascript
console.log("start");
setTimeout(() => {
  console.log("One");
}, 4000);
setTimeout(() => {
  console.log("Two");
}, 5000);
setTimeout(() => {
  console.log("Three");
}, 6000);
setTimeout(() => {
  console.log("Four");
}, 7000);
console.log("Finished");

// Removes all the timers set above
clearAllTimeout();
console.log("Discarded");
```

#### Output:
```text
start
Finished
Discarded
```

In the above test case, the timers for "One", "Two", "Three", and "Four" are set to execute after different delays (4000ms, 5000ms, 6000ms, and 7000ms). However, since `clearAllTimeout()` is called before those timers expire, none of those messages will be logged, and "Discarded" is printed immediately after "Finished".

### Conclusion

By overriding `setTimeout` and `clearTimeout`, you can capture all the timer IDs and clear them when needed with `clearAllTimeout()`. Depending on your requirements, you can use an array, a `Set`, or any other suitable data structure to store the timer IDs. This solution ensures that all active timers can be cleared efficiently before a page transition or any other event where cleanup is necessary.