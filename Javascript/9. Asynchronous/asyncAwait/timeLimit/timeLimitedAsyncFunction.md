To implement the **time-limited asynchronous function**, we need to create a higher-order function that wraps around any asynchronous function, and ensures it completes within the given time limit. If the function exceeds the specified time limit, it should be rejected with the message `"Time Limit Exceeded"`.

Here's how to implement the `timeLimit` function and also handle the example use cases.

### **Implementation of `timeLimit`**

```javascript
// timeLimit.js
export function timeLimit(asyncFunc, timeLimit) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      // Set a timeout that will reject the promise after the given time limit
      const timeoutId = setTimeout(() => {
        reject("Time Limit Exceeded");
      }, timeLimit);

      // Execute the async function
      asyncFunc(...args)
        .then((result) => {
          // Clear the timeout and resolve with the result
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch((error) => {
          // Clear the timeout and reject with the error
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  };
}
```

### **Explanation**
- The `timeLimit` function takes an asynchronous function (`asyncFunc`) and a `timeLimit` (in milliseconds) as parameters.
- It returns a new function that wraps the original asynchronous function.
- Inside the returned function, a **timeout** is set using `setTimeout`, which will reject the promise with `"Time Limit Exceeded"` if the task takes longer than the specified time limit.
- If the `asyncFunc` finishes within the time limit, the timeout is cleared and the result of the asynchronous function is returned.
- If the `asyncFunc` fails (e.g., throws an error), the timeout is cleared and the error is passed to the `reject` function.

### **Example Use Cases**

#### Example 1: Task Exceeds Time Limit

```javascript
import { timeLimit } from './timeLimit.js';

const timeLimitedFn = timeLimit(async (n) => {
  await new Promise((res) => setTimeout(res, 100)); // Simulating a delay
  return n * n;
}, 50);  // Time limit is 50ms

timeLimitedFn(5)
  .then((result) => console.log(result))
  .catch((err) => console.log(err));  // Output: "Time Limit Exceeded"
```

In this example, the task completes in 100ms, which exceeds the time limit of 50ms, and therefore the promise is rejected with `"Time Limit Exceeded"`.

#### Example 2: Task Completes Within Time Limit

```javascript
import { timeLimit } from './timeLimit.js';

const timeLimitedFn = timeLimit(async (n) => {
  await new Promise((res) => setTimeout(res, 100)); // Simulating a delay
  return n * n;
}, 150);  // Time limit is 150ms

timeLimitedFn(5)
  .then((result) => console.log(result))  // Output: 25
  .catch((err) => console.log(err));
```

In this example, the task completes in 100ms, which is within the time limit of 150ms, so it returns `25`.

#### Example 3: Multiple Parameters

```javascript
import { timeLimit } from './timeLimit.js';

const timeLimitedFn = timeLimit(async (a, b) => {
  await new Promise((res) => setTimeout(res, 120)); // Simulating a delay
  return a + b;
}, 150);  // Time limit is 150ms

timeLimitedFn(5, 10)
  .then((result) => console.log(result))  // Output: 15
  .catch((err) => console.log(err));
```

Here, the task completes in 120ms, which is within the 150ms time limit, so the result is `15`.

#### Example 4: Task Throws an Error

```javascript
import { timeLimit } from './timeLimit.js';

const timeLimitedFn = timeLimit(async () => {
  throw "Error";
}, 1000);  // Time limit is 1000ms

timeLimitedFn()
  .then((result) => console.log(result))
  .catch((err) => console.log(err));  // Output: "Error"
```

In this example, the asynchronous function throws an error, which gets caught and passed to the `reject` handler, resulting in `"Error"` being logged.

### **Final Notes**

- **Timeout Handling**: We use `clearTimeout` to ensure that the timeout is cleared once the asynchronous operation is complete (either successfully or with an error).
- **Flexibility**: The `timeLimit` function works with any asynchronous function that returns a promise, and it will correctly handle multiple arguments passed to the original function.
- **Error Propagation**: If the asynchronous function throws an error (like in Example 4), that error is propagated through the `catch` handler.

By using `timeLimit`, you can wrap any async function and limit the time it takes to execute, which is especially useful when dealing with network requests or tasks where long execution times can negatively affect user experience.