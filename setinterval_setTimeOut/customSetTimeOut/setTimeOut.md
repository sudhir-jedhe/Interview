```js
function customTimeout(callback, delay) {
  // Return a new promise
  return new Promise((resolve, reject) => {
    // Validate inputs
    if (typeof callback !== "function") {
      return reject(new TypeError("Callback must be a function"));
    }
    if (typeof delay !== "number" || delay < 0) {
      return reject(new TypeError("Delay must be a non-negative number"));
    }

    // Set a timeout to execute the callback
    const timeoutId = setTimeout(() => {
      try {
        const result = callback(); // Call the provided callback
        resolve(result); // Resolve with the result
      } catch (error) {
        reject(error); // Reject if the callback throws an error
      }
    }, delay);

    // Return a function to clear the timeout
    return () => clearTimeout(timeoutId);
  });
}

// Example usage
const timeoutFunction = customTimeout(() => {
  console.log("Executed after delay");
  return "Success!";
}, 2000);

// Handle the promise
timeoutFunction
  .then((result) => {
    console.log("Callback result:", result);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// Optional: If you need to cancel the timeout
const cancelTimeout = timeoutFunction();
setTimeout(() => {
  cancelTimeout(); // Cancel the timeout after 1 second
  console.log("Timeout canceled before execution");
}, 1000);

/************************ */

function customSetTimeout(callback, delay) {
  return new Promise((resolve, reject) => {
    // Input validation
    if (typeof callback !== "function") {
      return reject(new TypeError("Callback must be a function"));
    }
    if (typeof delay !== "number" || delay < 0) {
      return reject(new TypeError("Delay must be a non-negative number"));
    }

    // Set the timeout
    const timeoutId = setTimeout(() => {
      try {
        const result = callback(); // Execute the callback
        resolve(result); // Resolve the promise with the result
      } catch (error) {
        reject(error); // Reject if the callback throws an error
      }
    }, delay);

    // Return a cancellation function
    return () => clearTimeout(timeoutId);
  });
}

// Example usage
const timeoutFunction = customSetTimeout(() => {
  console.log("Executed after delay");
  return "Success!";
}, 2000);

// Handle the promise
timeoutFunction
  .then((result) => {
    console.log("Callback result:", result);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// Optional: Cancel the timeout
const cancelTimeout = timeoutFunction(); // Call to get the cancel function
setTimeout(() => {
  cancelTimeout(); // Cancel the timeout after 1 second
  console.log("Timeout canceled before execution");
}, 1000);
```
