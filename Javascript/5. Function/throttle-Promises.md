### Throttling Promises

The idea behind throttling API calls is to limit the number of concurrent requests that can be sent to the server at a time, which helps in reducing the load on servers, especially for systems with low specifications.

You can throttle API calls by processing a set of promises in batches and waiting for the results of the current batch before processing the next batch. Here's how you can achieve this:

### **General Throttling of Promises**

The `throttlePromises` function receives an array of functions that return promises (`funcs`) and a `max` value which specifies the maximum number of concurrent promises that can be executed at any given time.

Below is a **simplified** and **clean** approach using `async/await`:

```javascript
async function throttlePromises(funcs, max) {
  const results = []; // Store the results of all promises
  while (funcs.length) {
    // Process up to `max` promises concurrently
    const values = await Promise.all(funcs.splice(0, max).map((f) => f()));
    results.push(...values); // Add results to the final array
  }
  return results; // Return the aggregated results
}
```

#### Explanation:
1. **`while (funcs.length)`**: This ensures that we process all the functions in the `funcs` array.
2. **`Promise.all(funcs.splice(0, max).map((f) => f()))`**: 
   - We process up to `max` promises at the same time.
   - We `splice` the first `max` functions from the array and invoke them.
3. **`results.push(...values)`**: The resolved values are pushed into the `results` array.
4. **Return** the final aggregated results after all the promises are resolved.

### **Example Usage:**

```javascript
// Example functions that return promises (representing API calls)
const callApi1 = () => new Promise(resolve => setTimeout(() => resolve('API 1 response'), 500));
const callApi2 = () => new Promise(resolve => setTimeout(() => resolve('API 2 response'), 300));
const callApi3 = () => new Promise(resolve => setTimeout(() => resolve('API 3 response'), 1000));
const callApi4 = () => new Promise(resolve => setTimeout(() => resolve('API 4 response'), 700));
const callApi5 = () => new Promise(resolve => setTimeout(() => resolve('API 5 response'), 200));
const callApi6 = () => new Promise(resolve => setTimeout(() => resolve('API 6 response'), 600));

const callApis = [callApi1, callApi2, callApi3, callApi4, callApi5, callApi6];

// Throttle promises with a maximum of 3 concurrent requests
throttlePromises(callApis, 3)
  .then(data => console.log(data))  // All responses after throttling
  .catch(err => console.error(err));
```

### **Throttling with a Cancel Method**

Sometimes, you may want to **throttle function calls** to avoid rapid repetitive executions, and you might want to **cancel** a pending throttle if needed.

Here's a **throttle function** with a cancel method:

```javascript
function throttle(func, delay) {
  let timer;

  function throttledFunction() {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(func, delay); // Execute after a certain delay
  }

  throttledFunction.cancel = function() {
    clearTimeout(timer); // Cancel the throttle
  };

  return throttledFunction;
}

// Example usage:
const throttledFunction = throttle(() => {
  console.log('Function throttled!');
}, 1000);

throttledFunction();  // Logs 'Function throttled!'
throttledFunction();  // Does not log anything, because the function is throttled

// Cancel the throttled function:
throttledFunction.cancel(); 

// Now the function can be called again:
throttledFunction();  // Logs 'Function throttled!'
```

#### Explanation of Throttle with Cancel:
1. **`setTimeout(func, delay)`**: The function is throttled and will execute after the specified delay.
2. **`cancel()`**: Clears the pending timeout, preventing the function from executing.
3. **Usage**: After calling `throttledFunction()`, if another call happens within the delay time, the previous one will be cleared and reset. You can call `throttledFunction.cancel()` to cancel any pending executions.

### **Throttling with a More Advanced Version (with Last Call)**

In some cases, you might want the function to execute immediately on the first call, then throttle subsequent calls. Here's an implementation that works with the last call logic:

```javascript
function throttle(func, interval) {
  let timeoutId;
  let lastArgs;
  let lastTime = 0;
  let shouldCallNow = false;

  function throttled(...args) {
      const now = Date.now();

      if (!timeoutId && !shouldCallNow) {
          shouldCallNow = true;
          func.apply(this, args); // Execute immediately
          lastTime = now;
      } else {
          lastArgs = args;
          const remaining = lastTime + interval - now;
          if (remaining <= 0) {
              clearTimeout(timeoutId);
              timeoutId = null;
              lastTime = now;
              func.apply(this, lastArgs); // Execute if time has passed
          } else if (!timeoutId) {
              timeoutId = setTimeout(() => {
                  timeoutId = null;
                  lastTime = Date.now();
                  func.apply(this, lastArgs); // Execute after remaining time
              }, remaining);
          }
      }
  }

  // Method to cancel the throttle
  throttled.cancel = function() {
      clearTimeout(timeoutId);
      timeoutId = null;
      shouldCallNow = false;
  };

  return throttled;
}

// Example usage:
function sayHello(name) {
  console.log(`Hello, ${name}!`);
}

const throttledHello = throttle(sayHello, 1000);

throttledHello('Alice'); // This will execute immediately
throttledHello('Bob');   // This will be ignored (throttled)
throttledHello('Charlie'); // This will be ignored (throttled)

setTimeout(() => throttledHello('Dave'), 500); // This will be ignored (throttled)

// Cancel the pending execution
throttledHello.cancel();

// No function will be executed after cancellation
throttledHello('Eve'); // This will execute immediately
```

#### Key Points:
- **Immediate Execution**: The first call is executed immediately, subsequent calls are throttled.
- **Timeout Handling**: A timeout ensures that the function is executed after a specific interval.
- **Cancel Method**: Allows you to cancel the throttling, effectively stopping further executions.

### Conclusion

- **Throttle Promises** helps limit concurrent executions, which is useful for avoiding overloading servers.
- **Throttle Functions** are useful to control how often a function is invoked, particularly for events like scrolling, resizing, or rapid user input.
