function allSettled(promises) {
  return new Promise((resolve) => {
    const results = [];
    let completed = 0;

    if (promises.length === 0) {
      resolve(results);
      return;
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          results[index] = { status: "fulfilled", value };
        })
        .catch((reason) => {
          results[index] = { status: "rejected", reason };
        })
        .finally(() => {
          completed++;
          if (completed === promises.length) {
            resolve(results);
          }
        });
    });
  });
}

// Test the implementation
const promise1 = Promise.resolve(1);
const promise2 = Promise.reject(new Error("2"));
const promise3 = new Promise((resolve) => {
  setTimeout(resolve, 100, 3);
});

allSettled([promise1, promise2, promise3]).then((results) => {
  console.log(JSON.stringify(results, null, 2));
});

// Additional test cases
const emptyPromiseArray = [];
allSettled(emptyPromiseArray).then((results) => {
  console.log("Empty promise array result:", JSON.stringify(results, null, 2));
});

const mixedInputs = [
  Promise.resolve(4),
  5,
  Promise.reject(new Error("6")),
  new Promise((resolve) => setTimeout(() => resolve(7), 50))
];
allSettled(mixedInputs).then((results) => {
  console.log("Mixed inputs result:", JSON.stringify(results, null, 2));
});