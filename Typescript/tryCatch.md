The `try`, `catch`, and `finally` blocks in JavaScript are powerful constructs used to handle errors gracefully, allowing developers to prevent their applications from crashing due to unexpected conditions. Here's a detailed breakdown of these constructs with various examples, use cases, and nuances.

### **Basic Syntax**

```javascript
try {
  // Code that may throw an error
} catch (error) {
  // Code to handle the error
} finally {
  // Code that always executes regardless of whether an error occurred
}
```

### **1. The `try` Block**

The `try` block contains the code that you suspect may throw an error. If an error occurs in the `try` block, control is passed to the `catch` block. If no error occurs, the `catch` block is skipped.

### **2. The `catch` Block**

The `catch` block handles errors thrown from the `try` block. You can optionally capture the error object (commonly called `error` or `err`) to get details about the error.

### **3. The `finally` Block**

The `finally` block is optional but very useful. It always executes, regardless of whether an error occurred or not. This is often used for cleanup operations, such as closing database connections or releasing resources.

### **Example 1: Basic Try-Catch**

```javascript
try {
  if (3 + 2 !== 4) {
    throw "Not equal to 4";
  } else {
    console.log("2 + 2 is 4");
  }
} catch (err) {
  console.log("There is an error: " + err);
}
// Output: "There is an error: Not equal to 4"
```

In this example:

- The code inside the `try` block checks if `3 + 2` is equal to `4`. Since it’s not, it throws an error with the message `'Not equal to 4'`.
- The `catch` block catches the error and prints the message.

### **Example 2: Using `finally` Block**

```javascript
try {
  if (2 + 2 !== 4) {
    throw "Not equal to 4";
  } else {
    console.log("2 + 2 is 4");
  }
} catch (err) {
  console.log("There is an error: " + err);
} finally {
  console.log("This will execute regardless of the result.");
}
// Output:
// "2 + 2 is 4"
// "This will execute regardless of the result."
```

In this example:

- The `finally` block executes after the `try` (and `catch`, if present) blocks. It will always run, even if no error occurs.

### **Example 3: Using `catch` with Conditional Logic**

You can check the type of error by using conditional statements like `if`, `instanceof`, or `switch`.

```javascript
try {
  if (2 + 2 !== 4) {
    throw new Error("It is not equal to 4");
  } else {
    return true;
  }
} catch (err) {
  if (err instanceof TypeError) {
    console.log(`There is a TypeError: ${err}`);
  } else if (err instanceof RangeError) {
    console.log(`There is a RangeError: ${err}`);
  } else {
    console.log(`There is a general error: ${err}`);
  }
}
// Output: "There is a general error: Error: It is not equal to 4"
```

In this example:

- The error type is checked using `instanceof` to determine whether it's a `TypeError`, `RangeError`, or any other error.

### **Example 4: Nested Try-Catch**

You can nest `try-catch` blocks to handle errors at different levels:

```javascript
try {
  try {
    throw "I was inside the nested try at level 2";
  } finally {
    console.log("I will execute no matter what");
  }
} catch (err) {
  console.log(`There is an error caught at level 1: ${err}`);
}
// Output:
// "I will execute no matter what"
// "There is an error caught at level 1: I was inside the nested try at level 2"
```

In this example:

- The inner `try` throws an error, which is then handled by the `catch` block in the outer scope.
- The `finally` block always executes, regardless of whether an error is thrown or caught.

### **Example 5: Catching Errors and Re-Throwing Them**

You can catch an error, handle it, and then re-throw it to be handled at a higher level.

```javascript
try {
  try {
    throw "I was inside the nested try at level 2";
  } catch (err) {
    console.log(`There is an error caught at level 2: ${err}`);
    throw "I was inside the nested catch at level 2"; // Re-throwing error
  } finally {
    console.log("I will execute no matter what");
  }
} catch (err) {
  console.log(`There is an error caught at level 1: ${err}`);
}
// Output:
// "There is an error caught at level 2: I was inside the nested try at level 2"
// "I will execute no matter what"
// "There is an error caught at level 1: I was inside the nested catch at level 2"
```

In this example:

