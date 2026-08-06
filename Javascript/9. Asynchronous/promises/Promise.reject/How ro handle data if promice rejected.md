When a **Promise** is rejected, you typically handle it by using `.catch()` or `try-catch` within an `async` function. If you want to handle the data when the promise is rejected, you can capture the error (or rejection reason) and handle it gracefully.

Here are some methods for handling **rejected promises** and managing the associated data:

### 1. **Using `.catch()` with a Promise**
If a promise is rejected, the `.catch()` method can be used to handle the error. You can access the error message or data in the callback passed to `.catch()`.

#### Example:
```javascript
const myPromise = new Promise((resolve, reject) => {
  // Simulate rejection
  reject('Something went wrong!');
});

myPromise
  .then((result) => {
    // Handle resolved promise (if any)
    console.log('Success:', result);
  })
  .catch((error) => {
    // Handle rejected promise (error)
    console.log('Error:', error);  // Output: Error: Something went wrong!
  });
```

In this example:
- If the promise is **resolved**, the `.then()` block is executed.
- If the promise is **rejected**, the `.catch()` block is executed, and the error message `'Something went wrong!'` is printed.

### 2. **Using `async`/`await` with `try-catch`**

If you're using `async`/`await`, you can handle promise rejection using a `try-catch` block. The rejected promise will throw an error that you can catch in the `catch` block.

#### Example:
```javascript
const myPromise = new Promise((resolve, reject) => {
  // Simulate rejection
  reject('Something went wrong!');
});

async function handlePromise() {
  try {
    const result = await myPromise;  // Wait for the promise to resolve
    console.log('Success:', result);
  } catch (error) {
    // Handle the rejected promise here
    console.log('Error:', error);  // Output: Error: Something went wrong!
  }
}

handlePromise();
```

In this example:
- If the promise is resolved, the `await` expression will get the result.
- If the promise is rejected, the error is caught in the `catch` block and handled.

### 3. **Handling Rejection with Data (Custom Error Data)**

If your promise returns a **rejection with specific data** (e.g., an error object or custom error message), you can access that data in the `.catch()` or `catch` block.

#### Example with Custom Error Object:
```javascript
const myPromise = new Promise((resolve, reject) => {
  // Simulate rejection with custom error data
  reject({ message: 'Network Error', code: 500 });
});

myPromise
  .then((result) => {
    // Handle resolved promise
    console.log('Success:', result);
  })
  .catch((error) => {
    // Handle rejection with error data
    console.log('Error Message:', error.message);  // Output: Error Message: Network Error
    console.log('Error Code:', error.code);        // Output: Error Code: 500
  });
```

### 4. **Using `finally()` to Handle Both Resolved and Rejected Promises**

You can use `.finally()` to execute code that runs after the promise has either been resolved or rejected. It is useful for clean-up tasks, regardless of whether the promise was successful or not.

#### Example:
```javascript
const myPromise = new Promise((resolve, reject) => {
  // Simulate rejection
  reject('Something went wrong!');
});

myPromise
  .then((result) => {
    // Handle resolved promise
    console.log('Success:', result);
  })
  .catch((error) => {
    // Handle rejected promise
    console.log('Error:', error);  // Output: Error: Something went wrong!
  })
  .finally(() => {
    // Clean-up code, runs regardless of resolve or reject
    console.log('Operation finished');  // This will always run
  });
```

### Summary of Methods:
- **`.catch()`**: Handles promise rejection and allows you to access the error.
- **`try-catch` (with `async`/`await`)**: Allows synchronous-style handling of promises and catches errors.
- **`.finally()`**: Executes code after the promise resolves or rejects, regardless of the result.

These approaches give you flexibility in how you handle rejected promises and manage data depending on the outcome of the promise (whether it resolves or rejects).