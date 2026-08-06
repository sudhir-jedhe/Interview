function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(
        (result, error) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
        ...args,
      );
    });
  };
}

// Test case 1: Basic functionality
function sum(callback, a, b) {
  if (a < 0 || b < 0) {
    const err = Error("a and b must be positive");
    callback(undefined, err);
  } else {
    callback(a + b);
  }
}

const asyncSum = promisify(sum);

asyncSum(2, 3)
  .then((result) => console.log("Test case 1 (success):", result))
  .catch((error) => console.error("Test case 1 (error):", error.message));

asyncSum(-1, 3)
  .then((result) => console.log("Test case 1 (unexpected success):", result))
  .catch((error) =>
    console.error("Test case 1 (expected error):", error.message),
  );

// Test case 2: Multiple arguments
function multiply(callback, a, b, c) {
  callback(a * b * c);
}

const asyncMultiply = promisify(multiply);

asyncMultiply(2, 3, 4).then((result) => console.log("Test case 2:", result));

// Test case 3: Error handling
function divide(callback, a, b) {
  if (b === 0) {
    callback(undefined, new Error("Division by zero"));
  } else {
    callback(a / b);
  }
}

const asyncDivide = promisify(divide);

asyncDivide(10, 2)
  .then((result) => console.log("Test case 3 (success):", result))
  .catch((error) => console.error("Test case 3 (error):", error.message));

asyncDivide(10, 0)
  .then((result) => console.log("Test case 3 (unexpected success):", result))
  .catch((error) =>
    console.error("Test case 3 (expected error):", error.message),
  );

// Test case 4: Asynchronous operation
function delayedGreeting(callback, name, delay) {
  setTimeout(() => {
    callback(`Hello, ${name}!`);
  }, delay);
}

const asyncGreeting = promisify(delayedGreeting);

asyncGreeting("Alice", 1000).then((result) =>
  console.log("Test case 4:", result),
);

// Run all test cases
Promise.all([
  asyncSum(2, 3),
  asyncSum(-1, 3).catch((error) => error.message),
  asyncMultiply(2, 3, 4),
  asyncDivide(10, 2),
  asyncDivide(10, 0).catch((error) => error.message),
  asyncGreeting("Alice", 1000),
]).then((results) => {
  console.log("\nAll test results:");
  console.log(JSON.stringify(results, null, 2));
});
