Here is the complete guide and solution for LeetCode #2725: **Interval Cancellation** (executing a function immediately at $t = 0\text{ ms}$ and repeatedly every $t\text{ ms}$ until a returned cancellation function is called).

---

### Solution

```javascript
/**
 * Executes fn immediately and then repeatedly every t milliseconds.
 * Returns a cancelFn that stops the interval.
 *
 * @param {Function} fn - Function to execute.
 * @param {Array} args - Arguments to pass to fn.
 * @param {number} t - Time interval in milliseconds.
 * @return {Function} cancelFn - Calling this stops further interval executions.
 */
var cancellable = function(fn, args, t) {
  // 1. Immediate initial execution at t = 0
  fn(...args);

  // 2. Schedule recurring executions every t ms
  const timer = setInterval(() => {
    fn(...args);
  }, t);

  // 3. Return a cancel function that clears the active interval
  return function() {
    clearInterval(timer);
  };
};

```

---

### Alternative Implementation Approaches

#### 1. One-Liner Arrow Function

For a concise implementation:

```javascript
var cancellable = function(fn, args, t) {
  fn(...args);
  const timer = setInterval(() => fn(...args), t);
  return () => clearInterval(timer);
};

```

#### 2. Using Recursive `setTimeout`

Instead of `setInterval`, using recursive `setTimeout` gives precise control over timing:

```javascript
var cancellable = function(fn, args, t) {
  fn(...args);
  let timerId = null;

  const repeat = () => {
    timerId = setTimeout(() => {
      fn(...args);
      repeat();
    }, t);
  };

  repeat();

  return function() {
    clearTimeout(timerId);
  };
};

```

---

### Usage Examples

#### Example 1: Execution and Cancellation

```javascript
const result = [];
const fn = (x) => x * 2;
const args = [4], t = 35, cancelTimeMs = 190;

const start = performance.now();

const log = (...argsArr) => {
  const diff = Math.floor(performance.now() - start);
  result.push({ "time": diff, "returned": fn(...argsArr) });
};

const cancel = cancellable(log, args, t);

// Cancel after 190ms
setTimeout(cancel, cancelTimeMs);

setTimeout(() => {
  console.log(result);
  // Output:
  // [
  //   { time: 0, returned: 8 },
  //   { time: 35, returned: 8 },
  //   { time: 70, returned: 8 },
  //   { time: 105, returned: 8 },
  //   { time: 140, returned: 8 },
  //   { time: 175, returned: 8 }
  // ]
}, cancelTimeMs + 50);

```

#### Example 2: Immediate Cancellation

```javascript
const result = [];
const fn = (x) => x + 1;
const args = [10], t = 100, cancelTimeMs = 20;

const log = (...argsArr) => result.push(fn(...argsArr));

const cancel = cancellable(log, args, t);

// Cancel before first interval tick (at 20ms)
setTimeout(cancel, cancelTimeMs);

setTimeout(() => {
  console.log(result);
  // Output: [11] (Only the immediate execution at t=0 ran)
}, 150);

```

---

### Key Takeaways

1. **Immediate Execution:** Unlike standard `setInterval()` (which waits $t\text{ ms}$ before its first call), this problem explicitly requires `fn(...args)` to run immediately at $t = 0\text{ ms}$.
2. **`clearInterval` Mechanics:** Calling `clearInterval(timer)` stops any future executions scheduled by `setInterval`.
3. **Closure Retention:** The returned cancellation function retains access to the `timer` ID via lexical closure.
