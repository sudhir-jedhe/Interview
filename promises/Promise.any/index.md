// Promise.any() takes an iterable of Promise objects. It returns a single
// promise that fulfills as soon as any of the promises in the iterable
// fulfills, with the value of the fulfilled promise. If no promises in the
// iterable fulfill (if all of the given promises are rejected), then the
// returned promise is rejected with an AggregateError, a new subclass of Error
// that groups together individual errors.

// In simple terms Promise.any() is just opposite of Promise.all().

// Function takes an array of promises as input and returns a new promise. The
// returned promise is resolved as soon as any of the input promises resolves.
// Else if all of the input promises are rejected then the returned promise is
// rejected with the array of all the input promises reasons.
```js
const any = function (promisesArray) {
  const promiseErrors = new Array(promisesArray.length);
  let counter = 0;

  //return a new promise
  return new Promise((resolve, reject) => {
    promisesArray.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(resolve) // resolve, when any of the input promise resolves
        .catch((error) => {
          promiseErrors[index] = error;
          counter = counter + 1;
          if (counter === promisesArray.length) {
            // all promises rejected, reject outer promise
            reject(promiseErrors);
          }
        }); // reject, when any of the input promise rejects
    });
  });
};

/************************************ */
function PromiseAny(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      promise.then(resolve).catch(reject);
    });
  });
}

// Example usage:
const promises = [
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Promise 1 resolved");
    }, 1000);
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Promise 2 resolved");
    }, 2000);
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("Promise 3 rejected");
    }, 3000);
  }),
];

PromiseAny(promises)
  .then((result) => {
    console.log(result); // "Promise 1 resolved"
  })
  .catch((error) => {
    console.error(error); // "Promise 3 rejected"
  });

//   In this example, we create an array of three promises, each of which
// resolves or rejects after a different amount of time. We then pass this array
// to the PromiseAny() function. The PromiseAny() function will return a new
// promise that resolves when any of the input promises resolves. In this case,
// the new promise will resolve to the value of the first promise that resolves,
// which is "Promise 1 resolved". If all of the input promises reject, the
// PromiseAny() function will reject with an AggregateError containing an array
// of all of the rejection reasons.


function demonstratePromiseAny() {
  // Create an array of promises
  const promises = [
    new Promise((resolve, reject) => {
      setTimeout(resolve, 1000, "Promise 1");
    }),
    new Promise((resolve, reject) => {
      setTimeout(reject, 2000, "Promise 2");
    }),
    new Promise((resolve, reject) => {
      setTimeout(resolve, 3000, "Promise 3");
    }),
  ];

  // Use Promise.any() to return the first fulfilled promise
  Promise.any(promises).then((value) => {
    console.log(value); // "Promise 1"
  }).catch((error) => {
    console.log(error); // "Promise 2"
  });
}

// Call the function
demonstratePromiseAny();



const promise1 = new Promise((resolve) => setTimeout(resolve, 100, 'one'));
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 200, 'two'));
const promise3 = new Promise((resolve) => setTimeout(resolve, 300, 'three'));

promiseAny([promise1, promise2, promise3])
    .then((value) => console.log('Resolved:', value)) // Outputs: Resolved: one
    .catch((error) => console.error('All promises were rejected:', error));


    /************************** */

    function promiseAny(promises) {
      return new Promise((resolve, reject) => {
          let settled = false;
          let errors = [];
  
          if (!Array.isArray(promises)) {
              reject(new TypeError('Expected an array of promises'));
              return;
          }
  
          if (promises.length === 0) {
              reject(new Error('No promises passed in'));
              return;
          }
  
          promises.forEach((promise) => {
              Promise.resolve(promise)
                  .then((value) => {
                      if (!settled) {
                          settled = true;
                          resolve(value);
                      }
                  })
                  .catch((error) => {
                      errors.push(error);
                      if (errors.length === promises.length) {
                          reject(new AggregateError('All promises were rejected', errors));
                      }
                  });
          });
      });
  }
  

  // Promise.any() takes an iterable of Promise objects. It returns a single promise that fulfills as soon as any of the promises in the iterable fulfills, with the value of the fulfilled promise. If no promises in the iterable fulfill (if all of the given promises are rejected), then the returned promise is rejected with an AggregateError, a new subclass of Error that groups together individual errors.

//   Function takes an array of promises as input and returns a new promise.
// The returned promise is resolved as soon as any of the input promises resolves.
// Else if all of the input promises are rejected then the returned promise is rejected with the array of all the input promises reasons.


const any = function(promisesArray) {
  const promiseErrors = new Array(promisesArray.length);
  let counter = 0;
  
  //return a new promise
  return new Promise((resolve, reject) => {
    promisesArray.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(resolve) // resolve, when any of the input promise resolves
        .catch((error) => {
          promiseErrors[index] = error;
          counter = counter + 1;
          if (counter === promisesArray.length) {
            // all promises rejected, reject outer promise
            reject(promiseErrors);
          }
      }); // reject, when any of the input promise rejects
    });
  });
};



Input:
const test1 = new Promise(function (resolve, reject) {
  setTimeout(reject, 500, 'one');
});

const test2 = new Promise(function (resolve, reject) {
  setTimeout(resolve, 600, 'two');
});

const test3 = new Promise(function (resolve, reject) {
  setTimeout(reject, 200, 'three');
});

any([test1, test2, test3]).then(function (value) {
  // first and third fails, 2nd resolves
  console.log(value);
}).catch(function (err){
  console.log(err);
});

Output:
"two"




Input:
const test1 = new Promise(function (resolve, reject) {
  setTimeout(reject, 500, 'one');
});

const test2 = new Promise(function (resolve, reject) {
  setTimeout(reject, 600, 'two');
});

const test3 = new Promise(function (resolve, reject) {
  setTimeout(reject, 200, 'three');
});

any([test1, test2, test3]).then(function (value) {
  console.log(value);
}).catch(function (err){
  // all three fails
  console.log(err);
});

Output:
["one","two","three"]

