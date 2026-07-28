```js
************************User Implement custom SetInterval ************************ */

function createSetIntervalPolyfill() {
  // closure
  var intervalID = 0;
  var intervalMap = {};

  function setIntervalPolyfill(callbackFn, delay = 0, ...args) {
    if (typeof callbackFn !== "function") {
      throw new TypeError("'callback' should be a function");
    }

    // Unique
    var id = intervalID++;

    function repeat() {
      intervalMap[id] = setTimeout(() => {
        callbackFn(...args);
        // Terminating
        if (intervalMap[id]) {
          repeat();
        }
      }, delay);
    }
    repeat();

    return id;
  }

  function clearIntervalPolyfill(intervalID) {
    clearTimeout(intervalMap[intervalID]);
    delete intervalMap[intervalID];
  }

  return {
    setIntervalPolyfill,
    clearIntervalPolyfill,
  };
}

const { setIntervalPolyfill, clearIntervalPolyfill } =
  createSetIntervalPolyfill();

let counter = 0;
let intervalID;

function greeting(name) {
  counter++;
  console.log("Hello", name);
  if (counter >= 3) {
    clearIntervalPolyfill(intervalID);
  }
}

intervalID = setIntervalPolyfill("", 1000, "Yomesh");


/*************************************** */

function customSetInterval(callback, interval) {
  return new Promise((resolve, reject) => {
      // Input validation
      if (typeof callback !== 'function') {
          return reject(new TypeError('Callback must be a function'));
      }
      if (typeof interval !== 'number' || interval <= 0) {
          return reject(new TypeError('Interval must be a positive number'));
      }

      // Track the interval ID
      const intervalId = setInterval(() => {
          try {
              const result = callback(); // Execute the callback
              if (result === false) {
                  // If the callback returns false, stop the interval
                  clearInterval(intervalId);
                  resolve('Interval stopped by callback return value.');
              }
          } catch (error) {
              clearInterval(intervalId); // Stop on error
              reject(error);
          }
      }, interval);

      // Return a cancellation function
      return () => clearInterval(intervalId);
  });
}

// Example usage
const stopInterval = customSetInterval(() => {
  console.log('Executing at interval');
  // Stop the interval after 5 executions
  count++;
  if (count >= 5) {
      return false; // Return false to stop the interval
  }
}, 1000);

// Handle the promise
stopInterval
  .then(message => {
      console.log(message); // Log when interval is stopped
  })
  .catch(error => {
      console.error('Error:', error);
  });

// Variable to count executions
let count = 0;

// Optional: Manual canceling
setTimeout(() => {
  stopInterval(); // Cancel the interval after 3 seconds
  console.log('Interval canceled manually');
}, 3000);
```
