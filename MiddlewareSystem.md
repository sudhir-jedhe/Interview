To implement the `Middleware` class with the described functionality, we need to handle the middleware in such a way that:

1. **Middleware functions** are executed sequentially.
2. **Error-handling functions** should be triggered when `next` is called with an error or an uncaught error occurs.
3. We have two types of functions:
   - **Normal middleware functions**: `(req, next) => {}` that modify the request and pass control to the next middleware.
   - **Error-handling functions**: `(error, req, next) => {}` that handle any error that may have occurred in previous middleware.

### **Plan**

1. **Middleware functions** should be executed sequentially.
2. If an error occurs (either thrown directly or passed via `next(error)`), control should be passed to the error-handling middleware.
3. The error-handling middleware has the signature `(error, req, next) => {}` and will be invoked when `next(error)` is called.
4. When the chain reaches the error handler, the next function will not be executed unless handled properly.

### **Solution Implementation**

```javascript
class Middleware {
  /**
   * Initialize the middleware with empty lists of regular middleware and error handlers.
   */
  constructor() {
    this.callbacks = [];
    this.errHandlers = [];
  }

  /**
   * Registers middleware and error handler functions.
   * Middleware functions are identified by their arity (number of arguments).
   * @param {Function} func - The middleware function or error handler
   */
  use(func) {
    if (func.length === 2) {
      // Regular middleware: (req, next)
      this.callbacks.push(func);
    } else if (func.length === 3) {
      // Error handler: (error, req, next)
      this.errHandlers.push(func);
    }
  }

  /**
   * Starts the middleware chain.
   * @param {Object} req - The request object to be passed through the middleware chain
   */
  start(req) {
    let idx = 0; // Index for regular middleware
    let errIdx = 0; // Index for error handlers

    // Function to call the next middleware or error handler
    const next = (nextError) => {
      let args = [req, next];
      let func;

      // If an error is passed, use the error handler
      if (nextError) {
        func = this.errHandlers[errIdx++];
        args.unshift(nextError); // Add error as the first argument for error handler
      } else {
        func = this.callbacks[idx++];
      }

      // Execute the middleware function if it exists
      try {
        if (func) {
          func(...args); // Call the middleware or error handler
        }
      } catch (error) {
        next(error); // Pass error to the next error handler
      }
    };

    // Start the middleware chain
    next();
  }
}

// Test cases:

const middleware = new Middleware();

// Regular middleware functions
middleware.use((req, next) => {
  req.a = 1; // Modify req object
  next(); // Pass control to next middleware
});

middleware.use((req, next) => {
  req.b = 2; // Modify req object
  next(); // Pass control to next middleware
});

// Final middleware to log the result
middleware.use((req, next) => {
  console.log(req); // Output the final state of req
  next();
});

middleware.start({}); // Output: { a: 1, b: 2 }

// Middleware with error handling

const middlewareWithError = new Middleware();

// Middleware that throws an error
middlewareWithError.use((req, next) => {
  req.a = 1;
  throw new Error("sth wrong"); // Throwing an error
  next(); // This won't be reached
});

// Middleware that won't execute due to error
middlewareWithError.use((req, next) => {
  req.b = 2; // This won't be executed
  next();
});

// Log middleware
middlewareWithError.use((req, next) => {
  console.log(req); // This won't be executed
});

// Error handler to catch the error and log
middlewareWithError.use((error, req, next) => {
  console.log(error); // Output: Error: sth wrong
  console.log(req); // Output: { a: 1 }
  next(); // Pass control to the next handler (if any)
});

middlewareWithError.start({}); // Output: Error: sth wrong
// Output: { a: 1 }
```

### **Explanation**

- **Regular Middleware** (`use(func)`):
  - These functions take two arguments: `req` (the request object) and `next` (a function that passes control to the next middleware).
  - The middleware modifies the `req` object as needed and calls `next()` to pass control to the next middleware.
- **Error Handlers** (`use(func)` with 3 arguments):
  - These functions are invoked when an error is passed via `next(error)` or when an uncaught error occurs in the middleware chain.
  - The error handler receives three arguments: `error` (the error), `req` (the request object), and `next` (the function to pass control to the next handler).

- **`start(req)`**:
  - The `start` method initiates the middleware execution, passing the `req` object through the middleware chain.
  - If an error occurs during the middleware execution, the error handler will be invoked.

### **Behavior**

1. **Regular Execution**:
   - If no errors are thrown in any middleware, each function is executed sequentially, and the `req` object is modified. The last middleware logs the final state of `req`.
2. **Error Handling**:
   - If any middleware throws an error or calls `next(error)`, the control will skip the regular middleware and directly jump to the error handler.
   - The error handler can modify the `req` object or perform other actions, but subsequent middleware or handlers will not be executed unless explicitly handled.

### **Test Case 1: Normal Middleware Execution**

