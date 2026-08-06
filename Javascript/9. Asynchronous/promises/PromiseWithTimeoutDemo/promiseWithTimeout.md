Implement a function that resolves a promise if it is fulfilled within a timeout period and rejects otherwise
```js
function promiseWithTimeout(promise, timeoutMs) {
    return new Promise((resolve, reject) => {
      // Create a timeout to reject the promise if not resolved quickly enough
      const timeoutId = setTimeout(() => {
        reject(new Error(`Promise timed out after ${timeoutMs}ms`));
      }, timeoutMs);
  
      // Attach handlers to the original promise 
      promise.then(resolve, reject);  // Pass through success/error
  
      // Important: Clear timeout on original promise resolution/rejection
      .finally(() => clearTimeout(timeoutId));
    });
  }

  const delayedPromise = new Promise(resolve => {
    setTimeout(() => resolve('Success!'), 1500); 
  });
  
  promiseWithTimeout(delayedPromise, 2000) 
    .then(value => console.log(value))      // Output: 'Success!'
    .catch(error => console.error(error));   
  
  promiseWithTimeout(delayedPromise, 500)    
    .then(value => console.log(value))      
    .catch(error => console.error(error));  /