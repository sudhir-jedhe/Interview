To implement the `race()` function, we need to create a helper that behaves like `Promise.race()`. The key characteristic of `Promise.race()` is that it resolves or rejects as soon as the first promise (or async function in this case) resolves or rejects. 

### Requirements:
1. **First to Finish**: `race()` should return a result (either data or error) from the first async function that completes.
2. **Error Handling**: If any function results in an error, the `race()` should immediately return that error and ignore subsequent results (whether they are successful or failed).
3. **Return a new function**: The function returned by `race()` should accept a callback (`callback`), which will be invoked when any async function completes (either with an error or success).

### Solution Approach:
- We'll iterate over the functions in the `funcs` array.
- We'll execute each function, and in the callback of each function:
  - If the function completes without an error, immediately invoke the `callback` with the result.
  - If any function encounters an error, we immediately invoke the `callback` with the error.
- Once the `callback` is called (either due to a result or an error), we ensure that no further calls are made by setting a `completed` flag.

### Final Implementation:

```javascript
/**
 * @param {AsyncFunc[]} funcs - Array of asynchronous functions
 * @return {(callback: Callback) => void} - Returns a function that takes a final callback
 */
function race(funcs) {
  let completed = false;

  return function (callback) {
    funcs.forEach((func) => {
      func((error, value) => {
        // If the race is already complete (either by success or error), do nothing
        if (completed) return;

        if (error) {
          // If any function results in an error, return that error immediately
          callback(error, undefined);
          completed = true; // Mark as completed to prevent further calls
          return;
        }

        // If the function completes successfully, return its result
        callback(undefined, value);
        completed = true; // Mark as completed to prevent further calls
      });
    });
  };
}

// Example async functions with different delays
const async1 = (callback) => {
  setTimeout(() => callback(undefined, 1), 300);
};

const async2 = (callback) => {
  setTimeout(() => callback(undefined, 2), 100);
};

const async3 = (callback) => {
  setTimeout(() => callback(undefined, 3), 200);
};

// Example usage of race function
const first = race([async1, async2, async3]);

first((error, data) => {
  console.log(data); // 2, since 2 is the first to be given
});
```

### Explanation:
1. **`completed` flag**: This ensures that once the first function finishes (either with a result or error), we prevent the `callback` from being called again.
2. **`forEach` loop**: We iterate over each function in the `funcs` array and call them. If any function finishes (either successfully or with an error), we immediately call the `callback` with the result or error, and mark the race as completed.
3. **Error Handling**: If any function triggers an error, we immediately invoke the callback with that error and stop further execution of any remaining async functions.

### Example Output:
Given the example async functions:
```javascript
const async1 = (callback) => {
  setTimeout(() => callback(undefined, 1), 300);
};

const async2 = (callback) => {
  setTimeout(() => callback(undefined, 2), 100);
};

const async3 = (callback) => {
  setTimeout(() => callback(undefined, 3), 200);
};
```

The `race()` function will return the first result to complete. Since `async2` completes in 100ms, the output will be:

```
2
```

If an error occurs in any function (for example, `async2` encounters an error), the callback will immediately be invoked with that error, and no further results will be processed.

### Edge Cases:
1. **All functions succeed**: The first one to complete should return its result.
2. **Error Handling**: If any function encounters an error, it should immediately return that error, and other functions' results (whether successful or not) should be ignored.
3. **Empty Function Array**: If the `funcs` array is empty, no function will be executed. It’s up to the user to decide what behavior they expect in this case, but typically, we'd assume at least one function should be passed.

### Conclusion:
This implementation of `race()` efficiently handles concurrent asynchronous tasks, making it behave similarly to `Promise.race()`. It ensures that the result from the first completed function is returned, and if any function encounters an error, it immediately halts further execution and returns that error.