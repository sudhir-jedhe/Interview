// Custom implementation of Promise.allSettled()
function customAllSettled(promises) {
  return Promise.all(promises.map(p => Promise.resolve(p).then(
    value => ({ status: 'fulfilled', value }),
    reason => ({ status: 'rejected', reason })
  )));
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

// Test promises
const promises = [
  createPromise('Quick success', 100),
  createPromise('Slow failure', 300, true),
  createPromise('Slow success', 200),
  'Not a promise',
  createPromise('Quick failure', 50, true)
];

// Using built-in Promise.allSettled()
console.log('Using built-in Promise.allSettled():');
Promise.allSettled(promises)
  .then(results => {
    console.log(JSON.stringify(results, null, 2));
  });

// Using custom implementation
console.log('\nUsing custom implementation:');
customAllSettled(promises)
  .then(results => {
    console.log(JSON.stringify(results, null, 2));
  });

// Comparing with Promise.all() for contrast
console.log('\nUsing Promise.all() for comparison:');
Promise.all(promises)
  .then(results => {
    console.log('This will not be reached due to rejection');
  })
  .catch(error => {
    console.log('Promise.all() rejected with:', error);
  });

