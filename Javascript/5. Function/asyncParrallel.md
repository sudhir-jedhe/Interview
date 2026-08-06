The goal here is to implement the `parallel()` function, which will execute an array of asynchronous functions in parallel, and trigger a final callback once all of them are done (or if any function fails).

### Key Requirements:
1. **Execute functions concurrently** (not sequentially).
2. **Return a new function** that takes a final callback.
3. **Handle errors**: If any of the functions fail, immediately call the final callback with the error.
4. **Return results**: If all functions succeed, call the final callback with the results in the same order as the functions were passed in.

Here's a detailed breakdown of how we can implement this:

### Approach:
1. **Initialize a Result Array**: To store the results of the asynchronous functions.
2. **Track Errors**: If any async function results in an error, stop processing and return the error.
3. **Check Completion**: After each async function finishes, check if all functions are complete. If so, invoke the callback with the results.
4. **Ensure Order**: Since the functions run in parallel, we need to ensure that the results are passed back in the correct order, irrespective of the order of execution.

### Solution Code:

```javascript
/**
 * @param {AsyncFunc[]} funcs - Array of asynchronous functions
 * @return {(callback: Callback) => void} - Returns a function that takes a final callback
 */
function parallel(funcs) {
  return function (callback, data) {
    let results = [];
    let errorOccurred = false;
    let completed = 0;

    // Iterate through all the async functions
    funcs.forEach((func, index) => {
      // Call each async function
      func(function (err, result) {
        if (errorOccurred) return; // If an error has occurred, ignore further executions

        if (err) {
          // If an error occurs, set the error flag and call the callback
          errorOccurred = true;
          callback(err, undefined);
          return;
        }

        // Store the result in the correct index
        results[index] = result;
        completed++;

        // If all functions have completed, call the final callback
        if (completed === funcs.length) {
          callback(undefined, results);
        }
      }, data); // Pass the data to the async function
    });
  };
}

// Example async functions
const async1 = (callback) => {
  setTimeout(() => {
    callback(undefined, 1);
  }, 100);
};

const async2 = (callback) => {
  setTimeout(() => {
    callback(undefined, 2);
  }, 50);
};

const async3 = (callback) => {
  setTimeout(() => {
    callback(undefined, 3);
  }, 200);
};

// Example of using the parallel function
const all = parallel([async1, async2, async3]);

// Call the final callback when all async functions are done
all((error, data) => {
  if (error) {
    console.log("Error:", error);
  } else {
    console.log("Data:", data); // [1, 2, 3] (order should be preserved)
  }
});
```

### Explanation:

1. **parallel(funcs)**: This function accepts an array of asynchronous functions (`funcs`) and returns a function that expects a final callback (`callback`) and some data (`data`).
   - **Error Handling**: The `errorOccurred` flag ensures that if any function fails (calls the callback with an error), we stop further execution and immediately invoke the final callback with the error.
   - **Results Collection**: We use the `results` array to store the results of each asynchronous function in the order they were passed.
   - **Completion Check**: After each async function completes, we increment the `completed` counter. Once it equals the length of the `funcs` array, we call the final callback with the accumulated results.

2. **Example Async Functions**: 
   - `async1`, `async2`, and `async3` are simulated asynchronous functions with varying delays using `setTimeout`.
   - These functions call the provided callback with some result once they finish executing.

3. **Using parallel**: We pass an array of the async functions (`async1`, `async2`, `async3`) to the `parallel()` function, which returns a new function (`all`). 
   - When we call `all`, it triggers all async functions in parallel and waits for all of them to complete. Once they're done (or if any fail), the provided callback is called with either the results or the error.

### Example Output:

```javascript
Data: [1, 2, 3]
```

- Even though the async functions are executed in parallel, the results are returned in the same order that they were passed to the `parallel()` function.
- The callback is triggered with the final array of results, `[1, 2, 3]`.

### Edge Case:
If any async function encounters an error, the `callback` will be called immediately with the error, and no further results will be processed.

### Conclusion:
This implementation ensures that the async functions are run in parallel, handles errors efficiently, and ensures the order of results is preserved. This is a straightforward implementation of `Promise.all` using the callback-based pattern.