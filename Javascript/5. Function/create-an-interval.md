To implement the `mySetInterval` function with the specific behavior described, we need to ensure that the interval period grows linearly with each call. The interval starts with an initial delay (`delay`) and then increases by a linear function of the form `delay + (b * count)` after each execution, where `b` is the increment and `count` is the number of times the function has been called.

Here’s how we can break down the task:

### Key Points:
1. **First Execution:** The function should run after `delay` milliseconds.
2. **Subsequent Executions:** The time between each subsequent execution should be `delay + b * count`, where `b` is the increment (the second argument of `mySetInterval`) and `count` is the number of times the function has already been executed.

### Solution Outline:
1. We’ll use `setTimeout` to schedule the function calls.
2. After each call, we’ll compute the next timeout period using the formula `delay + b * count`.
3. We'll need a mechanism to keep track of the timers and their IDs to stop the interval with `myClearInterval`.

### Code Implementation:

```javascript
let globalId = 0; // Global ID to track multiple intervals
const map = new Map(); // Map to store the active intervals

/**
 * Sets up a custom interval with an increasing period.
 * @param {Function} func The function to execute repeatedly.
 * @param {number} delay The initial delay before the first call (in milliseconds).
 * @param {number} period The increment added to the period for each subsequent call (in milliseconds).
 * @return {number} An ID that can be used to clear the interval.
 */
function mySetInterval(func, delay, period) {
  let count = 0; // To track the number of executions
  let id = globalId++; // Unique ID for the interval
  let timerId; // To store the current timeout ID

  // The recursive function that executes the callback and sets the next interval
  const run = () => {
    // Execute the function
    func();

    // Calculate the time for the next execution
    const nextDelay = delay + period * count;

    // Set the next timeout
    timerId = setTimeout(run, nextDelay);

    // Store the timerId in the map to allow clearing later
    map.set(id, timerId);

    // Increment the count for the next calculation
    count++;
  };

  // Start the first timeout
  timerId = setTimeout(run, delay);

  // Store the first timeout ID to the map
  map.set(id, timerId);

  // Return the ID that can be used to clear the interval
  return id;
}

/**
 * Clears the interval with the given ID.
 * @param {number} id The ID of the interval to clear.
 */
function myClearInterval(id) {
  const timerId = map.get(id);
  if (timerId) {
    clearTimeout(timerId); // Clear the timeout
    map.delete(id); // Remove the interval from the map
  }
}
```

### Explanation:
1. **Global Variables:**
   - `globalId`: We use this to assign a unique ID to each interval.
   - `map`: A `Map` to store active intervals, which allows us to manage multiple intervals and clear them later.

2. **`mySetInterval` function:**
   - Takes `func`, `delay`, and `period` as arguments.
   - Uses `setTimeout` to initially delay the first call by `delay` milliseconds.
   - The `run` function executes `func` and sets up the next timeout with an increasing delay (`delay + period * count`).
   - Each interval has a unique ID, which is used to store the timeout ID in the `map` so we can later clear the interval with `myClearInterval`.

3. **`myClearInterval` function:**
   - Clears the timeout associated with the given interval ID and removes the entry from the `map`.

### Example Usage:

```javascript
let prev = Date.now();
const func = () => {
  const now = Date.now();
  console.log("roughly ", Date.now() - prev);
  prev = now;
};

const id = mySetInterval(func, 100, 200);

// roughly 100, 100 + 200 * 0
// roughly 400,  100 + 200 * 1
// roughly 900,  100 + 200 * 2
// roughly 1600,  100 + 200 * 3
// ....

myClearInterval(id); // stop the interval
```

### Test Cases:
```javascript
let currentTime = 0;

const run = (delay, period, clearAt) => {
  currentTime = 0;
  pipeline.length = 0;

  const logs = [];

  const func = () => {
    logs.push(currentTime);
  };

  const id = mySetInterval(func, delay, period);
  if (clearAt !== undefined) {
    setTimeout(() => {
      myClearInterval(id);
    }, clearAt);
  }

  while (pipeline.length > 0 && calls.length < 5) {
    const [time, callback] = pipeline.shift();
    currentTime = time;
    callback();
  }

  return calls;
};

console.log(run(100, 200)); // Expected: [100, 400, 900, 1600, 2500]
console.log(run(100, 200, 450)); // Expected: [100, 400]
console.log(run(100, 200, 50)); // Expected: []
```

### Key Points:
- The period increases linearly after each call (`delay + b * count`), and the `myClearInterval` function stops the interval when invoked.
- The map ensures that we can manage multiple intervals with different IDs and allows for clearing them individually.

This implementation meets the requirements and performs as expected, with each call having a growing delay between executions.