- After the error is caught in the inner `catch`, it is re-thrown, and the outer `catch` block catches and logs it.

### **Multiple Catch Blocks and Error Types**

JavaScript doesn't support multiple `catch` blocks as some other languages do, but you can differentiate error types inside a single `catch` block using conditionals.

```javascript
try {
  throw new RangeError("Out of range!");
} catch (err) {
  if (err instanceof RangeError) {
    console.log("RangeError caught: " + err);
  } else if (err instanceof TypeError) {
    console.log("TypeError caught: " + err);
  } else {
    console.log("Some other error caught: " + err);
  }
}
// Output: "RangeError caught: Out of range!"
```

### **Example 6: Try without `catch` (Only `finally`)**

You can use `try` with only a `finally` block. This is useful when you need to ensure certain code is always executed, regardless of whether an error occurs.

```javascript
try {
  console.log("Trying something...");
} finally {
  console.log("I am finally free!");
}
// Output:
// "Trying something..."
// "I am finally free!"
```

### **Best Practices:**

1. **Always handle errors**: It's important to handle errors in a meaningful way to prevent your application from failing unexpectedly.
2. **Avoid empty `catch` blocks**: Empty `catch` blocks can silently ignore errors, making it difficult to debug.
3. **Use `finally` for cleanup**: Use `finally` for tasks that must be executed whether an error occurs or not, such as closing database connections, logging out users, or clearing resources.
4. **Error logging**: It’s good practice to log errors (using `console.error` or other logging mechanisms) for debugging and monitoring purposes.
5. **Don't swallow errors**: Avoid using `try-catch` in a way that swallows errors without logging or notifying the user.

### Conclusion:

JavaScript's `try`, `catch`, and `finally` provide a robust mechanism for error handling. By using these constructs effectively, you can prevent application crashes and provide more graceful error recovery and debugging capabilities.
The `try...catch...finally` statement handles errors in JavaScript without crashing your app. It lets you "try" a block of code, "catch" any error that happens, and "finally" run cleanup code no matter what.

Here is a quick mental model before we dive into the code:

> - **`try`**: "Run this code."
> - **`catch`**: "If an error happens in `try`, jump here instantly."
> - **`finally`**: "Always run this at the very end, no matter what happened."

---

## 1. How the Flow Works

```javascript
try {
  // 1. Code that might throw an error
  const user = JSON.parse('{"name": "Alex"}'); // Valid JSON
  console.log(user.name);
} catch (error) {
  // 2. Runs ONLY if an error occurs inside the try block
  console.error("Failed to parse JSON:", error.message);
} finally {
  // 3. Runs ALWAYS (whether try succeeded or failed)
  console.log("Cleanup: Parsing attempt finished.");
}
```

### Scenario A: No Error Happens

1. `try` block executes completely.
2. `catch` block is **skipped**.
3. `finally` block executes.

### Scenario B: An Error Happens

1. `try` block executes until it hits the error, then **stops immediately**.
2. Execution jumps straight into the `catch` block with the error object.
3. `finally` block executes after `catch` finishes.

---

## 2. Real-World Example: Async API Fetch with Loading Spinner

A very common use case in frontend development is managing loading spinners and closing connections:

```javascript
async function fetchUserData(userId) {
  showLoadingSpinner(true);

  try {
    const response = await fetch(`https://api.example.com/users/${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Handle network errors or thrown HTTP errors
    showToastNotification("Failed to load user profile");
    console.error("Fetch Error:", error.message);
  } finally {
    // ALWAYS hide the spinner, whether the request succeeded or failed
    showLoadingSpinner(false);
  }
}
```

---

## 3. Important Rules & "Gotchas"

### A. The `finally` Block Override Trick

If you return a value inside `try` or `catch`, the `finally` block **still executes before the function returns**.

Even crazier: if `finally` contains its own `return` statement, **it will override any previous `return` statement** from `try` or `catch`!

```javascript
function testReturn() {
  try {
    return "From TRY";
  } catch (err) {
    return "From CATCH";
  } finally {
    return "From FINALLY"; // ⚠️ Overrides "From TRY"!
  }
}

