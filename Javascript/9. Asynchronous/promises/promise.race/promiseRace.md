/*************************User Implement custom promise.race ************************ */
```js
function myPromiseRace(promises) {
    return new Promise((resolve, reject) => {
      // Iterate through the promises
      for (const promise of promises) {
        // Ensure each element is a Promise
        Promise.resolve(promise)
          .then((value) => {
            // Resolve with the first settled promise's value
            resolve(value);
          })
          .catch((error) => {
            // Reject with the first settled promise's error
            reject(error);
          });
      }
    });
  }
  
  // Example usage:
  
  const promise1 = new Promise((resolve) =>
    setTimeout(() => resolve("Promise 1"), 1000)
  );
  const promise2 = new Promise((resolve) =>
    setTimeout(() => resolve("Promise 2"), 500)
  );
  const promise3 = new Promise((_, reject) =>
    setTimeout(() => reject("Promise 3"), 800)
  );
  
  myPromiseRace([promise1, promise2, promise3])
    .then((result) => console.log("Resolved:", result))
    .catch((error) => console.error("Rejected:", error));