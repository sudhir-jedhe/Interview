The difference between `throw` and `try...catch` comes down to **creating errors** versus **handling errors**.

* **`throw`** triggers or raises an error, interrupting the normal flow of execution.
* **`try...catch`** intercepts and handles errors that occur, preventing the program from crashing.

---

## 1. Quick Comparison Matrix

| Feature            | `throw`                                             | `try...catch`                                   |
| ------------------ | --------------------------------------------------- | ----------------------------------------------- |
| **Role**           | Error **generation** / propagation                  | Error **interception** / handling               |
| **Action**         | Halts execution and emits an exception              | Wraps risky code and catches exceptions         |
| **Syntax**         | `throw expression;`                                 | `try { ... } catch (error) { ... }`             |
| **Execution Flow** | Stops the current block and jumps up the call stack | Captures the thrown error and resumes execution |
| **Usage Context**  | Validation, invalid inputs, custom errors           | Network calls, JSON parsing, risky operations   |

---

## 2. How `throw` Works

The `throw` statement creates a custom exception. When `throw` executes, JavaScript immediately **stops execution** of the current function and passes the thrown value up the call stack until a `catch` block receives it.

You can throw any expression (strings, numbers, objects), but throwing a standard JavaScript `Error` instance is best practice because it preserves the call stack trace.

```javascript
function withdrawMoney(amount, balance) {
  if (amount > balance) {
    // 💥 Manually create and throw an error
    throw new Error("Insufficient funds for this transaction.");
  }
  return balance - amount;
}

// Execution stops here if amount > balance:
withdrawMoney(500, 100); 
// ❌ Uncaught Error: Insufficient funds for this transaction.

```

---

## 3. How `try...catch` Works

The `try...catch` statement consists of a `try` block containing code that might throw an error, followed by a `catch` block that executes **only if an error occurs**.

```javascript
function parseUserData(jsonString) {
  try {
    // 1. Code that might throw an error (e.g. invalid JSON format)
    const user = JSON.parse(jsonString);
    console.log("User loaded:", user.name);
  } catch (error) {
    // 2. Runs ONLY if an error was thrown inside the try block
    console.error("Failed to parse user JSON:", error.message);
  } finally {
    // 3. (Optional) Runs regardless of whether an error occurred
    console.log("Parsing attempt complete.");
  }
}

parseUserData('{"name": "Alice"}'); // Valid JSON -> Runs 'try' and 'finally'
parseUserData("invalid-json");     // Invalid JSON -> Runs 'catch' and 'finally'

```

---

## 4. How They Work Together

`throw` and `try...catch` are two halves of the same error-handling mechanism: **`throw` creates the error signal, and `try...catch` receives it.**

```javascript
function validateAge(age) {
  if (age < 0) {
    throw new Error("Age cannot be negative."); // 1. Throw error
  }
  return true;
}

function processRegistration(inputAge) {
  try {
    validateAge(inputAge);
    console.log("Registration successful!");
  } catch (err) {
    // 2. Catch error thrown by validateAge()
    console.warn("Registration rejected:", err.message);
  }
}

processRegistration(-5); 
// Output: "Registration rejected: Age cannot be negative."

```

---

## Summary

* Use **`throw`** when a function encounters an invalid state or bad input that prevents it from finishing its job.
* Use **`try...catch`** when calling code that might fail (API requests, file operations, parsing) so your application can recover gracefully instead of crashing.
