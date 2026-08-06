function race(arr) {
  return new Promise((resolve, reject) => {
    for (const promise of arr) {
      Promise.resolve(promise)
        .then((value) => {
          resolve(value);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
}

Promise.race = race;

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

// Test case 1: Basic race between two promises
console.log("Test 1: Basic race between two promises");
const promise1 = createPromise("one", 500);
const promise2 = createPromise("two", 100);

Promise.race([promise1, promise2])
  .then((value) => {
    console.log("Winner:", value);
  })
  .catch((error) => {
    console.error("Error:", error);
  })
  .finally(() => {
    console.log("Test 1 completed");
  });

// Test case 2: Race with a rejecting promise
console.log("\nTest 2: Race with a rejecting promise");
const promise3 = createPromise("three", 200);
const promise4 = createPromise("Error in four", 100, true);

Promise.race([promise3, promise4])
  .then((value) => {
    console.log("Winner:", value);
  })
  .catch((error) => {
    console.error("Error:", error);
  })
  .finally(() => {
    console.log("Test 2 completed");
  });

// Test case 3: Race with non-promise values
console.log("\nTest 3: Race with non-promise values");
const value1 = "Instant value";
const promise5 = createPromise("five", 100);

Promise.race([value1, promise5])
  .then((value) => {
    console.log("Winner:", value);
  })
  .catch((error) => {
    console.error("Error:", error);
  })
  .finally(() => {
    console.log("Test 3 completed");
  });

// Test case 4: Race with an empty array
console.log("\nTest 4: Race with an empty array");
Promise.race([])
  .then((value) => {
    console.log("Winner:", value);
  })
  .catch((error) => {
    console.error("Error:", error);
  })
  .finally(() => {
    console.log("Test 4 completed");
  });

// Test case 5: Race with multiple promises
console.log("\nTest 5: Race with multiple promises");
const promise6 = createPromise("six", 300);
const promise7 = createPromise("seven", 200);
const promise8 = createPromise("eight", 100);

Promise.race([promise6, promise7, promise8])
  .then((value) => {
    console.log("Winner:", value);
  })
  .catch((error) => {
    console.error("Error:", error);
  })
  .finally(() => {
    console.log("Test 5 completed");
  });