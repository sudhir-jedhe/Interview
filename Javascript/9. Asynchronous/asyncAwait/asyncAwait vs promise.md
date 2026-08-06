In JavaScript, **Promises** are the foundation for handling asynchronous operations, while **`async` / `await**` is modern syntax built on top of Promises to make asynchronous code look and behave like synchronous code.

There is no native `wait` keyword in JavaScript—it is **`await`** that pauses execution until a Promise resolves.

---

### Core Comparison

| Feature            | Promises (`.then()` / `.catch()`)                 | `async` / `await`                           |
| ------------------ | ------------------------------------------------- | ------------------------------------------- |
| **Syntax Style**   | Method chaining via callbacks                     | Sequential, synchronous-looking code        |
| **Error Handling** | `.catch()` method chains                          | Standard `try...catch` blocks               |
| **Readability**    | Can lead to nested "callback hell" or long chains | Very clean and easy to follow top-to-bottom |
| **Under the Hood** | Built-in JavaScript `Promise` object              | Syntactic sugar built directly on Promises  |
| **Execution**      | Non-blocking callback execution                   | Pauses async function execution at `await`  |

---

### 1. The Promise Approach (`.then()` and `.catch()`)

A **Promise** represents a value that may not be available yet, but will be resolved in the future (or rejected if an error occurs).

To handle the resolved result, you attach callbacks using **`.then()`**.

```javascript
function fetchUserData() {
  fetch('https://api.example.com/user')
    .then(response => response.json())
    .then(user => {
      console.log('User name:', user.name);
      return fetch(`https://api.example.com/posts?userId=${user.id}`);
    })
    .then(response => response.json())
    .then(posts => {
      console.log('User posts:', posts);
    })
    .catch(error => {
      console.error('An error occurred:', error);
    });
}

