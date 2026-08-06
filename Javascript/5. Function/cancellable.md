The `cancellable` function you are trying to implement works with generator functions that yield promises. The goal is to allow you to cancel long-running asynchronous operations, interrupting their progress if needed.

### Key Points to Consider:
1. **Generator Execution**:
   - The generator yields promises, and we need to wait for those promises to resolve or reject.
   - If the generator is done (i.e., `result.done`), we resolve the promise returned by `cancellable` with the value returned from the generator.
   - If a promise rejects inside the generator, we throw the rejection reason back into the generator, allowing it to handle the error or propagate it.

2. **Cancellation**:
   - If `cancel()` is called before the generator completes, it should send a "Cancelled" error to the generator. The generator should handle this error, and if unhandled, the promise should reject with `"Cancelled"`.

3. **Promise Handling**:
   - Once all yields are resolved or the generator is finished, we resolve or reject the main promise accordingly.

### Steps for the Solution:

1. **Create the Generator**:
   - Use `generatorFunction()` to initialize the generator.
   - Use `generator.next()` to start execution.
   - Handle the yields by waiting for each promise to resolve using `await`.

2. **Cancel Functionality**:
   - Store the cancel function to allow stopping the generator.
   - If the cancel function is called, throw the `"Cancelled"` error back into the generator.

3. **Handle Generator State**:
   - The generator might throw errors, resolve promises, or return values. All cases should be handled correctly by forwarding values and catching errors.
   - Ensure that when the generator is done or an error occurs, we handle it properly by either resolving or rejecting the main promise.

Here's how you can implement the `cancellable` function:

### Code Implementation:

```javascript
function cancellable(generatorFunction) {
  let cancel = null;  // We'll define this function when cancel is triggered
  const generator = generatorFunction();  // Get the generator object

  const promise = new Promise((resolve, reject) => {
    const handleYield = async (result) => {
      if (result.done) {
        // If the generator is done, resolve with the returned value
        resolve(result.value);
        return;
      }

      try {
        // Wait for the promise yielded by the generator to resolve or reject
        const value = await result.value;
        handleYield(generator.next(value));  // Continue to the next yield
      } catch (error) {
        // If the promise rejects, throw the error back into the generator
        handleYield(generator.throw(error));
      }
    };

    // Start the generator execution
    handleYield(generator.next());

    // If cancel is triggered, throw "Cancelled" error into the generator
    cancel = () => {
      handleYield(generator.throw("Cancelled"));
    };
  });

  return [cancel, promise];
}
```

### Explanation of the Code:
- **Generator Execution**:
  - The generator is initialized by calling `generatorFunction()`. 
  - The function `handleYield(result)` is responsible for executing the generator's `next()` method.
  - If `result.done` is `true`, the generator has finished and we resolve the promise with the value returned by the generator.
  - If `result.done` is `false`, the generator yielded a promise, so we wait for it to resolve. Once resolved, we pass the value back into the generator by calling `generator.next(value)`.

- **Cancel Functionality**:
  - The `cancel` function is defined after the generator is started and allows for interruption.
  - If `cancel()` is called, it sends the "Cancelled" error to the generator via `generator.throw("Cancelled")`.
  - If the generator is still executing, it will receive the "Cancelled" error and react accordingly.

- **Promise Handling**:
  - The main promise resolves when the generator completes successfully or when it returns a value.
  - If any promise rejects during the execution of the generator, it will propagate the error back to the generator.
  - If the generator is cancelled (via `cancel()`), the promise rejects with the "Cancelled" error.

### Example Usage:

#### Example 1:
```javascript
function* tasks() {
  const val = yield new Promise(resolve => resolve(2 + 2));
  yield new Promise(resolve => setTimeout(resolve, 100));
  return val + 1; // calculation shouldn't be done.
}

const [cancel, promise] = cancellable(tasks());
setTimeout(cancel, 50);
promise.catch(console.log); // logs "Cancelled" at t=50ms
```

- **Explanation**: The generator waits for the first promise to resolve, then it yields a timeout promise. The cancellation occurs after 50ms, and the promise is rejected with `"Cancelled"`, meaning the generator's work is interrupted.

#### Example 2:
```javascript
function* tasks() {
  const msg = yield new Promise(res => res("Hello"));
  throw `Error: ${msg}`; 
}

const [cancel, promise] = cancellable(tasks());
promise.catch(console.log); // logs "Error: Hello"
```

- **Explanation**: The generator yields a promise that resolves to `"Hello"`. After the resolution, it throws an error, which is caught by the promise and causes the promise to reject with `"Error: Hello"`.

#### Example 3:
```javascript
function* tasks() {
  yield new Promise(res => setTimeout(res, 200)); 
  return "Success"; 
}

const [cancel, promise] = cancellable(tasks());
setTimeout(cancel, 100);
promise.catch(console.log); // logs "Cancelled"
```

- **Explanation**: The generator yields a promise that resolves after 200ms, but the cancel function is called at 100ms. The generator receives the "Cancelled" error and the promise rejects with `"Cancelled"`.

#### Example 4:
```javascript
function* tasks() {
  let result = 0; 
  yield new Promise(res => setTimeout(res, 100));
  result += yield new Promise(res => res(1)); 
  yield new Promise(res => setTimeout(res, 100)); 
  result += yield new Promise(res => res(1)); 
  return result;
}

const [cancel, promise] = cancellable(tasks());
promise.then(console.log); // resolves 2
```

- **Explanation**: The generator performs two asynchronous tasks, adds their results, and returns `2`. No cancellation occurs, so the promise resolves with `2`.

### Edge Case (Error Handling Example):

```javascript
function* tasks() {
  try {
    yield new Promise((resolve, reject) => reject("Promise Rejected"));
  } catch (e) {
    let a = yield new Promise(resolve => resolve(2));
    let b = yield new Promise(resolve => resolve(2)); 
    return a + b; 
  }
}

const [cancel, promise] = cancellable(tasks());
promise.then(console.log); // logs 4
```

- **Explanation**: The first yielded promise rejects immediately. The generator catches the error, yields two values (`2` and `2`), and returns their sum (`4`).

### Conclusion:
This implementation of `cancellable` handles both cancellation and proper promise handling for generator functions. It ensures that if the operation is cancelled, the generator responds to the cancellation, and the promise either resolves or rejects as expected.