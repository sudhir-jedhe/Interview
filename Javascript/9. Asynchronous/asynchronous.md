### 3. Working with Promises: `resolve` and `reject` in JavaScript

In JavaScript, promises are used to handle asynchronous operations. A promise represents an eventual result of an asynchronous operation. It can be in one of three states: pending, resolved (fulfilled), or rejected.

### Code Example: Resolve and Reject Promises

```javascript
function asyncResolveFunc() {
  // Function returns a promise that resolves with the message "Success".
  function resolver(resolve, reject) {
    resolve("Success");
  }
  return new Promise(resolver);
}

function asyncRejectFunc() {
  // Function returns a promise that rejects with the message "Failure".
  function resolver(resolve, reject) {
    reject("Failure");
  }
  return new Promise(resolver);
}

// Driver code
const promiseSuccess = asyncResolveFunc(); // This will resolve
const promiseFailure = asyncRejectFunc(); // This will reject

// Succeeded promise .then executes first function passed as argument
promiseSuccess.then(
  (successData) => {
    console.log(successData); // "Success"
  },
  (failureData) => {
    console.log(failureData); // Will not be executed
  },
);

// Failed promise .then executes second function passed as argument
promiseFailure.then(
  (successData) => {
    console.log(successData); // Will not be executed
  },
  (failureData) => {
    console.log(failureData); // "Failure"
  },
);
```

**Output:**

```
Success
Failure
```

### Key Concepts:

- **`resolve()`**: Resolves the promise, indicating that the asynchronous operation was successful.
- **`reject()`**: Rejects the promise, indicating that the asynchronous operation failed.
- **`then()`**: Executes when the promise is either resolved or rejected.

---

### 4. Wrapping `setTimeout` in a Promise

In JavaScript, the `setTimeout` function executes code after a specified delay. You can wrap `setTimeout` in a promise to make it easier to handle asynchronously with `.then()` or `async/await`.

### Code Example: `setTimeout` Wrapped in a Promise

```javascript
function setTimeoutPromise(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay); // Resolve after the timeout
  });
}

// Driver code
console.log("Task started");

const timeoutPromise = setTimeoutPromise(3000); // 3-second delay
timeoutPromise.then(() => {
  console.log("Task completed"); // This will execute after 3 seconds
});
```

**Explanation:**

- The `setTimeoutPromise` function wraps the `setTimeout` and returns a promise that resolves after the specified delay.
- The `then()` method is used to handle the resolved value.

**Output (after 3 seconds):**

```
Task started
Task completed
```

---

### 5. Converting `XMLHttpRequest` to Promise

`XMLHttpRequest` (XHR) is a legacy way to make HTTP requests, but it can be wrapped in a promise to provide a cleaner interface, which is especially useful when working with modern JavaScript features like `async/await`.

### Code Example: Wrapping XHR in a Promise

```javascript
function fetchData(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = function () {
      if (this.status === 200) {
        resolve(this.responseText); // Resolve with response data
      } else {
        reject(`Error: ${this.status}`); // Reject with error status
      }
    };
    xhr.onerror = function () {
      reject("Network Error"); // Reject if there is a network error
    };
    xhr.send();
  });
}

// Driver code
fetchData("https://reqbin.com/echo/get/json")
  .then((data) => {
    console.log(data); // Success: displays data from the server
  })
  .catch((err) => {
    console.error(err); // Error: displays error message
  });
```

**Explanation:**

- The `fetchData` function creates an XHR request and returns a promise.
- The promise resolves if the request is successful (`status === 200`), or it rejects with an error message otherwise.

---

### 6. Making Fetch Requests and Storing JSON Data

`fetch` is the modern way to make HTTP requests. It returns a promise, and the response can be processed as JSON using `.json()`.

### Code Example: Fetch and Store JSON Data

```javascript
fetch("https://reqbin.com/echo/get/json")
  .then((response) => {
    return response.json(); // Convert the response to JSON
  })
  .then((data) => {
    console.log(data); // Success: Logs the parsed JSON data
  })
  .catch((err) => {
    console.error(err); // Error: Logs any errors
  });
```

**Explanation:**

- `fetch()` makes a request to the URL and returns a promise.
- `.json()` converts the response body into a JavaScript object.
- `.catch()` handles any errors, such as network issues.

---

### 7. Cancel a Fetch Request Using `AbortController`

To cancel an ongoing fetch request, we can use the `AbortController` API. It allows us to abort fetch requests before they are completed.

### Code Example: Cancelling Fetch Request

```javascript
const controller = new AbortController();
const signal = controller.signal;

fetch("https://reqbin.com/echo/get/json", { signal })
  .then((response) => {
    console.log(response); // Logs the response if request is not aborted
  })
  .catch((err) => {
    console.warn("Fetch request was aborted:", err); // Logs when the request is aborted
  });

// Abort the request after 2 seconds
setTimeout(() => {
  controller.abort();
}, 2000);
```

**Explanation:**

- `AbortController` is used to create a signal that can be passed to the `fetch` request.
- Calling `controller.abort()` will cancel the fetch request.

---

### 8. Using `async/await` with Promises

`async/await` is a syntax for working with asynchronous code in a more synchronous-like manner. The `await` keyword can only be used inside an `async` function and waits for a promise to resolve.

### Code Example: Using `async/await`