console.log(testReturn()); // Output: "From FINALLY"
```

---

### B. Throwing Custom Errors (`throw`)

You can trigger the `catch` block intentionally using the `throw` keyword:

```javascript
function withdrawMoney(amount, balance) {
  try {
    if (amount > balance) {
      // Manually trigger an error
      throw new Error("Insufficient funds!");
    }
    balance -= amount;
    return balance;
  } catch (error) {
    console.error(error.message); // "Insufficient funds!"
  }
}
```

---

### C. Optional Catch Binding (ES2019+)

If you don't care about inspecting the error details inside `catch`, you can omit the `(error)` variable entirely:

```javascript
try {
  parseData();
} catch {
  // Omitted (error) parameter because we just want a fallback
  useDefaultData();
}
```

---

### D. Asynchronous Gotcha (Callbacks vs Promises)

`try...catch` is **synchronous**. It cannot catch errors inside asynchronous callbacks like `setTimeout` unless you use `async/await`.

```javascript
// ❌ WRONG: try/catch will NOT catch this error!
try {
  setTimeout(() => {
    throw new Error("Boom!"); // App crashes! try/catch already finished.
  }, 1000);
} catch (err) {
  console.log("Caught!"); // Never runs
}

// ✅ CORRECT: Use async/await
async function runAsync() {
  try {
    await delayWithError(); // Awaited promise rejection gets caught!
  } catch (err) {
    console.log("Successfully caught async error!");
  }
}
```

---

## Summary Matrix

| Block         | Required?  | When does it execute?                              |
| ------------- | ---------- | -------------------------------------------------- |
| **`try`**     | **Yes**    | Always runs first.                                 |
| **`catch`**   | Optional\* | Only if an error occurs inside `try`.              |
| **`finally`** | Optional\* | Always runs last (even if `try`/`catch` returned). |

\*_Note: A `try` block must be followed by at least one `catch` or `finally` block (or both)._
Here is a collection of classic and tricky **Event Loop output prediction interview questions**, organized from basic microtasks to complex nested scenarios.

---

## The Golden Rules of the Event Loop

Before predicting output, remember the execution priority order:

1. **Call Stack (Synchronous Code):** Executes first, top-to-bottom.
2. **Microtask Queue:** Executes **immediately after** the Call Stack clears (and before the browser paints or handles the next timer).

- Includes: `Promise.then()` / `.catch()` / `.finally()`, `queueMicrotask()`, `process.nextTick()` (in Node.js), `MutationObserver`.

3. **Macrotask Queue (Task Queue):** Executes **one task at a time** after the Call Stack AND the entire Microtask Queue are completely empty.

- Includes: `setTimeout`, `setInterval`, `setImmediate` (Node.js), I/O, DOM events.

---

## Quiz 1: The Basics (Promises vs `setTimeout`)

```javascript
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

console.log("4");
```

### Output:

```text
1
4
3
2

```

### Step-by-Step Execution:

1. `console.log('1')` runs synchronously $\rightarrow$ **Logs `1**`.
2. `setTimeout` callback goes to the **Macrotask Queue**.
3. `Promise.then` callback goes to the **Microtask Queue**.
4. `console.log('4')` runs synchronously $\rightarrow$ **Logs `4**`.
5. Call stack clears. The event loop checks the **Microtask Queue** first $\rightarrow$ **Logs `3**`.
6. Microtask queue clears. The event loop moves to the **Macrotask Queue** $\rightarrow$ **Logs `2**`.

---

## Quiz 2: Async / Await & Promise Constructors (Tricky)

> **Key Rule:** The executor function passed into `new Promise((resolve) => { ... })` runs **synchronously** when the promise is instantiated!

```javascript
console.log("1");

async function foo() {
  console.log("2");
  await console.log("3");
  console.log("4");
}

new Promise((resolve) => {
  console.log("5");
  resolve();
  console.log("6");
}).then(() => {
  console.log("7");
});

foo();

console.log("8");
```

### Output:

```text
1
5
6
2
3
8
7
4

