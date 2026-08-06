# Asynchronous JavaScript Cheat Sheet

This cheat sheet covers core concepts and usage of promises, \`async/await\`, and other related functions in asynchronous JavaScript.

## 1. Promise Basics

Promises represent the eventual completion or failure of an asynchronous operation.

### States of a Promise:
- **Pending**: Initial state
- **Fulfilled**: Operation completed successfully
- **Rejected**: Operation failed

### Creating Promises:

\`\`\`javascript
// Resolving with a value
new Promise((resolve, reject) => {
  setTimeout(() => resolve("Success"), 1000);
});

// Rejecting with an error
new Promise((resolve, reject) => {
  setTimeout(() => reject("Error occurred"), 1000);
});
\`\`\`

### Static Methods:

\`\`\`javascript
const resolvedPromise = Promise.resolve(42);
const rejectedPromise = Promise.reject('Oops!');
\`\`\`

## 2. Handling Promises

### .then()

\`\`\`javascript
new Promise((resolve, reject) => resolve('Data'))
  .then(value => console.log(value))
  .catch(error => console.log(error));
\`\`\`

### .catch()

\`\`\`javascript
new Promise((resolve, reject) => reject("Error!"))
  .catch(err => console.log(err));
\`\`\`

### .finally()

\`\`\`javascript
new Promise((resolve, reject) => resolve("Done"))
  .finally(() => console.log("Execution complete"))
  .then(value => console.log(value));
\`\`\`

## 3. Combining Promises

### Promise.all()

\`\`\`javascript
Promise.all([p1, p2, p3])
  .then(([v1, v2, v3]) => {
    console.log(v1, v2, v3);
  })
  .catch(err => console.log(err));
\`\`\`

### Promise.race()

\`\`\`javascript
Promise.race([p1, p2, p3])
  .then(value => {
    console.log(value);
  });
\`\`\`

### Promise.allSettled()

\`\`\`javascript
Promise.allSettled([p1, p2, p3])
  .then(results => console.log(results));
\`\`\`

## 4. Async/Await

### Async Functions

\`\`\`javascript
async function fetchData() {
  return "Data fetched";
}

fetchData().then(result => console.log(result));
\`\`\`

### Await

\`\`\`javascript
async function getData() {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  console.log(data);
}
\`\`\`

### Error Handling with Async/Await

\`\`\`javascript
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
\`\`\`

## 5. Practical Examples

### Example 1: Simple Promise with Async/Await

\`\`\`javascript
async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  return data;
}

fetchData()
  .then(data => console.log(data))
  .catch(err => console.log('Error:', err));
\`\`\`

### Example 2: Fetch Multiple API Requests in Parallel

\`\`\`javascript
async function fetchMultipleData() {
  const [data1, data2] = await Promise.all([
    fetch('https://api.example.com/data1').then(res => res.json()),
    fetch('https://api.example.com/data2').then(res => res.json())
  ]);
  console.log(data1, data2);
}

fetchMultipleData();
\`\`\`

### Example 3: Fetch with Timeout

\`\`\`javascript
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
\`\`\`

## 6. Summary of Key Methods and Functions

| Method | Description |
|--------|-------------|
| \`Promise.resolve(value)\` | Returns a promise that resolves with the provided value |
| \`Promise.reject(error)\` | Returns a promise that rejects with the provided error |
| \`.then(onFulfilled, onRejected)\` | Handles the fulfilled value or rejected error of a promise |
| \`.catch(onRejected)\` | Catches rejected promises and handles the error |
| \`.finally(onFinally)\` | Executes a final cleanup, no matter the promise outcome |
| \`Promise.all([promise1, promise2, ...])\` | Waits for all promises to resolve, returns an array of values |
| \`Promise.race([promise1, promise2, ...])\` | Returns the result of the first promise that resolves/rejects |
| \`Promise.allSettled([promise1, promise2, ...])\` | Waits for all promises to settle (resolve/reject) |
| \`async function()\` | Declares an asynchronous function that returns a promise |
| \`await promise\` | Pauses the async function execution until the promise resolves |

With these concepts and methods in mind, handling asynchronous operations in JavaScript becomes much simpler and more manageable. Whether you're fetching data, handling multiple async tasks, or dealing with errors, the Promise API and async/await syntax provide powerful tools for asynchronous programming.