```javascript
async function asyncAwaitFunc() {
  try {
    console.log("Executes normally when invoked");
    await promiseReturningFunc(); // Waits for promise to resolve
    console.log("Continues after promise resolution");
  } catch (err) {
    console.error("Error occurred:", err); // Catches and logs any errors
  }
}

// Simulating a promise-returning function
function promiseReturningFunc() {
  return new Promise((resolve) => setTimeout(resolve, 2000)); // Resolves after 2 seconds
}

asyncAwaitFunc();
```

**Explanation:**

- The `await` pauses execution until `promiseReturningFunc` resolves, making the code appear synchronous.

---

### 9. Using `Promise.all()` to Handle Multiple Promises

`Promise.all()` allows you to handle multiple promises concurrently. If any promise fails, it will reject immediately.

### Code Example: Resolving Multiple Promises

```javascript
const asyncArr = [async1, async2, async3];
const promiseArr = asyncArr.map((asyncFunc) => asyncFunc());

Promise.all(promiseArr)
  .then((results) => {
    console.log("All promises resolved:", results);
  })
  .catch((err) => {
    console.error("One promise failed:", err); // Stops if any promise is rejected
  });
```

**Explanation:**

- `Promise.all()` resolves all promises if they are successful. If any of them fails, the whole promise will be rejected.

---

### 10. Using `Promise.allSettled()` for Handling All Promises

`Promise.allSettled()` waits for all promises to settle, regardless of whether they succeed or fail.

### Code Example: Resolving All Promises Regardless of Success or Failure

```javascript
const asyncArr = [async1, async2, async3];
const promiseArr = asyncArr.map((asyncFunc) => asyncFunc());

Promise.allSettled(promiseArr).then((results) => {
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      console.log("Fulfilled:", result.value);
    } else {
      console.log("Rejected:", result.reason);
    }
  });
});
```

**Explanation:**

- `Promise.allSettled()` returns an array of results where each entry indicates whether the promise was fulfilled or rejected.

---

These examples show how Promises, `async/await`, and other related methods can be used to manage asynchronous operations in JavaScript. They provide a cleaner, more readable way to work with asynchronous code compared to traditional callbacks.

### 11. Working of `Promise.race()` with Asynchronous Functions

`Promise.race()` takes an array of promises and returns a promise that settles as soon as one of the promises settles (either resolves or rejects). It resolves or rejects with the value or reason of the first promise to settle, even if other promises are still pending.

### Example of `Promise.race()`:

```javascript
function asyncFunc1() {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve("Resolved async1");
    }, 2000),
  );
}

function asyncFunc2() {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve("Resolved async2");
    }, 3000),
  );
}

function asyncFunc3() {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      reject("Rejected async3");
    }, 1000),
  );
}

// Driver code
const asyncArr = [asyncFunc1, asyncFunc2, asyncFunc3];
const promiseArr = asyncArr.map((async) => async());

Promise.race(promiseArr)
  .then(console.log) // This will print the first settled promise
  .catch(console.log); // This will print if the first promise rejects
```

### Output:

```
Rejected async3
```

**Explanation:**

- The `Promise.race()` resolves or rejects with the first promise that settles.
- In this case, `asyncFunc3()` rejects after 1 second, so the result is "Rejected async3".
- Even though `asyncFunc1()` and `asyncFunc2()` are still pending, `Promise.race()` returns the result of the first one to settle.

---

### 12. Working of a Generator Function

A **generator function** is a special type of function that can be paused and resumed. It is defined using the `function*` syntax and can yield multiple values using the `yield` keyword.

### Example of a Simple Generator Function:

```javascript
function* generatorFunc(param) {
  const num1 = yield; // Pauses here and waits for the first input
  const num2 = yield; // Pauses again and waits for the second input
  return num1 + num2; // Returns the sum of the two values
}

// Driver code
const it = generatorFunc();
it.next(); // { value: undefined, done: false }
it.next(3); // { value: undefined, done: false }
const sum = it.next(5); // { value: 8, done: true }
console.log(sum.value); // 8
```

### Output:

```
8
```

**Explanation:**

- The generator starts with `it.next()`, which pauses at the first `yield`.
- `it.next(3)` sends the value `3` to the generator and continues execution.
- The second `it.next(5)` sends the value `5`, and the generator returns the sum of `3 + 5`.

---

### 13. Generator Function Using Another Generator Function

A generator can call another generator using `yield*`, which allows delegating control to another generator and iterating through its values.

### Example:

```javascript
function* gen1() {
  yield 1;
  yield* gen2(); // Delegates to gen2
  yield 4;
}

function* gen2() {
  yield 2;
  yield 3;
}

// Driver code
for (let value of gen1()) {
  console.log(value); // Prints the values from both gen1 and gen2
}
```

### Output:

```
1
2
3
4
```

**Explanation:**

- `gen1` yields `1`, then delegates to `gen2` using `yield*`, which yields `2` and `3`.
- After `gen2` finishes, `gen1` continues and yields `4`.

---

### 14. Mocking a Promise Interface

In this task, we will create a basic custom implementation of a `Promise` in JavaScript that can be used to resolve or reject values and allows chaining with `then()`.

### Custom Promise Implementation:

