function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      reject(new TypeError("Promises must be provided as an array."));
      return;
    }

    const results = [];
    let completedPromises = 0;

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((result) => {
          results[index] = result;
          completedPromises++;

          if (completedPromises === promises.length) {
            resolve(results);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

    // If the input array is empty, resolve immediately
    if (promises.length === 0) {
      resolve(results);
    }
  });
}

// Test cases
const promise1 = new Promise((resolve) =>
  setTimeout(() => resolve("Promise 1 resolved"), 1000)
);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve("Promise 2 resolved"), 500)
);
const promise3 = new Promise((resolve) =>
  setTimeout(() => resolve("Promise 3 resolved"), 200)
);

console.log("Testing custom promiseAll:");
promiseAll([promise1, promise2, promise3])
  .then((results) => {
    console.log("Custom promiseAll resolved:", results);
  })
  .catch((error) => {
    console.log("Custom promiseAll rejected:", error);
  });

console.log("\nTesting native Promise.all:");
Promise.all([promise1, promise2, promise3])
  .then((results) => {
    console.log("Native Promise.all resolved:", results);
  })
  .catch((error) => {
    console.log("Native Promise.all rejected:", error);
  });

// Test with an empty array
console.log("\nTesting with an empty array:");
promiseAll([])
  .then((results) => {
    console.log("Custom promiseAll (empty array) resolved:", results);
  })
  .catch((error) => {
    console.log("Custom promiseAll (empty array) rejected:", error);
  });

// Test with a rejected promise
const rejectedPromise = Promise.reject("Rejected promise");
console.log("\nTesting with a rejected promise:");
promiseAll([promise1, rejectedPromise, promise3])
  .then((results) => {
    console.log("Custom promiseAll (with rejection) resolved:", results);
  })
  .catch((error) => {
    console.log("Custom promiseAll (with rejection) rejected:", error);
  });