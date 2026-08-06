function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const results = new Array(iterable.length);
    let unresolved = iterable.length;

    if (unresolved === 0) {
      resolve(results);
      return;
    }

    iterable.forEach((item, index) => {
      Promise.resolve(item).then(
        (value) => {
          results[index] = value;
          unresolved -= 1;

          if (unresolved === 0) {
            resolve(results);
          }
        },
        (reason) => {
          reject(reason);
        }
      );
    });
  });
}

// Test cases
console.log("Test 1: All promises resolve");
promiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]).then(console.log).catch(console.error);

console.log("Test 2: Empty array");
promiseAll([]).then(console.log).catch(console.error);

console.log("Test 3: Mix of promises and values");
promiseAll([
  Promise.resolve(1),
  2,
  Promise.resolve(3)
]).then(console.log).catch(console.error);

console.log("Test 4: One promise rejects");
promiseAll([
  Promise.resolve(1),
  Promise.reject("Error"),
  Promise.resolve(3)
]).then(console.log).catch(console.error);

console.log("Test 5: Async promises");
promiseAll([
  new Promise(resolve => setTimeout(() => resolve(1), 1000)),
  new Promise(resolve => setTimeout(() => resolve(2), 500)),
  new Promise(resolve => setTimeout(() => resolve(3), 100))
]).then(console.log).catch(console.error);