```javascript
function MyPromise(resolver) {
  let successList = [];
  let failureList = [];
  let resolution = "pending";
  let data;

  function resolve(value) {
    if (resolution === "pending") {
      successList.forEach((cb) => cb(value));
      resolution = "resolved";
      data = value;
    }
  }

  function reject(value) {
    if (resolution === "pending") {
      failureList.forEach((cb) => cb(value));
      resolution = "rejected";
      data = value;
    }
  }

  setTimeout(() => {
    try {
      resolver(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }, 0);

  return {
    status: resolution,
    then: function (onSuccess, onFailure) {
      if (resolution === "pending") {
        successList.push(onSuccess);
        failureList.push(onFailure);
      } else {
        resolution === "resolved" ? onSuccess(data) : onFailure(data);
      }
    },
  };
}

// Driver code
let p = new MyPromise((resolve, reject) => {
  resolve(10);
});
p.then((data) => console.log(data)); // 10
```

### Explanation:

- This custom `MyPromise` function mimics the behavior of the native `Promise` by storing success and failure callbacks and resolving or rejecting based on the status.
- It uses `setTimeout` to delay execution so that the promise is asynchronously resolved.

---

### 15. Implementing `Promise.all` Functionality

`Promise.all` takes an array of promises and resolves when all of the promises are fulfilled. If any of the promises rejects, it immediately rejects.

### Custom `Promise.all` Implementation:

```javascript
function PromiseAll(promiseArr) {
  return new Promise((resolve, reject) => {
    const dataArr = new Array(promiseArr.length);
    let resolution = "pending";
    let resolvedCount = 0;

    for (let index in promiseArr) {
      promiseArr[index].then(
        (data) => {
          if (resolution === "pending") {
            dataArr[index] = { value: data, status: "fulfilled" };
            resolvedCount++;
            if (resolvedCount === promiseArr.length) {
              resolution = "fulfilled";
              resolve(dataArr);
            }
          }
        },
        (err) => {
          if (resolution === "pending") {
            resolution = "rejected";
            reject({ reason: err, status: "rejected" });
          }
        },
      );
    }
  });
}

// Driver code
PromiseAll([
  new Promise((resolve) => setTimeout(resolve, 1000)),
  new Promise((resolve, reject) => setTimeout(reject, 2000)),
]).then(console.log, console.log);
```

### Explanation:

- This implementation of `Promise.all` resolves when all promises are fulfilled or rejects immediately if any of the promises fails.

---

### 16. Using Generator Functions with Promises

In this example, we'll combine `generators` and `promises` to handle asynchronous operations within a generator function using `yield`.

### Example:

```javascript
// Helper function to simulate an asynchronous operation
function asyncFunc(data, delay) {
  return new Promise((resolve) => setTimeout(resolve, delay, data));
}

// Generator function that yields promises
function* gen() {
  const num1 = yield asyncFunc(2, 1000); // Asynchronously wait for the result
  const num2 = yield asyncFunc(1, 2000); // Another asynchronous call
  console.log(num1 + num2); // 3 (2 + 1)
}

// Helper function to execute the generator and handle promises
function executeGeneratorWithPromise(gen) {
  const it = gen();

  function handle(promise) {
    if (!promise.done) {
      promise.value
        .then((data) => {
          handle(it.next(data)); // Continue generator execution with resolved data
        })
        .catch((err) => it.throw(err)); // Handle error if promise is rejected
    }
  }

  handle(it.next()); // Start generator execution
}

// Call generator executor
executeGeneratorWithPromise(gen);
```

### Explanation:

- The `gen` function yields promises (`asyncFunc`), pausing the generator execution until the promise resolves.
- The `executeGeneratorWithPromise` helper function manages the flow, starting the generator and continuing it once the promise is resolved.

---

### Conclusion:

These examples cover how various JavaScript features, such as `Promise.race()`, generators, and custom promise handling, can be combined to manage asynchronous tasks more effectively. They demonstrate how promises and generators can be used to handle complex asynchronous workflows in a clean and manageable way.

Let's walk through each of the examples you provided to explain the key concepts:

---

### 1. Print "Hello, world" with a delay of 3 seconds

In JavaScript, `setTimeout` is used to delay the execution of a function by a certain amount of time (in milliseconds). Here's an example:

```javascript
setTimeout(
  function (text) {
    console.log(text);
  },
  3000,
  "Hello, World",
);

setTimeout(() => console.log("Hello, World"), 3000);

setTimeout(console.log, 3000, "Hello, World");
```

**Explanation:**

- `setTimeout` takes a function and a delay (in milliseconds).
- The third argument (optional) can be passed to the function when executed.
- The second method using an arrow function achieves the same as the first, just more concisely.

---

### 2. Create a function which receives a function as argument and executes it after 2 seconds

This example shows how to use `setTimeout` to delay the execution of a passed callback function:

```javascript
function callbackExec(callback) {
  if (typeof callback === "function") {
    setTimeout(() => {
      callback();
      console.log("Callback is executed after 2 seconds");
    }, 2000);
  }
}

function displayHello() {
  console.log("Hello");
}

callbackExec(displayHello);
```

**Explanation:**

- The `callbackExec` function takes a `callback` as an argument.
- It checks if the `callback` is a function and then executes it after a delay of 2 seconds using `setTimeout`.

---

### 3. Print numbers from 1 to 10 with delay of 1 second between each value

