// Simulated asynchronous function that resolves after a delay
function simulateAsyncOperation(value, delay, shouldReject = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldReject) {
        reject(new Error(`Operation failed for ${value}`));
      } else {
        resolve(`Operation completed for ${value}`);
      }
    }, delay);
  });
}

// Basic Promise usage
console.log("1. Basic Promise usage:");
simulateAsyncOperation("Task 1", 1000)
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log("Operation finished\n"));

// Promise chaining
console.log("2. Promise chaining:");
simulateAsyncOperation("Task 2", 1000)
  .then(result => {
    console.log(result);
    return simulateAsyncOperation("Task 3", 500);
  })
  .then(result => {
    console.log(result);
    return "All tasks completed";
  })
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log("Chain finished\n"));

// Error handling
console.log("3. Error handling:");
simulateAsyncOperation("Task 4", 1000, true)
  .then(result => console.log(result))
  .catch(error => console.error(`Caught error: ${error.message}`))
  .finally(() => console.log("Error handling finished\n"));

// Promise.all()
console.log("4. Promise.all():");
const promises = [
  simulateAsyncOperation("Task 5", 1000),
  simulateAsyncOperation("Task 6", 1500),
  simulateAsyncOperation("Task 7", 500)
];

Promise.all(promises)
  .then(results => console.log("All promises resolved:", results))
  .catch(error => console.error(error))
  .finally(() => console.log("Promise.all() finished\n"));

// Promise.race()
console.log("5. Promise.race():");
const racingPromises = [
  simulateAsyncOperation("Task 8", 1000),
  simulateAsyncOperation("Task 9", 500),
  simulateAsyncOperation("Task 10", 1500)
];

Promise.race(racingPromises)
  .then(result => console.log("First promise resolved:", result))
  .catch(error => console.error(error))
  .finally(() => console.log("Promise.race() finished\n"));

// Async/Await syntax (which uses Promises under the hood)
console.log("6. Async/Await syntax:");
async function runAsyncOperations() {
  try {
    const result1 = await simulateAsyncOperation("Task 11", 1000);
    console.log(result1);
    const result2 = await simulateAsyncOperation("Task 12", 500);
    console.log(result2);
    return "Async operations completed";
  } catch (error) {
    console.error(`Async error: ${error.message}`);
  }
}

runAsyncOperations().then(result => console.log(result));