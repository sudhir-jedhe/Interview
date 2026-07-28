```js
/**
 * @param {Array<any>} promises - notice input might have non-Promises
 * @return {Promise<any[]>}
 */
async function all(promises) {
  const results = [];

  for (let promise of promises) {
    results.push(await promise);
  }

  return results;
}

/***************************** */

/**
 * @param { Array<any> } promises - notice input might have non-Promises
 * @returns { Promise<any[]> }
 */
function all(promises) {
  return promises.reduce((accm, curr) => {
    return accm.then((results) =>
      Promise.resolve(curr).then((r) => [...results, r])
    );
  }, Promise.resolve([]));
}

/************************************** */
/**
 * @param { Array<any> } promises - notice input might have non-Promises
 * @returns { Promise<any[]> }
 */
function all(promises) {
  const _promises = promises.map((item) =>
    item instanceof Promise ? item : Promise.resolve(item)
  );

  // resolve if empty
  if (_promises.length === 0) {
    return Promise.resolve([]);
  }

  return new Promise((resolve, reject) => {
    const result = [];
    let fulfilledCount = 0;
    let isErrored = false;

    _promises.forEach((promise, index) => {
      promise.then(
        (value) => {
          if (isErrored) return;
          result[index] = value;

          fulfilledCount += 1;
          if (fulfilledCount === _promises.length) {
            resolve(result);
          }
        },
        (error) => {
          if (isErrored) return;
          isErrored = true;
          reject(error);
        }
      );
    });
  });
}