You can use `setTimeout` in a loop, but keep in mind the asynchronous nature of JavaScript:

```javascript
const num1 = 1,
  num2 = 10;
for (let i = num1; i <= num2; i++) {
  setTimeout(() => console.log(i), i * 1000);
}
```

**Explanation:**

- Each iteration of the loop triggers `setTimeout`, and the value of `i` is logged after a delay proportional to the loop iteration (i.e., 1 second for `i = 1`, 2 seconds for `i = 2`, and so on).
- This achieves a delay between each printed number.

---

### 4. Print numbers from 1 to 10 with delay of 1 second between each value using `setInterval`

`setInterval` can be used to repeatedly execute a block of code at fixed intervals:

```javascript
const num1 = 1,
  num2 = 10;
let i = num1;
const intervalId = setInterval(() => {
  console.log(i++);
  if (i === num2 + 1) clearInterval(intervalId);
}, 1000);
```

**Explanation:**

- `setInterval` will execute the provided function every 1000 ms (1 second).
- The `clearInterval` function is used to stop the interval after printing `10`.

---

### 5. Print numbers from 10 to 1 with delay of 1 second using `setTimeout` with pre-ES6 features

Before ES6, we used `var` and immediately invoked function expressions (IIFE) to create a new scope for each iteration:

```javascript
var num1 = 10,
  num2 = 1;
for (var i = num1; i >= num2; i--) {
  (function (i) {
    setTimeout(
      function () {
        console.log(i);
      },
      (num1 - i) * 1000,
    );
  })(i);
}
```

**Explanation:**

- The IIFE creates a new scope, which captures the value of `i` for each iteration.
- `setTimeout` uses `(num1 - i) * 1000` to delay the printing of numbers from 10 down to 1 with a 1-second delay between them.

---

### 6. Timer function to start and stop incrementing numbers

A timer that can be started and stopped based on the user's input:

```javascript
function timer(init = 0, step = 1) {
  var intervalId;
  var count = init;

  function startTimer() {
    if (!intervalId) {
      intervalId = setInterval(() => {
        console.log(count);
        count += step;
      }, 1000);
    }
  }

  function stopTimer() {
    clearInterval(intervalId);
    intervalId = null;
  }

  return { startTimer, stopTimer };
}

// driver code
const timerObj = timer(100, 10);
timerObj.startTimer();
setTimeout(() => {
  timerObj.stopTimer();
}, 5000);
```

**Explanation:**

- The `startTimer` function starts a `setInterval` that increments and prints the `count` every second.
- The `stopTimer` function clears the interval when called.
- The timer can be started and stopped at any time.

---

### 7. Execute an array of asynchronous functions one after another using callbacks

This example uses a callback to manage the execution of asynchronous functions sequentially:

```javascript
function asyncFunc1(callback) {
  console.log("Started asyncFunc1");
  setTimeout(() => {
    console.log("Completed asyncFunc1");
    callback();
  }, 3000);
}

function asyncFunc2(callback) {
  console.log("Started asyncFunc2");
  setTimeout(() => {
    console.log("Completed asyncFunc2");
    callback();
  }, 2000);
}

function asyncFunc3(callback) {
  console.log("Started asyncFunc3");
  setTimeout(() => {
    console.log("Completed asyncFunc3");
    callback();
  }, 1000);
}

function callbackManager(asyncFuncs) {
  function nextFuncExecutor() {
    const nextAsyncFunc = asyncFuncs.shift();
    if (nextAsyncFunc && typeof nextAsyncFunc === "function") {
      nextAsyncFunc(nextFuncExecutor);
    }
  }
  nextFuncExecutor();
}

callbackManager([asyncFunc1, asyncFunc2, asyncFunc3]);
```

**Explanation:**

- The `callbackManager` function executes the asynchronous functions one after another using a callback that calls the next function after the current one finishes.
- It works sequentially by calling each function and passing a callback to move to the next one.

---

### 8. Execute asynchronous functions in parallel and return the results as an array

To execute asynchronous functions in parallel and gather their results, you can use the following pattern:

```javascript
function asyncParallel(asyncFuncArr, callback) {
  const resultArr = new Array(asyncFuncArr.length);
  let resultCounter = 0;

  asyncFuncArr.forEach((asyncFn, index) => {
    asyncFn((value) => {
      resultArr[index] = value;
      resultCounter++;
      if (resultCounter >= asyncFuncArr.length) {
        callback(resultArr);
      }
    });
  });
}

asyncParallel([asyncFunc1, asyncFunc2, asyncFunc3], (result) => {
  console.log(result); // [1, 2, 3]
});
```

**Explanation:**

- Each function in the array is executed in parallel.
- The results are stored in an array, and when all functions are complete, the `callback` is called with the results.

---

### 9. Execute asynchronous functions one after another in sequence using promise chaining

This example demonstrates how to chain promises together so that they execute sequentially:

```javascript
asyncFunc1()
  .then(asyncFunc2)
  .then(asyncFunc3)
  .catch(() => {
    console.log("Error occurred in one of the async functions");
  });
```

**Explanation:**

- The `.then()` method returns a promise, allowing chaining.
- Each asynchronous function returns a promise, and the next function is called when the previous one resolves.
- `.catch()` is used to handle errors.

---