```javascript
middleware.start({}); // { a: 1, b: 2 }
```

In this case, the regular middleware functions execute without errors, and the final state of the `req` object is logged as `{ a: 1, b: 2 }`.

### **Test Case 2: Middleware with Error Handling**

```javascript
middlewareWithError.start({}); // Error: sth wrong
// { a: 1 }
```

Here, an error is thrown in the first middleware, which triggers the error handler. The error message `sth wrong` and the modified `req` object `{ a: 1 }` are logged.

### **Conclusion**

This implementation of a simplified middleware system replicates the essential behavior of a system like Express's middleware, supporting both regular middleware and error-handling middleware. It allows for flexible handling of requests and errors in a clean and sequential manner.

Here is a complete, robust implementation of the Express-style `Middleware` class in JavaScript that handles sequential execution, async/sync errors, and error-handling functions based on parameter length (`fn.length`).

---

### Implementation

```javascript
class Middleware {
  constructor() {
    this.stack = [];
  }

  /**
   * Register a middleware or error-handling function
   * Normal middleware: (req, next) => {} (length <= 2)
   * Error middleware: (err, req, next) => {} (length === 3)
   */
  use(fn) {
    this.stack.push(fn);
  }

  /**
   * Execute the middleware chain
   * @param {Object} req - The request object
   * @param {Function} [done] - Optional final callback when chain completes
   */
  go(req, done = () => {}) {
    let index = 0;

    const next = (err) => {
      // If we ran out of middleware, call the final handler
      if (index >= this.stack.length) {
        return done(err);
      }

      const fn = this.stack[index++];

      try {
        if (err) {
          // An error exists -> skip normal middleware, look for error-handling middleware (3 arguments)
          if (fn.length === 3) {
            fn(err, req, next);
          } else {
            next(err); // Skip normal middleware
          }
        } else {
          // No error -> run normal middleware (2 arguments)
          if (fn.length < 3) {
            fn(req, next);
          } else {
            next(); // Skip error middleware when there's no error
          }
        }
      } catch (uncaughtError) {
        // Catch synchronous errors thrown inside middleware functions
        next(uncaughtError);
      }
    };

    // Kick off execution
    next();
  }
}
```

---

### Key Features Explained

1. **Arity Detection (`fn.length`):**
   JavaScript functions expose the number of declared arguments via `.length`.

- `(req, next) => {}` has `.length` of 2.
- `(err, req, next) => {}` has `.length` of 3.

2. **Branching Logic in `next(err)`:**

- **When `err` is present:** The pipeline bypasses normal middleware (`fn.length < 3`) and forwards `err` directly to the next error handler (`fn.length === 3`).
- **When `err` is undefined:** The pipeline executes normal middleware and skips error handlers.

3. **Synchronous Error Catching:**
   The `try...catch` block around `fn(...)` ensures that if a middleware throws an uncaught error synchronously (e.g., `throw new Error("Boom")`), it gets caught and converted into a `next(uncaughtError)` call automatically.

---

### Usage Example

```javascript
const app = new Middleware();

// 1. Normal middleware: Modifies request
app.use((req, next) => {
  req.user = "Alice";
  console.log("Step 1: Added user");
  next();
});

// 2. Normal middleware: Throws an error
app.use((req, next) => {
  console.log("Step 2: Triggering error...");
  next(new Error("Unauthorized access"));
});

// 3. Normal middleware: SKIPPED because of error
app.use((req, next) => {
  console.log("Step 3: This won't run!");
  next();
});

// 4. Error-handling middleware: Catches and resolves error
app.use((err, req, next) => {
  console.log(`Step 4 (Error Handler): Caught error -> "${err.message}"`);
  // Recovering from error by calling next without arguments
  next();
});

// 5. Normal middleware: Resumes normal execution after recovery
app.use((req, next) => {
  console.log(`Step 5: Pipeline recovered! User is ${req.user}`);
  next();
});

// Execute
app.go({}, (err) => {
  if (err) {
    console.log("Final Done with Error:", err.message);
  } else {
    console.log("Final Done: Execution complete!");
  }
});
```

#### Output

```text
Step 1: Added user
Step 2: Triggering error...
Step 4 (Error Handler): Caught error -> "Unauthorized access"
Step 5: Pipeline recovered! User is Alice
Final Done: Execution complete!

```

---

### Supporting Async / Promises (Optional Extension)

If your middleware functions return Promises (e.g., `async (req, next) => {}`), wrap `fn` execution in `Promise.resolve()`:

```javascript
try {
  if (err) {
    if (fn.length === 3) {
      Promise.resolve(fn(err, req, next)).catch(next);
    } else {
      next(err);
    }
  } else {
    if (fn.length < 3) {
      Promise.resolve(fn(req, next)).catch(next);
    } else {
      next();
    }
  }
} catch (uncaughtError) {
  next(uncaughtError);
}
```