```

### Step-by-Step Execution:

1. **Logs `1**`.
2. `new Promise` executor runs synchronously:

- **Logs `5**`.
- `resolve()` marks the promise as resolved.
- **Logs `6**`.
- `.then()` callback goes to **Microtask Queue** (Task A: `console.log('7')`).

3. `foo()` is invoked synchronously:

- **Logs `2**`.
- `await console.log('3')`: `console.log('3')` executes synchronously $\rightarrow$ **Logs `3**`.
- The `await` pauses `foo()`. The remaining code inside `foo()` (`console.log('4')`) is scheduled as a **Microtask** (Task B).

4. `console.log('8')` runs synchronously $\rightarrow$ **Logs `8**`.
5. Call stack clears! Now process **Microtasks** in FIFO order:

- Execute Task A: **Logs `7**`.
- Execute Task B: **Logs `4**`.

---

## Quiz 3: Nested Microtasks & Starvation

> **Key Rule:** If a microtask schedules another microtask, it gets added to the _current_ microtask queue and runs **before** any macrotask (`setTimeout`).

```javascript
setTimeout(() => console.log("Timeout 1"), 0);

Promise.resolve().then(() => {
  console.log("Promise 1");
  Promise.resolve().then(() => {
    console.log("Promise 2");
  });
});

Promise.resolve().then(() => {
  console.log("Promise 3");
});

setTimeout(() => console.log("Timeout 2"), 0);
```

### Output:

```text
Promise 1
Promise 3
Promise 2
Timeout 1
Timeout 2

```

### Step-by-Step Execution:

1. `setTimeout 1` goes to **Macrotask Queue**.
2. `Promise 1` callback goes to **Microtask Queue**.
3. `Promise 3` callback goes to **Microtask Queue**.
4. `setTimeout 2` goes to **Macrotask Queue**.
5. **Call Stack clears.** Process Microtask Queue:

- Run `Promise 1` $\rightarrow$ **Logs `Promise 1**`. Enqueues `Promise 2` at the end of the Microtask Queue.
- Run `Promise 3` $\rightarrow$ **Logs `Promise 3**`.
- Run `Promise 2` (Microtask queue isn't empty yet!) $\rightarrow$ **Logs `Promise 2**`.

6. **Microtask Queue is now empty.** Move to Macrotask Queue:

- Run `Timeout 1` $\rightarrow$ **Logs `Timeout 1**`.
- Run `Timeout 2` $\rightarrow$ **Logs `Timeout 2**`.

---

## Quiz 4: Macrotasks Spawning Microtasks

```javascript
setTimeout(() => {
  console.log("Timeout 1");
  Promise.resolve().then(() => {
    console.log("Promise inside Timeout");
  });
}, 0);

setTimeout(() => {
  console.log("Timeout 2");
}, 0);

Promise.resolve().then(() => {
  console.log("Top-level Promise");
});
```

### Output:

```text
Top-level Promise
Timeout 1
Promise inside Timeout
Timeout 2

```

### Step-by-Step Execution:

1. `Top-level Promise` runs first during the initial microtask drain $\rightarrow$ **Logs `Top-level Promise**`.
2. Event loop moves to **Macrotask 1** (`Timeout 1`):

- **Logs `Timeout 1**`.
- Enqueues `Promise inside Timeout` to the **Microtask Queue**.

3. **Crucial Step:** Before moving to the next macrotask (`Timeout 2`), the event loop **flushes the Microtask Queue**!

- Executes `Promise inside Timeout` $\rightarrow$ **Logs `Promise inside Timeout**`.

4. Event loop moves to **Macrotask 2** (`Timeout 2`) $\rightarrow$ **Logs `Timeout 2**`.

---

## Summary Cheat Sheet

```text
┌────────────────────────────────────────┐
│               Call Stack               │  1. Run synchronous JS
└──────────────────┬─────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────┐
│            Microtask Queue             │  2. Drain COMPLETELY after call stack
│ (Promises, async/await, queueMicrotask)│     (and after every single macrotask)
└──────────────────┬─────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────┐
│             Macrotask Queue            │  3. Run ONE task, then check
│  (setTimeout, setInterval, I/O, UI)    │     Microtask Queue again
└────────────────────────────────────────┘

```