### 10. Execute asynchronous functions using `async`/`await`

This method is syntactic sugar for working with promises, making asynchronous code look synchronous:

```javascript
async function executor() {
  try {
    await asyncFunc1();
    await asyncFunc2();
    await asyncFunc3();
    console.log("All succeeded");
  } catch {
    console.log("Error occurred");
  }
}
```

**Explanation:**

- `async` functions automatically return promises.
- `await` pauses the execution of the function until the promise resolves, making the code more readable.

---

### 11. Execute 3 asynchronous functions one after another in sequence and do not terminate on failure

This can be done using `.then()` with error handlers for each function:

```javascript
async1()
  .then(() => {
    console.log("Async1 success");
  })
  .catch(() => {
    console.log("Async1 failure");
  })
  .then(async2)
  .then(() => {
    console.log("Async2 success");
  })
  .catch(() => {
    console.log("Async2 failure");
  })
  .then(async3)
  .then(() => {
    console.log("Async3 success");
  })
  .catch(() => {
    console.log("Async3 failure");
  });
```

**Explanation:**

- Even if one function fails, the next will still run due to the separate `.catch()` handlers.

---

### 12. Execute 3 asynchronous functions using `async`/`await` and do not terminate on failure

Using `async`/`await`, we can handle each function's failure individually:

```javascript
(async function executor() {
  try {
    await asyncFunc1();
    console.log("Async1 success");
  } catch {
    console.log("Async1 failure");
  }

  try {
    await asyncFunc2();
    console.log("Async2 success");
  } catch {
    console.log("Async2 failure");
  }

  try {
    await asyncFunc3();
    console.log("Async3 success");
  } catch {
    console.log("Async3 failure");
  }

  console.log("All succeeded");
})();
```

**Explanation:**

- Each function is wrapped in a `try...catch` block to handle errors individually, ensuring that failures don't stop subsequent functions.

---

### 13. Execute an array of asynchronous functions in sequence using `reduce`

You can use `Array.prototype.reduce()` to execute promises sequentially:

```javascript
const asyncFuncArr = [asyncFunc1, asyncFunc2, asyncFunc3];

asyncFuncArr.reduce((acc, asyncFn) => {
  return acc.then(() => asyncFn().then(console.log));
}, Promise.resolve());
```

**Explanation:**

- `reduce()` is used to chain the promises sequentially, with `Promise.resolve()` serving as the initial value.

---

### 14. Execute an array of asynchronous functions simultaneously and print the output in sequence

Execute the functions in parallel but ensure the results are printed in order:

```javascript
const asyncFuncArr = [asyncFunc1, asyncFunc2, asyncFunc3];

asyncFuncArr
  .map((async) => async())
  .reduce(async (acc, promise) => {
    console.log(await acc.then(() => promise));
  }, Promise.resolve());
```

**Explanation:**

- `map()` runs all functions in parallel.
- `reduce()` is used to ensure the results are printed in the original order, regardless of which promise resolves first.

---

These examples illustrate how asynchronous operations, callbacks, promises, and `async`/`await` can be used in various ways to manage concurrency and sequential execution in JavaScript.

Let's walk through the examples and explain each one in detail:

---

### 15. Utility to return the first successful or non-successful result with a max waiting time

In this task, we will use `Promise.race` to race multiple promises (including a timeout). The first promise to resolve or reject will be the result, and if no promise settles before the timeout, it will reject with a timeout message.

Here's the solution:

```javascript
function timeoutFunc() {
  const delay = 500; // Set timeout duration (500ms)
  return new Promise((resolve, reject) => {
    setTimeout(() => reject("Timeout"), delay);
  });
}

const asyncFunc1 = () =>
  new Promise((resolve) => setTimeout(() => resolve("Async 1 Done"), 300));
const asyncFunc2 = () =>
  new Promise((resolve) => setTimeout(() => resolve("Async 2 Done"), 1000));
const asyncFunc3 = () =>
  new Promise((resolve) => setTimeout(() => resolve("Async 3 Done"), 2000));

const asyncArr = [asyncFunc1, asyncFunc2, asyncFunc3, timeoutFunc];

const promiseArr = asyncArr.map((asyncFunc) => asyncFunc());

Promise.race(promiseArr)
  .then((result) => console.log(result))
  .catch((error) => console.log(error));
```

**Explanation:**

- `timeoutFunc` will reject the promise after 500 milliseconds, effectively acting as a timeout.
- `Promise.race` is used to race the promises: whichever settles first (either resolve or reject) will be returned.
- If the timeout happens before any promise resolves, "Timeout" will be logged.

---

### 16. Utility to retry fetch requests with increasing delay

In this task, we design a utility that retries a fetch request upon failure, with increasing delay between attempts:

```javascript
function requestManager(url, attempts = 3) {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < attempts; i++) {
      try {
        const response = await fetch(url);
        resolve(response);
        break;
      } catch (err) {
        if (attempts - 1 === i) {
          reject(err); // Reject after the last attempt
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000 + 1000 * i)); // Increasing delay
      }
    }
  });
}

// driver code
requestManager("https://reqbin.com/echo/get/json", 3).then(
  (response) => console.log(response),
  (error) => console.log(error),
);
```

**Explanation:**

