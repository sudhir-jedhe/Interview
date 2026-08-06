/**
 * Custom implementation of Promise.all()
 * @param {Array} promises - An array of promises or values
 * @return {Promise} A promise that resolves with an array of results or rejects with the first error
 */
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'));
    }

    const results = new Array(promises.length);
    let completedPromises = 0;

    if (promises.length === 0) {
      return resolve(results);
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = value;
          completedPromises++;

          if (completedPromises === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}

// Test cases
console.log('Test 1: All promises resolve');
promiseAll([
  Promise.resolve(3),
  42,
  new Promise(resolve => setTimeout(() => resolve('foo'), 100))
])
  .then(results => console.log('Test 1 results:', results))
  .catch(error => console.error('Test 1 error:', error));

console.log('Test 2: One promise rejects');
promiseAll([
  Promise.resolve(30),
  new Promise((resolve, reject) => setTimeout(() => reject('An error occurred!'), 100))
])
  .then(results => console.log('Test 2 results:', results))
  .catch(error => console.error('Test 2 error:', error));

console.log('Test 3: Empty array');
promiseAll([])
  .then(results => console.log('Test 3 results:', results))
  .catch(error => console.error('Test 3 error:', error));

console.log('Test 4: Non-promise values');
promiseAll([1, 2, 3])
  .then(results => console.log('Test 4 results:', results))
  .catch(error => console.error('Test 4 error:', error));

console.log('Test 5: Mixed promises and values');
promiseAll([
  Promise.resolve(1),
  2,
  new Promise(resolve => setTimeout(() => resolve(3), 100)),
  4
])
  .then(results => console.log('Test 5 results:', results))
  .catch(error => console.error('Test 5 error:', error));

// Helper function for creating a promise that resolves or rejects after a given time
function createTimedPromise(time, shouldResolve, value) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve(value);
      } else {
        reject(value);
      }
    }, time);
  });
}

console.log('Test 6: Promises with different timings');
promiseAll([
  createTimedPromise(100, true, 'Fast'),
  createTimedPromise(500, true, 'Medium'),
  createTimedPromise(200, true, 'Slow')
])
  .then(results => console.log('Test 6 results:', results))
  .catch(error => console.error('Test 6 error:', error));

console.log('Test 7: First promise rejects');
promiseAll([
  createTimedPromise(100, false, 'Fast Rejection'),
  createTimedPromise(500, true, 'Medium'),
  createTimedPromise(200, true, 'Slow')
])
  .then(results => console.log('Test 7 results:', results))
  .catch(error => console.error('Test 7 error:', error));