// Different from Promise.all() which rejects right away once an error occurs,
// Promise.allSettled() waits for all promises to settle.
```js
/**
 * @param {Array<any>} promises - notice that input might contains non-promises
 * @return {Promise<Array<{status: 'fulfilled', value: any} | {status: 'rejected', reason: any}>>}
 */
function allSettled(promises) {
  if (promises.length === 0) {
    return Promise.resolve([]);
  }

  const results = [];
  let completed = 0;
  return new Promise((resolve) => {
    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i])
        .then((value) => {
          results[i] = { status: "fulfilled", value };
        })
        .catch((reason) => {
          results[i] = { status: "rejected", reason };
        })
        .finally(() => {
          completed++;
          if (completed === promises.length) {
            resolve(results);
          }
        });
    }
  });
}

/********************************* */

/**
 * @param {Array<any>} promises - notice that input might contains non-promises
 * @return {Promise<Array<{status: 'fulfilled', value: any} | {status: 'rejected', reason: any}>>}
 */
function allSettled(promises) {
  // Using promise all
  return Promise.all(
    promises.map((p) =>
      Promise.resolve(p).then(
        (value) => {
          return {
            status: "fulfilled",
            value,
          };
        },
        (reason) => {
          return {
            status: "rejected",
            reason,
          };
        }
      )
    )
  );
}

/*************************** */
/**
 * @param {Array<any>} promises - notice that input might contains non-promises
 * @return {Promise<Array<{status: 'fulfilled', value: any} | {status: 'rejected', reason: any}>>}
 */
function allSettled(promises) {
  return new Promise((resolve) => {
    const result = [];
    let waitFor = promises.length;
    if (waitFor === 0) {
      resolve(result);
    }
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => (result[index] = { status: "fulfilled", value }))
        .catch((reason) => (result[index] = { status: "rejected", reason }))
        .finally(() => {
          waitFor--;
          if (waitFor === 0) {
            resolve(result);
          }
        });
    });
  });
}

/****************************** */

/**
 * @param {Array<any>} promises - notice that input might contains non-promises
 * @return {Promise<Array<{status: 'fulfilled', value: any} | {status: 'rejected', reason: any}>>}
 */
function allSettled(promises) {
  // your code here
  const resolve = promises.reduce((acc, item) => {
    return acc.then((prev) => {
      return Promise.resolve(item)
        .then((ret) => {
          return [...prev, { status: "fulfilled", value: ret }];
        })
        .catch((error) => {
          return [...prev, { status: "rejected", reason: error }];
        });
    });
  }, Promise.resolve([]));

  return resolve;
}



/********************************************* */
if (!Promise.allSettled) {
  Promise.allSettled = function (promises) {
      return new Promise((resolve) => {
          if (!Array.isArray(promises)) {
              throw new TypeError('Expected an array of promises');
          }

          if (promises.length === 0) {
              resolve([]);
              return;
          }

          let settledCount = 0;
          const results = new Array(promises.length);

          promises.forEach((promise, index) => {
              Promise.resolve(promise)
                  .then((value) => {
                      results[index] = { status: 'fulfilled', value };
                  })
                  .catch((reason) => {
                      results[index] = { status: 'rejected', reason };
                  })
                  .finally(() => {
                      settledCount++;
                      if (settledCount === promises.length) {
                          resolve(results);
                      }
                  });
          });
      });
  };
}


const promise1 = Promise.resolve('one');
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 200, 'two'));
const promise3 = new Promise((resolve) => setTimeout(resolve, 300, 'three'));

Promise.allSettled([promise1, promise2, promise3])
    .then((results) => console.log('Results:', results))
    .catch((error) => console.error('Error:', error));



    function promiseAllSettledExample() {
      // Create an array of promises
      const promises = [
        new Promise((resolve, reject) => {
          setTimeout(() => resolve("Promise 1 resolved"), 1000);
        }),
        new Promise((resolve, reject) => {
          setTimeout(() => reject("Promise 2 rejected"), 2000);
        }),
        new Promise((resolve, reject) => {
          setTimeout(() => resolve("Promise 3 resolved"), 3000);
        }),
      ];
    
      // Use Promise.allSettled() to wait for all promises to settle
      Promise.allSettled(promises).then((results) => {
        // Log the results of each promise
        results.forEach((result) => {
          console.log(result.status, result.value);
        });
      });
    }
    
    // Call the function
    promiseAllSettledExample();


    /**************************************** */


//     The Promise.allSettled() method returns a promise that fulfills after all of the given promises have either fulfilled or rejected, with an array of objects that each describes the outcome of each promise.

//     Map the array of promises to return an object with status and value/error depending upon the promised settlement.
// Pass this map to the Promise.all to run them at once and return the result.


const allSettled = (promises) => {
  // map the promises to return custom response.
  const mappedPromises = promises.map(
    p => Promise.resolve(p)
    .then(
      val => ({ status: 'fulfilled', value: val }),
      err => ({ status: 'rejected', reason: err })
    )
  );

  // run all the promises once with .all 
  return Promise.all(mappedPromises);
}

Input:
const a = new Promise((resolve) => setTimeout(() => { resolve(3) },200));
const b = new Promise((resolve,reject) => reject(9));
const c = new Promise((resolve) => resolve(5));

allSettled([a, b, c]).then((val)=> {console.log(val)});

Output:
[
  {
    "status": "fulfilled",
    "value": 3
  },
  {
    "status": "rejected",
    "reason": 9
  },
  {
    "status": "fulfilled",
    "value": 5
  }
]


/*************************************** */
promiseAllSettled

/**
 * @param {Array<Function>} functions
 * @return {Promise}
 */
var promiseAllSettled = function (functions) {
  return new Promise(resolve => {
      const res = [];
      let count = 0;
      for (let i in functions) {
          functions[i]()
              .then(value => ({ status: 'fulfilled', value }))
              .catch(reason => ({ status: 'rejected', reason }))
              .then(obj => {
                  res[i] = obj;
                  if (++count === functions.length) {
                      resolve(res);
                  }
              });
      }
  });
};