- `requestManager` accepts a URL and the number of attempts (default is 3).
- If the fetch fails, it retries with an increasing delay: after the first failure, it waits 1000ms; after the second, 2000ms, and so on.
- If all attempts fail, it rejects the promise with the error.

---

### 17. Create a generator to return a random number on every request

JavaScript generators can be used to create a function that yields values one at a time, allowing you to generate a new random number each time the generator is called:

```javascript
function* generatorFunc() {
  while (true) {
    yield Math.ceil(Math.random() * 100); // Yield random number between 1 and 100
  }
}

// driver code
const it = generatorFunc();
const rand1 = it.next(); // { value: randomNumber, done: false }
const rand2 = it.next(); // { value: randomNumber, done: false }

console.log(rand1.value); // Random number
console.log(rand2.value); // Another random number
```

**Explanation:**

- The `generatorFunc` is an infinite loop that `yields` random numbers between 1 and 100.
- Each time `it.next()` is called, the generator function resumes from where it left off, providing a new random number.
- `next()` returns an object with a `value` and `done` property. `done` will be `false` since the generator doesn't stop.

---

### 18. Search for the presence of a value in a nested object using a generator

This solution uses a generator to traverse a nested object and search for a specific value:

```javascript
function* objectReader(obj) {
  for (let key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      yield* objectReader(obj[key]); // Recursively yield values from nested objects
    } else {
      yield obj[key]; // Yield the leaf node values
    }
  }
}

// driver code
const obj = {
  a: 1,
  b: 2,
  c: 3,
  d: { x: 4, y: 5, z: { m: 6, b: 7 } },
};

const searchValue = 5;
const it = objectReader(obj);

for (let value of it) {
  if (value === searchValue) {
    console.log(searchValue + " exists");
  }
}
```

**Explanation:**

- The `objectReader` generator recursively traverses the object, yielding all primitive values (i.e., numbers, strings, etc.).
- The `yield* objectReader(obj[key])` syntax allows the generator to delegate the iteration to nested objects.
- The `for...of` loop iterates over the yielded values, and the search condition checks if the value matches the search query (`5` in this case).
- If the value is found, it logs that the value exists.

---

### Key Concepts Explained

- **`Promise.race`**: This method is useful when you need the first promise to resolve (or reject). It resolves or rejects as soon as the first promise resolves or rejects. This is especially useful when dealing with timeouts or first-come-first-serve conditions.
- **Retrying with increasing delay**: This can be achieved by using a loop and `setTimeout` (or `await new Promise`) to introduce the delay between retries, making it increasingly longer after each failed attempt. This technique is often used in scenarios where network requests or operations might fail intermittently and need retries.

- **Generators (`function*`)**: Generators are functions that can yield multiple values over time. They allow asynchronous-like behavior without the need for callbacks or promises. A generator function can be paused and resumed, making it useful for lazy evaluation and infinite sequences, like generating random numbers on each request.

- **Recursive Generators for Nested Objects**: This is an example of using a generator function to recursively traverse nested structures (objects in this case) without needing to manually manage stack depth or recursion. By using `yield*`, we delegate iteration to nested objects or arrays.

---

These solutions provide useful utilities for handling asynchronous tasks, retries, and managing infinite or nested structures in an elegant and efficient manner using JavaScript's features like promises, generators, and recursion.

This is an extensive collection of asynchronous JavaScript patterns, timer manipulations, custom promise implementations, and generator workflows.

---

### Key Observations & Edge-Case Callouts

While your solutions serve as great educational templates, here are a few critical edge cases and modern JavaScript standards to keep in mind for production environments:

1. **`MyPromise` Asynchrony (Promises/A+ Spec)**

- In Section **14 ("Mocking a Promise Interface")**, your implementation resolves callbacks synchronously if the promise state changes immediately.
- **Spec Requirement:** The Promises/A+ specification strictly requires that promise handlers (`.then` callbacks) **must always execute asynchronously** (as microtasks via `queueMicrotask` or `setTimeout`), even if the promise is already resolved/fulfilled when `.then` is called.

2. **Sequential `reduce` Chaining**

- In Section **13 ("Execute an array of async functions in sequence")**, using `.reduce()` with `Promise.resolve()` is standard. However, ensure error handling is attached to each step, or an unhandled rejection in one task will halt the execution chain.

3. **In-Flight Request Deduplication in Caching**

- In Section **19 ("Cache identical API requests")**, caching the _data_ (`cache.set(url, data)`) works for sequential calls. However, if two requests for the same URL happen at the exact same millisecond, both will make network calls. Caching the **Promise object itself** before it resolves ensures true request deduplication.

---

### Bonus Pattern: Modern Async Iteration (`for await...of`)

