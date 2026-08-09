Here is the complete guide and solution for LeetCode #2715: **Timeout Cancellation** (executing a function after a delay $t$ milliseconds unless a returned cancellation function is called before $t$ elapses).

---

### Solution

```javascript
/**
 * Executes fn after t milliseconds unless cancelFn is called before t milliseconds.
 *
 * @param {Function} fn - Function to execute after delay.
 * @param {Array} args - Arguments to pass to fn.
 * @param {number} t - Time delay in milliseconds.
 * @return {Function} cancelFn - Calling this function cancels the scheduled execution.
 */
var cancellable = function(fn, args, t) {
  // 1. Schedule fn to execute after t milliseconds
  const timer = setTimeout(() => {
    fn(...args);
  }, t);

  // 2. Return a cancel function that clears the pending timeout
  const cancelFn = function() {
    clearTimeout(timer);
  };

  return cancelFn;
};

```

---

### Alternative Implementation Approaches

#### 1. One-Liner Arrow Function

For a concise implementation using arrow functions:

```javascript
var cancellable = function(fn, args, t) {
  const timer = setTimeout(() => fn(...args), t);
  return () => clearTimeout(timer);
};

```

#### 2. Tracking Cancellation State Explicitly

If you need to log or check whether cancellation actually took place:

```javascript
var cancellable = function(fn, args, t) {
  let isCancelled = false;

  const timer = setTimeout(() => {
    if (!isCancelled) {
      fn(...args);
    }
  }, t);

  return function() {
    isCancelled = true;
    clearTimeout(timer);
  };
};

```

---

### Usage Examples

#### Example 1: Function Executes (Cancel Not Called in Time)

```javascript
const result = [];
const fn = (x) => x * 5;
const args = [2], t = 20, cancelTimeMs = 50;

const start = performance.now();

const log = (...argsArr) => {
  const diff = Math.floor(performance.now() - start);
  result.push({ "time": diff, "returned": fn(...argsArr) });
};

const cancel = cancellable(log, args, t);

setTimeout(cancel, cancelTimeMs);

setTimeout(() => {
  console.log(result); 
  // Output at t=50ms: [{"time": 20, "returned": 10}] (fn executed at t=20ms)
}, cancelTimeMs + 10);

```

#### Example 2: Cancellation Before Execution

```javascript
const result = [];
const fn = (x) => x * 5;
const args = [2], t = 100, cancelTimeMs = 50;

const log = (...argsArr) => {
  result.push(fn(...argsArr));
};

const cancel = cancellable(log, args, t);

// Cancel at 50ms (before t=100ms arrives)
setTimeout(cancel, cancelTimeMs);

setTimeout(() => {
  console.log(result); 
  // Output at t=120ms: [] (fn was never executed!)
}, cancelTimeMs + 70);

```

---

### Key Takeaways

1. **`setTimeout` & `clearTimeout` Mechanics:** `setTimeout` returns a numerical timer ID. Passing this ID into `clearTimeout(timer)` removes the task from JavaScript's event loop before it executes.
2. **Closure Retention:** The returned `cancelFn` retains access to the `timer` variable through its lexical environment (closure).
3. **Execution Delay Threshold:** If `cancelTimeMs < t`, `fn` will be cancelled and will not run. If `cancelTimeMs >= t`, `fn` executes at $t$ ms before cancellation is attempted.
