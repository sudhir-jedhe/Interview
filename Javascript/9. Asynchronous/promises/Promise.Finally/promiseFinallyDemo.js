// Polyfill for Promise.prototype.finally
if (!Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    if (typeof callback !== 'function') {
      return this.then(callback, callback);
    }
    // Get the current promise or a new one
    const P = this.constructor || Promise;
    
    // Return the promise and call the callback function
    return this.then(
      value => P.resolve(callback()).then(() => value),
      err => P.resolve(callback()).then(() => { throw err; })
    );
  };
}

// Helper function to create a promise that resolves or rejects after a delay
function createPromise(value, delay, shouldReject = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldReject) {
        reject(value);
      } else {
        resolve(value);
      }
    }, delay);
  });
}

// Test cases
console.log('Test 1: Promise resolves');
createPromise('Success', 1000)
  .then(result => console.log('Then:', result))
  .finally(() => console.log('Finally: This runs regardless of success or failure'))
  .then(() => console.log('Test 1 completed'));

console.log('\nTest 2: Promise rejects');
createPromise('Error', 1500, true)
  .then(result => console.log('Then:', result))
  .catch(error => console.log('Catch:', error))
  .finally(() => console.log('Finally: This runs regardless of success or failure'))
  .then(() => console.log('Test 2 completed'));

console.log('\nTest 3: Finally throws an error');
createPromise('Success', 2000)
  .finally(() => {
    console.log('Finally: Throwing an error');
    throw new Error('Error from finally');
  })
  .then(result => console.log('Then:', result))
  .catch(error => console.log('Catch:', error.message))
  .then(() => console.log('Test 3 completed'));

console.log('\nTest 4: Finally returns a promise');
createPromise('Initial success', 2500)
  .finally(() => {
    console.log('Finally: Returning a new promise');
    return new Promise(resolve => setTimeout(() => {
      console.log('New promise resolved');
      resolve();
    }, 1000));
  })
  .then(result => console.log('Then:', result))
  .then(() => console.log('Test 4 completed'));