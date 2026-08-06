The goal is to implement a `sequence()` function that chains multiple async functions together. Each function in the chain should receive the data produced by the previous function, and they should be executed in order. If any function fails (i.e., calls its callback with an error), the entire sequence should stop, and the final callback should be invoked with the error.

### Key Points:
1. **Chaining**: Each async function receives data from the previous one. If `async1` returns `5`, then `async2` will receive `5` as its input.
2. **Error Handling**: If any function produces an error, the sequence should stop immediately, and the error should be passed to the final callback.
3. **Final Callback**: The final callback should be invoked once all functions are executed successfully or if any function encounters an error.

### Solution Approach:
- **Promisify the Async Functions**: Convert the async functions into promises so we can chain them together using `then()`.
- **Loop Over Functions**: We will loop over the functions and pass the result of each function to the next one.
- **Error Handling**: If an error occurs, it will immediately stop the sequence, and the callback will be invoked with the error.

### Step-by-Step Solution:

We'll implement `sequence()` using several approaches to illustrate different styles of handling asynchronous flows. Here's the implementation:

### Approach 1: Using Promises
We will create a starter promise and chain subsequent promises with `then()`. If any function returns an error, we will stop the chain and return the error.

```javascript
/**
 * @param {AsyncFunc[]} funcs - Array of asynchronous functions
 * @return {(callback: Callback) => void} - Returns a function that takes a final callback
 */
function promisify(func, input) {
  return new Promise((resolve, reject) => {
    func((err, data) => {
      if (err) {
        reject(err); // Reject if error
      } else {
        resolve(data); // Resolve with data
      }
    }, input);
  });
}

function sequence(funcs) {
  return function(finalCallback, initialData) {
    // Start with a resolved promise with the initial data
    const starterPromise = Promise.resolve(initialData);

    // Reduce the functions to chain the promises
    const finalPromise = funcs.reduce((accumlatorPromise, currentFn) => {
      return accumlatorPromise.then(data => {
        return promisify(currentFn, data); // Chain each function
      }).catch(err => {
        return Promise.reject(err); // If any function errors out, reject
      });
    }, starterPromise);

    // Handle the final result or error
    finalPromise
      .then(data => finalCallback(undefined, data))
      .catch(err => finalCallback(err, undefined));
  };
}
```

### Explanation:
1. **`promisify(func, input)`**: Converts an async function into a promise. This is necessary because async functions use the callback pattern (`(callback) => {...}`), and we need promises to chain them.
2. **`sequence(funcs)`**: This is the main function that chains the async functions together using promises.
   - We start with a resolved promise (`Promise.resolve(initialData)`) that holds the initial data.
   - We then use `.reduce()` to iterate over the functions in `funcs` and chain them. Each promise resolves the data and passes it to the next function.
   - If any function encounters an error, it will immediately reject the promise, and the final callback will be invoked with the error.
   - Once all promises are resolved, the final callback is invoked with the result.

### Example Usage:

```javascript
const asyncTimes2 = (callback, num) => {
  setTimeout(() => callback(null, num * 2), 100);
};

const asyncTimes4 = sequence([
  asyncTimes2,
  asyncTimes2
]);

asyncTimes4((error, data) => {
  console.log(data); // Output: 4
}, 1);
```

### Explanation of Example:
1. `asyncTimes2` multiplies the number by 2. The `sequence` function chains two `asyncTimes2` functions.
2. The input `1` is passed through the first `asyncTimes2`, resulting in `2`. This result is then passed to the second `asyncTimes2`, resulting in `4`.
3. The final callback is called with the result `4`.

### Approach 2: Using `async/await` and `try/catch`
This is a modern approach where we use `async` functions and `await` to simplify the chaining process. If an error occurs, we can handle it with `try/catch`.

```javascript
async function sequence(funcs) {
  return async function(callback, initialData) {
    let data = initialData;
    try {
      for (let func of funcs) {
        data = await promisify(func, data); // Wait for each function to complete
      }
      callback(undefined, data); // Success: Return the final data
    } catch (err) {
      callback(err, undefined); // Error: Call callback with error
    }
  };
}
```

### Explanation:
1. **`promisify(func, input)`**: Same as in Approach 1.
2. **`sequence(funcs)`**: This approach uses `async/await` to make the code more readable. The `for` loop iterates over each function in the `funcs` array.
   - For each function, `await` waits for the function to finish before proceeding to the next.
   - If any function throws an error, the `catch` block is executed, and the error is passed to the callback.

### Example Usage:

```javascript
const asyncTimes2 = (callback, num) => {
  setTimeout(() => callback(null, num * 2), 100);
};

const asyncTimes4 = sequence([
  asyncTimes2,
  asyncTimes2
]);

asyncTimes4((error, data) => {
  console.log(data); // Output: 4
}, 1);
```

### Approach 3: Using Callback Recursion
In this approach, we directly use callbacks and recursion to handle the chaining of functions. We process the functions one by one, passing the result of each to the next.

```javascript
function sequence(funcs) {
  return function(callback, initialData) {
    let index = 0;

    function next(data) {
      if (index === funcs.length) {
        return callback(undefined, data); // All functions completed successfully
      }

      const currentFunc = funcs[index++];
      currentFunc((err, result) => {
        if (err) {
          return callback(err, undefined); // Error: Stop and pass it to callback
        }
        next(result); // Recursively call the next function with the result
      }, data);
    }

    next(initialData); // Start the chain with initial data
  };
}
```

### Explanation:
1. **`sequence(funcs)`**: This version uses recursion to sequentially call the functions. The `next()` function recursively calls the next async function with the result of the previous one.
2. **Error Handling**: If any function returns an error, it immediately stops the recursion and invokes the callback with the error.

### Conclusion:
The `sequence()` function successfully chains multiple asynchronous functions together by passing the result from one function to the next, handling errors properly, and invoking the final callback when all functions complete (or when an error occurs). We presented three different implementations using promises, `async/await`, and callback recursion to demonstrate various ways of achieving this.