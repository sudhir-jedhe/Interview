To implement the `mapSeries` function in JavaScript, we need to iterate over an array and apply an asynchronous function to each element. The operations should happen sequentially—i.e., each operation waits for the previous one to finish before starting the next one.

We will use `Promise` to handle the asynchronous nature of the operations and ensure that the results are accumulated in order, similar to the behavior of `Array.map()`. If any asynchronous task fails (i.e., the callback passes an error), the entire sequence should reject the promise immediately.

### **Key Requirements:**
1. **Sequential Execution:** Each item must be processed one after the other.
2. **Asynchronous Iteration:** The function should work with asynchronous operations (i.e., using callbacks).
3. **Promise-based API:** The function should return a promise that resolves with the processed results or rejects if any error occurs.

### **Approach:**
We will use the `reduce()` function to iterate over the array, ensuring that each task is executed in sequence. For each item, we will create a new promise and chain it to the previous one. If all tasks are successful, the final result will be an array of transformed items. If any task fails, the promise chain will reject immediately.

### **Code Implementation:**

```javascript
const mapSeries = (arr, fn) => {
  // Return a new promise
  return new Promise((resolve, reject) => {
    const output = [];
    
    // Reduce the array to a chain of promises
    const final = arr.reduce((promiseChain, item) => {
      return promiseChain.then((accumulatedResults) => {
        // Return a new promise for the current item
        return new Promise((resolve, reject) => {
          fn(item, (error, result) => {
            if (error) {
              reject(error); // Reject the promise if an error occurs
            } else {
              resolve([...accumulatedResults, result]); // Append the result to the accumulated results
            }
          });
        });
      });
    }, Promise.resolve([])); // Initial resolved promise with an empty array

    // Once the final promise resolves, return the results
    final
      .then((result) => {
        resolve(result); // Resolve with the accumulated results
      })
      .catch((e) => {
        reject(e); // Reject if any promise in the chain fails
      });
  });
};

// Test Case 1: All inputs resolve
let numPromise1 = mapSeries([1, 2, 3, 4, 5], function (num, callback) {
  setTimeout(function () {
    num = num * 2;
    console.log(num);

    callback(null, num); // No error, resolve with the processed value
  }, 2000);
});

numPromise1
  .then((result) => console.log("success:", result))
  .catch(() => console.log("no success"));

// Test Case 2: One of the tasks rejects
let numPromise2 = mapSeries([1, 2, 3, 4, 5], function (num, callback) {
  setTimeout(function () {
    num = num * 2;
    console.log(num);

    // Simulate error if num equals 8
    if (num === 8) {
      callback(true); // Error condition
    } else {
      callback(null, num); // No error, resolve with the processed value
    }
  }, 2000);
});

numPromise2
  .then((result) => console.log("success:", result))
  .catch(() => console.log("no success"));
```

### **Explanation of Code:**

1. **Function Signature:** `mapSeries(arr, fn)`
   - `arr`: The input array of items to process.
   - `fn`: The asynchronous iteratee function that processes each item. It takes two parameters: the item to process and a callback function (`callback(error, result)`).

2. **Promise Chain (`reduce`):**
   - We use `reduce` to accumulate promises in sequence. The accumulator is a promise chain where each promise depends on the completion of the previous one.
   - The promise for each item is created within the callback passed to `reduce`. It ensures that each item is processed one after the other.

3. **Callback Handling:**
   - Inside the async iteratee (`fn`), we call the provided callback with either `null` (no error) or an error value. If an error occurs, the promise is immediately rejected, and the process stops.
   - If the callback is successful, the result is added to the accumulated results array.

4. **Final Result:**
   - Once all promises have resolved, the `mapSeries` function resolves with the accumulated results array.
   - If any error is encountered during processing, the promise rejects with the error.

---

### **Test Case 1: All inputs resolve**

```javascript
let numPromise1 = mapSeries([1, 2, 3, 4, 5], function (num, callback) {
  setTimeout(function () {
    num = num * 2;
    console.log(num); // Output each processed value

    callback(null, num); // Successfully processed, no error
  }, 2000);
});

numPromise1
  .then((result) => console.log("success:", result)) // After all items are processed
  .catch(() => console.log("no success"));
```

**Output:**

```
2
4
6
8
10
success: [2, 4, 6, 8, 10]
```

- Each number is printed after a delay of 2 seconds.
- After all items are processed, the promise resolves with the array `[2, 4, 6, 8, 10]`.

---

### **Test Case 2: One of the tasks rejects**

```javascript
let numPromise2 = mapSeries([1, 2, 3, 4, 5], function (num, callback) {
  setTimeout(function () {
    num = num * 2;
    console.log(num); // Output each processed value

    // Simulate an error when num equals 8
    if (num === 8) {
      callback(true); // Error condition
    } else {
      callback(null, num); // Successfully processed, no error
    }
  }, 2000);
});

numPromise2
  .then((result) => console.log("success:", result))
  .catch(() => console.log("no success"));
```

**Output:**

```
2
4
6
8
no success
```

- Numbers are processed sequentially, but when the number `8` is reached (from doubling `4`), the callback is called with an error, causing the entire process to fail.
- The promise is rejected, and "no success" is logged.

---

### **Edge Cases:**
1. **Empty Array:** If the input array is empty, the promise resolves immediately with an empty array.
2. **Error Handling:** If an error is triggered in any iteration, the entire promise chain rejects.
3. **Concurrency Issues:** `mapSeries` ensures strict sequential execution, so there won't be concurrency issues.

---

### **Conclusion:**
The `mapSeries` function processes items in an array sequentially while handling asynchronous operations using callbacks. It uses `reduce` to ensure each task waits for the previous one to complete, and `Promise` ensures the entire operation is asynchronous and can handle success or failure appropriately.