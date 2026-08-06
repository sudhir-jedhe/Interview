### **Asynchronous JavaScript Cheat Sheet**

Asynchronous JavaScript allows you to handle tasks like API calls, timers, and other operations that take time without blocking the main thread. This cheat sheet covers core concepts and usage of promises, `async/await`, and other related functions.

---

### **1. Promise Basics**

- **State of a Promise:**
  - **Pending**: Initial state.
  - **Fulfilled**: The operation completed successfully with a result.
  - **Rejected**: The operation failed with an error.

- **Creating Promises**:
  - `new Promise(executor)` where `executor` is a function that takes two arguments: `resolve` and `reject`.

```javascript
// Resolving with a value
new Promise((resolve, reject) => {
  setTimeout(() => resolve("Success"), 1000);
});

// Rejecting with an error
new Promise((resolve, reject) => {
  setTimeout(() => reject("Error occurred"), 1000);
});
```

- **Static Methods**:
  - `Promise.resolve(val)`: Returns a resolved promise with the value `val`.
  - `Promise.reject(err)`: Returns a rejected promise with the error `err`.

```javascript
const resolvedPromise = Promise.resolve(42); // Fulfilled with 42
const rejectedPromise = Promise.reject('Oops!'); // Rejected with 'Oops!'
```

- **Collapsing Promises**: A promise inside a promise collapses into a single promise.

```javascript
new Promise((resolve, reject) => {
  resolve(Promise.resolve("Inner Promise"));
}).then(result => console.log(result)); // "Inner Promise"
```

---

### **2. Handling Promises**

#### **.then()**

The `.then()` method is used to handle the outcome of a promise (fulfilled or rejected).

```javascript
new Promise((resolve, reject) => resolve('Data'))
  .then(value => console.log(value)) // Will log 'Data'
  .catch(error => console.log(error)); // If rejected, it catches the error
```

- **`then()` parameters**:
  - `onFulfilled`: Executed when the promise is fulfilled.
  - `onRejected`: Executed when the promise is rejected.

#### **.catch()**

Used to handle promise rejection.

```javascript
new Promise((resolve, reject) => reject("Error!"))
  .catch(err => console.log(err)); // Will log 'Error!'
```

#### **.finally()**

Runs regardless of the promise outcome, useful for cleanup tasks.

```javascript
new Promise((resolve, reject) => resolve("Done"))
  .finally(() => console.log("Execution complete"))
  .then(value => console.log(value)); // Logs 'Execution complete' then 'Done'
```

- **`finally()`**: Always runs after `.then()` or `.catch()`, and passes through the input promise.

---

### **3. Combining Promises**

#### **Promise.all()**

`Promise.all()` takes an array of promises and returns a single promise that resolves when all of the input promises have resolved. If one promise is rejected, the whole promise is rejected.

```javascript
Promise.all([p1, p2, p3])
  .then(([v1, v2, v3]) => {
    console.log(v1, v2, v3); // Values are ordered as per the promises' original order
  })
  .catch(err => console.log(err)); // Catches if any promise fails
```

#### **Promise.race()**

`Promise.race()` returns the result of the first promise that settles (either resolves or rejects).

```javascript
Promise.race([p1, p2, p3])
  .then(value => {
    console.log(value); // The value of the first promise that resolves or rejects
  });
```

#### **Promise.allSettled()**

`Promise.allSettled()` waits for all promises to either resolve or reject and returns an array of results.

```javascript
Promise.allSettled([p1, p2, p3])
  .then(results => console.log(results)); // Results contain both resolved and rejected promises
```

---

### **4. Async/Await**

#### **Async Functions**

- An `async` function always returns a **Promise**.
- `await` can be used inside `async` functions to pause the execution until the promise resolves.

```javascript
// Async function example
async function fetchData() {
  return "Data fetched"; // Returns a Promise
}

fetchData().then(result => console.log(result)); // "Data fetched"
```

#### **Await**

- The `await` keyword pauses execution until the promise resolves.
- It can only be used inside an `async` function.

```javascript
// Example with await
async function getData() {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  console.log(data);
}
```

- **Important**: Even if the promise is already resolved, `await` still waits at least one tick (microtask) before continuing.

#### **Error Handling with Async/Await**

You can handle errors in `async/await` using `try/catch`.

```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.log('Error:', err);
  }
}

fetchData();
```

---

### **5. Practical Examples**

#### **Example 1: Simple Promise with Async/Await**

```javascript
async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  return data;
}

fetchData()
  .then(data => console.log(data))
  .catch(err => console.log('Error:', err));
```

#### **Example 2: Fetch Multiple API Requests in Parallel**

```javascript
async function fetchMultipleData() {
  const [data1, data2] = await Promise.all([
    fetch('https://api.example.com/data1').then(res => res.json()),
    fetch('https://api.example.com/data2').then(res => res.json())
  ]);
  console.log(data1, data2);
}

fetchMultipleData();
```

#### **Example 3: Fetch with Timeout**

```javascript
function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  return fetch(url, { signal: controller.signal })
    .finally(() => clearTimeout(timeoutId));
}

async function getData() {
  try {
    const response = await fetchWithTimeout('https://api.example.com/data', 3000);
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.log('Request timed out or failed:', err);
  }
}

getData();
```

---

### **6. Summary of Key Methods and Functions**

| Method | Description |
|--------|-------------|
| `Promise.resolve(value)` | Returns a promise that resolves with the provided value |
| `Promise.reject(error)` | Returns a promise that rejects with the provided error |
| `.then(onFulfilled, onRejected)` | Handles the fulfilled value or rejected error of a promise |
| `.catch(onRejected)` | Catches rejected promises and handles the error |
| `.finally(onFinally)` | Executes a final cleanup, no matter the promise outcome |
| `Promise.all([promise1, promise2, ...])` | Waits for all promises to resolve, returns an array of values |
| `Promise.race([promise1, promise2, ...])` | Returns the result of the first promise that resolves/rejects |
| `Promise.allSettled([promise1, promise2, ...])` | Waits for all promises to settle (resolve/reject) |
| `async function()` | Declares an asynchronous function that returns a promise |
| `await promise` | Pauses the async function execution until the promise resolves |

---

With these concepts and methods in mind, handling asynchronous operations in JavaScript becomes much simpler and more manageable. Whether you're fetching data, handling multiple async tasks, or dealing with errors, the **Promise** API and **async/await** syntax provide powerful tools for asynchronous programming.