As an evolution beyond generator functions delegating promises via custom runners (like Section 16's `executeGeneratorWithPromise`), modern JavaScript natively supports **Async Generators**.

Async generators allow you to use `yield` with `await` natively without requiring a custom runner:

```javascript
// Native Async Generator
async function* fetchPages(urls) {
  for (const url of urls) {
    // Await the fetch inside the generator loop
    const response = await fetch(url);
    const data = await response.json();
    yield data; // Yields resolved JSON payload to consumer
  }
}

// Driver code using native async iteration
(async () => {
  const urls = [
    "https://jsonplaceholder.typicode.com/todos/1",
    "https://jsonplaceholder.typicode.com/todos/2",
  ];

  for await (const data of fetchPages(urls)) {
    console.log("Fetched Item:", data);
  }
})();
```

Explain the JavaScript Event Loop, Microtasks, and Macrotasks with complex code examples and execution ordering.

Here's my take: The JavaScript **Event Loop** is the mechanism that allows single-threaded JavaScript to perform non-blocking asynchronous operations. Understanding how it prioritizes execution between the Call Stack, Microtasks, and Macrotasks is critical for mastering JavaScript's execution order.

---

### Core Architecture Components

1. **Call Stack:** Executes synchronous code stack frame by stack frame (First-In, Last-Out).
2. **Microtask Queue:** High-priority task queue reserved for promises, `queueMicrotask`, `MutationObserver`, and Node's `process.nextTick`.
3. **Macrotask (Task) Queue:** Standard task queue for timers (`setTimeout`, `setInterval`), I/O operations, `setImmediate` (Node), and user interactions.
4. **Event Loop Engine:** Continuously checks if the Call Stack is empty. When empty, it **flushes the entire Microtask Queue** before picking off **a single Macrotask**.

```text
┌─────────────────────────────────────────────────────────────┐
│                        CALL STACK                           │
│              (Executes synchronous code)                    │
└──────────────────────────────┬──────────────────────────────┘
                               │ (When stack becomes EMPTY)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      MICROTASK QUEUE                        │
│   (Promises, queueMicrotask, process.nextTick)              │
│   ──> DRAIN ALL tasks in queue until completely empty!     │
└──────────────────────────────┬──────────────────────────────┘
                               │ (When microtask queue is EMPTY)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      MACROTASK QUEUE                        │
│   (setTimeout, setInterval, I/O)                            │
│   ──> EXECUTE ONE task, then check Microtasks again!        │
└─────────────────────────────────────────────────────────────┘

```

---

### The Fundamental Rule of Execution Order

1. Execute **all synchronous code** currently on the Call Stack.
2. When the Call Stack is empty, **process ALL microtasks** in the Microtask Queue (including any new microtasks queued _while_ processing microtasks).
3. Process **ONE macrotask** from the Macrotask Queue.
4. Repeat from step 2.

---

### Complex Code Example

Analyze the code below and try to predict the exact console output order:

```javascript
console.log("1. Sync Start");

setTimeout(() => {
  console.log("2. Macrotask 1 (Timer)");

  Promise.resolve().then(() => {
    console.log("3. Microtask inside Macrotask 1");
  });
}, 0);

queueMicrotask(() => {
  console.log("4. Microtask 1 (queueMicrotask)");

  queueMicrotask(() => {
    console.log("5. Nested Microtask 2");
  });
});

Promise.resolve().then(() => {
  console.log("6. Promise Microtask 3");
});

setTimeout(() => {
  console.log("7. Macrotask 2 (Timer)");
}, 0);

console.log("8. Sync End");
```

---

### Step-by-Step Execution Breakdown

#### Phase 1: Synchronous Execution (Call Stack)

1. `console.log('1. Sync Start')` runs $\rightarrow$ **Logs `1. Sync Start**`.
2. First `setTimeout` schedules **Macrotask 1** to the Macrotask Queue.
3. `queueMicrotask` schedules **Microtask 1** to the Microtask Queue.
4. `Promise.resolve().then(...)` schedules **Promise Microtask 3** to the Microtask Queue.
5. Second `setTimeout` schedules **Macrotask 2** to the Macrotask Queue.
6. `console.log('8. Sync End')` runs $\rightarrow$ **Logs `8. Sync End**`.

_Call Stack is now EMPTY._

---

#### Phase 2: Microtask Queue Processing (Drain All)

The Event Loop checks the Microtask Queue:

- Queue state: `[Microtask 1, Promise Microtask 3]`

1. Executes **Microtask 1** $\rightarrow$ **Logs `4. Microtask 1 (queueMicrotask)**`.

- _Side effect:_ Queues **Nested Microtask 2** to the end of the Microtask Queue.

2. Executes **Promise Microtask 3** $\rightarrow$ **Logs `6. Promise Microtask 3**`.
3. Microtask Queue still has items (`[Nested Microtask 2]`). Executes it $\rightarrow$ **Logs `5. Nested Microtask 2**`.

_Microtask Queue is now EMPTY._

---

#### Phase 3: Macrotask 1

The Event Loop picks **ONE** macrotask from the Macrotask Queue:

- Queue state: `[Macrotask 1, Macrotask 2]`

1. Executes **Macrotask 1** $\rightarrow$ **Logs `2. Macrotask 1 (Timer)**`.

- _Side effect:_ Schedules **Microtask inside Macrotask 1** to the Microtask Queue.

_Call Stack is empty again. Event Loop MUST check Microtasks before running Macrotask 2!_

---

#### Phase 4: Microtask Queue Processing (Post-Macrotask 1)

- Queue state: `[Microtask inside Macrotask 1]`

1. Executes **Microtask inside Macrotask 1** $\rightarrow$ **Logs `3. Microtask inside Macrotask 1**`.

_Microtask Queue is now EMPTY._

---

#### Phase 5: Macrotask 2

The Event Loop picks the next macrotask:

1. Executes **Macrotask 2** $\rightarrow$ **Logs `7. Macrotask 2 (Timer)**`.

---

### Final Console Output

```text
1. Sync Start
8. Sync End
4. Microtask 1 (queueMicrotask)
6. Promise Microtask 3
5. Nested Microtask 2
2. Macrotask 1 (Timer)
3. Microtask inside Macrotask 1
7. Macrotask 2 (Timer)

```

---

### Key Takeaways for Technical Interviews

- **Microtask Starvation:** Because microtasks drain completely before yielding to macrotasks or UI rendering, an infinite recursive microtask (`function loop() { Promise.resolve().then(loop); }`) will **completely freeze the UI and block timers**.
- **Rendering Pipeline:** Browsers run rendering/style recalculations _after_ the Microtask Queue drains, but _before_ picking the next Macrotask.
- **`async/await` behavior:** `await` pauses function execution and wraps the remaining function code inside a Promise `.then()` callback, effectively pushing everything after `await` into the Microtask Queue.

How do you cancel multiple ongoing async operations simultaneously using AbortSignal and AbortController?
Canceling multiple ongoing asynchronous operations simultaneously in modern JavaScript relies on passing a single **`AbortSignal`** to all operations and calling `.abort()` on its parent **`AbortController`**.

Here are the three primary patterns for managing single, composite, and timeout-driven cancellations.

---

### 1. The Core Pattern: Single Controller, Multiple Signals

When creating multiple `fetch` requests, database queries, or custom promises, attach the same `controller.signal` option to every operation. Calling `controller.abort()` cancels every operation listening to that signal at once.

```javascript
async function fetchUserDashboard() {
  const controller = new AbortController();
  const { signal } = controller;

  // Trigger cancellation automatically after 5 seconds or via manual call
  const cancelBtn = document.querySelector("#cancel-btn");
  cancelBtn.addEventListener("click", () => {
    controller.abort(new Error("User cancelled the dashboard load."));
  });

  try {
    // Pass the SAME signal to all concurrent requests
    const [userRes, postsRes, analyticsRes] = await Promise.all([
      fetch("/api/user", { signal }),
      fetch("/api/posts", { signal }),
      fetch("/api/analytics", { signal }),
    ]);

    const user = await userRes.json();
    const posts = await postsRes.json();
    const analytics = await analyticsRes.json();

    return { user, posts, analytics };
  } catch (err) {
    if (err.name === "AbortError") {
      console.warn("All 3 network requests were aborted simultaneously!");
      console.log("Abort Reason:", signal.reason); // Access the passed reason
    } else {
      console.error("Failed due to network/server error:", err);
    }
  }
}
```

---

### 2. Modern Web API Pattern: `AbortSignal.any()`

`AbortSignal.any()` combines multiple signals into a single, composite signal. If **any** of the parent signals abort, the composite signal aborts immediately.

This is ideal when an operation needs to be cancelled either by a **manual user button click** OR by an **automatic timeout**.

```javascript
async function fetchWithTimeoutAndCancel(url) {
  // 1. Manual cancellation controller
  const userController = new AbortController();

  // 2. Automatic 3-second timeout signal
  const timeoutSignal = AbortSignal.timeout(3000);

  // 3. Combine both signals into one composite signal
  const combinedSignal = AbortSignal.any([
    userController.signal,
    timeoutSignal,
  ]);

  // Hook up UI cancel button
  document.querySelector("#cancel-btn").onclick = () => {
    userController.abort(new Error("User clicked cancel"));
  };

  try {
    const response = await fetch(url, { signal: combinedSignal });
    return await response.json();
  } catch (err) {
    if (combinedSignal.aborted) {
      console.warn("Request aborted. Cause:", combinedSignal.reason);
    }
  }
}
```

---

### 3. Making Custom Async Operations Abortable

If you write custom asynchronous utilities (like a custom delay function or worker process), listen to the `abort` event on the passed `AbortSignal`:

```javascript
function abortableDelay(ms, signal) {
  return new Promise((resolve, reject) => {
    // If the signal is ALREADY aborted before starting
    if (signal?.aborted) {
      return reject(signal.reason);
    }

    const timer = setTimeout(() => {
      resolve("Completed successfully");
    }, ms);

    // Listen for the abort event
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer); // Prevent memory leaks
        reject(signal.reason);
      },
      { once: true },
    ); // Automatically clean up event listener
  });
}

// Usage Example
const controller = new AbortController();

const task1 = abortableDelay(2000, controller.signal);
const task2 = abortableDelay(4000, controller.signal);

// Abort both tasks after 1 second
setTimeout(() => controller.abort(new Error("Cancelled by timer")), 1000);

Promise.all([task1, task2]).catch((err) => {
  console.log("Both custom delays stopped:", err.message); // Output: "Cancelled by timer"
});
```

---

### Key Architectural Rules

1. **Reusability:** A single `AbortController` instance can manage an arbitrary number of simultaneous tasks (e.g., 50 parallel image downloads).
2. **One-Way Street:** Once an `AbortController` fires `.abort()`, its signal remains permanently in the `aborted: true` state. You must create a new `AbortController` instance for subsequent operations.
3. **Reason Object:** Pass an explicit error object to `controller.abort(new Error('Reason'))` so error handlers can inspect `signal.reason` or `err.cause` to distinguish between user actions, timeouts, or component unmounts.