```

* **Pros:** Great for parallel operations (e.g., `Promise.all()`).
* **Cons:** Deeply nested or chained `.then()` calls can become hard to read and debug.

---

### 2. The `async` / `await` Approach

Introduced in ES2017, **`async` / `await**` provides a cleaner syntax to work with Promises without needing chaining callbacks.

* **`async`**: Placed before a function declaration to indicate that it returns a Promise.
* **`await`**: Placed inside an `async` function before a Promise. It pauses the function execution until the Promise resolves and returns its value.

```javascript
async function fetchUserData() {
  try {
    const response = await fetch('https://api.example.com/user');
    const user = await response.json();
    console.log('User name:', user.name);

    const postsResponse = await fetch(`https://api.example.com/posts?userId=${user.id}`);
    const posts = await postsResponse.json();
    console.log('User posts:', posts);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

```

---

### How They Compare Under the Hood

`async` and `await` do **not** replace Promises—they are merely a visual wrapper around Promises.

```javascript
// Function returning a raw Promise
function getNumberPromise() {
  return Promise.resolve(42);
}

// Equivalent function using `async`
async function getNumberAsync() {
  return 42; // Automatically wrapped in a resolved Promise!
}

// Both are consumed identically:
getNumberAsync().then(val => console.log(val)); // 42

```

---

### When to Use Which?

1. **Use `async` / `await` for sequential asynchronous steps:** When Task B depends on the result of Task A, `async` / `await` is significantly cleaner and easier to read.
2. **Use `Promise.all()` for parallel operations:** When you want to fire off multiple tasks simultaneously without waiting for each one sequentially:

```javascript
async function fetchDashboardData() {
  // Runs both fetch calls concurrently in parallel
  const [usersResponse, postsResponse] = await Promise.all([
    fetch('/api/users'),
    fetch('/api/posts')
  ]);
  
  const users = await usersResponse.json();
  const posts = await postsResponse.json();
  return { users, posts };
}

```

What are the best practices for error handling in JavaScript async/await functions?

Effective error handling in `async/await` requires anticipating both expected application failures (like network or validation errors) and unexpected runtime exceptions.

---

### 1. Wrap Await Statements in `try...catch...finally` Blocks

The standard way to handle errors in `async` functions is using `try...catch`. Always include a `finally` block when managing resources that must be cleaned up regardless of success or failure (e.g., closing file handles, stopping loading spinners).

```javascript
async function loadUserData(userId) {
  showLoadingSpinner();
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to load user ${userId}:`, error.message);
    showErrorMessage("Could not load user profile.");
    return null;
  } finally {
    hideLoadingSpinner(); // Always executes
  }
}

```

---

### 2. Check HTTP Response Status explicitly (`fetch` Gotcha)

A common mistake is assuming `await fetch()` throws an error on $4\text{xx}$ or $5\text{xx}$ HTTP statuses. **It does not.** `fetch()` only rejects its promise on network failures or blocked requests.

You must manually check `response.ok` or `response.status`:

```javascript
async function fetchResource(url) {
  const response = await fetch(url);
  
  // Explicitly check for non-2xx status codes
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
  }
  
  return await response.json();
}

```

---

### 3. Avoid Unhandled Promise Rejections at Higher Levels

If an `async` function throws an error and has no internal `try...catch`, it returns a **rejected Promise**. The caller must either handle it with `try...catch` (if using `await`) or attach a `.catch()` block.

```javascript
// Function that throws without a try-catch
async function fetchData() {
  const res = await fetch('/api/data');
  return res.json();
}

// Option A: Handle with await in another async function
async function main() {
  try {
    const data = await fetchData();
  } catch (err) {
    console.error('Handled in main:', err);
  }
}

// Option B: Handle with .catch() if not using await
fetchData().catch(err => {
  console.error('Handled via .catch():', err);
});

```

---

### 4. Use the Safe-Assignment / Go-Style Pattern for Clean Control Flow

Deeply nested `try...catch` blocks can lead to unreadable code ("try-catch hell"). A clean alternative—popularized by Go and utility wrappers—is returning a tuple of `[error, result]`:

```javascript
// Utility helper function
async function to(promise) {
  try {
    const data = await promise;
    return [null, data];
  } catch (err) {
    return [err, null];
  }
}

// Usage: Flat, highly readable error handling
async function processOrder(orderId) {
  const [userErr, user] = await to(fetchUser());
  if (userErr) return handleUserError(userErr);

  const [orderErr, order] = await to(fetchOrder(orderId));
  if (orderErr) return handleOrderError(orderErr);

  return { user, order };
}

```

---

### 5. Handle Parallel Async Operations Correctly (`Promise.all` vs `Promise.allSettled`)

* **`Promise.all()` (Fail-Fast):** Rejects immediately if **any** promise rejects, aborting the rest. Use this when all tasks are strictly mandatory.
* **`Promise.allSettled()` (Resilient):** Waits for **all** promises to finish, regardless of whether they fulfilled or rejected. Use this when partial success is acceptable.

```javascript
async function fetchDashboardMetrics() {
  const results = await Promise.allSettled([
    fetch('/api/analytics'),
    fetch('/api/notifications'),
    fetch('/api/user-settings')
  ]);

  // Handle individual failures without crashing the entire page
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`Task ${index} succeeded:`, result.value);
    } else {
      console.error(`Task ${index} failed:`, result.reason);
    }
  });
}

```

---

### 6. Create Custom Error Classes for Domain-Specific Failures

Distinguish between expected business errors (e.g., `ValidationError`, `AuthError`) and technical runtime bugs using custom error classes:

```javascript
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

async function loginUser(credentials) {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    if (response.status === 401) {
      throw new ApiError('Invalid username or password', 401);
    }
  } catch (err) {
    if (err instanceof ApiError) {
      // Show user-friendly alert for expected auth failure
      showToast(err.message);
    } else {
      // Log critical unexpected system crash
      logToMonitoringService(err);
    }
  }
}

```

---

### 7. Global Fallback Safety Nets

Even with local error handling, unhandled rejections can slip through. Always set up top-level global handlers to capture uncaught errors before they crash your process or browser session.

```javascript
// Browser Environment
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  // Send error report to Sentry/Datadog
});

// Node.js Environment
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Gracefully shut down or alert monitoring
});

```

---

### Summary Checklist

| Practice                 | Recommendation                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------- |
| **Basic Error Handling** | Use `try...catch...finally` for predictable control flow.                          |
| **Fetch API**            | Manually check `response.ok` before parsing JSON.                                  |
| **Parallel Tasks**       | Use `Promise.allSettled()` to prevent single-task failures from failing the batch. |
| **Code Organization**    | Consider `[err, data]` tuples to flatten nested `try...catch` blocks.              |
| **Global Safety**        | Always register `unhandledrejection` listeners at the app root.                    |
