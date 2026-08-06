function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises) || promises.length === 0) {
      reject(new AggregateError([], 'No promises were passed'));
      return;
    }

    let rejectedCount = 0;
    const errors = new Array(promises.length);

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(resolve)
        .catch((error) => {
          errors[index] = error;
          rejectedCount++;
          if (rejectedCount === promises.length) {
            reject(new AggregateError(errors, 'All promises were rejected'));
          }
        });
    });
  });
}

// Test case 1: At least one promise resolves
console.log("Test case 1: At least one promise resolves");
const test1 = new Promise((resolve) => setTimeout(resolve, 100, 'one'));
const test2 = new Promise((resolve, reject) => setTimeout(reject, 200, 'two'));
const test3 = new Promise((resolve) => setTimeout(resolve, 300, 'three'));

promiseAny([test1, test2, test3])
  .then((value) => console.log('Resolved:', value))
  .catch((error) => console.error('Caught:', error));

// Test case 2: All promises reject
console.log("\nTest case 2: All promises reject");
const test4 = new Promise((resolve, reject) => setTimeout(reject, 100, 'four'));
const test5 = new Promise((resolve, reject) => setTimeout(reject, 200, 'five'));
const test6 = new Promise((resolve, reject) => setTimeout(reject, 300, 'six'));

promiseAny([test4, test5, test6])
  .then((value) => console.log('Resolved:', value))
  .catch((error) => console.error('Caught:', error));

// Test case 3: Empty array of promises
console.log("\nTest case 3: Empty array of promises");
promiseAny([])
  .then((value) => console.log('Resolved:', value))
  .catch((error) => console.error('Caught:', error));

// Test case 4: Non-promise values in the array
console.log("\nTest case 4: Non-promise values in the array");
promiseAny([Promise.resolve(1), 2, Promise.reject(3)])
  .then((value) => console.log('Resolved:', value))
  .catch((error) => console.error('Caught:', error));