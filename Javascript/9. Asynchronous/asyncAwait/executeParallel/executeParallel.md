### Problem Statement: 
You need to implement a function in JavaScript that takes a list of asynchronous tasks and executes them **in parallel**. After each task finishes, a callback should be invoked with the result of that task. You can expect each task to be a function that returns a promise, and these tasks should be executed concurrently. The function should handle both successful results and errors, and return the results in the order the tasks were provided, not the order they finished.

### **Input:**
A list of asynchronous tasks and a callback function.

```javascript
executeParallel([asyncTask(3), asyncTask(1), asyncTask(2)], (result) => {
    console.log(result);
});
```

### **Output:**
```text
[2, 1, 3]  // Output in the order of execution
```

### **Solution Explanation:**

1. **Task Management:**
   You will be given multiple asynchronous tasks, each represented by a function that returns a promise. These tasks should run concurrently.

2. **Handling Results:**
   As each task resolves or rejects, you will invoke a callback with the result (or error). The results should be returned in the order the tasks were provided.

3. **Using `Promise.all()` for Parallel Execution:**
   To run the tasks in parallel and handle their results, we can use `Promise.all()`. This function takes an array of promises, and once all of the promises are resolved, it returns their results in the same order as the original tasks, irrespective of which promise resolves first.

4. **Handling Errors:**
   Each task can potentially fail. You can collect errors by using `.catch()` and handle them appropriately.

---

### **Solution Implementation:**

#### **Version 1: Using Promises**

In this version, we'll use `Promise.all()` to execute tasks concurrently and handle both success and errors.

```javascript
function asyncParallel(tasks, callback) {
    // Handle tasks in parallel and wait for all promises to resolve
    const results = [];
    const errors = [];

    tasks.forEach((task, index) => {
        // Each task is expected to return a promise
        task()
            .then(result => {
                results.push(result); // Collect successful results
            })
            .catch(error => {
                errors.push(error); // Collect errors
            })
            .finally(() => {
                // Ensure we only invoke callback once all tasks have been processed
                if (results.length + errors.length === tasks.length) {
                    callback(errors, results);
                }
            });
    });
}

// Example task creator that resolves after a delay
function createAsyncTask(duration) {
    return function() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.2) { // 80% chance to resolve
                    resolve(duration);
                } else {
                    reject(`Error with duration ${duration}`);
                }
            }, duration * 1000);
        });
    };
}

// Example usage with a set of tasks
const tasks = [
    createAsyncTask(3), // Task with 3s delay
    createAsyncTask(1), // Task with 1s delay
    createAsyncTask(2), // Task with 2s delay
];

asyncParallel(tasks, (errors, results) => {
    console.log("Errors:", errors);
    console.log("Results:", results);
});
```

#### **Explanation:**
- **`asyncParallel()`** takes a list of tasks (functions returning promises) and a callback.
- For each task, we invoke the task, which returns a promise. We then handle the promise using `.then()` and `.catch()`, collecting results and errors.
- We use **`finally()`** to check if all tasks have completed, ensuring the callback is invoked once all tasks are finished.
  
---

#### **Version 2: Handling Timeout and Error Handling**

Here, we modify the tasks to include a timeout and error handling in case any task takes too long or fails.

```javascript
function asyncParallelWithTimeout(tasks, callback) {
    const results = [];
    const errors = [];

    // A helper to handle task timeouts
    const TIMEOUT = 3000; // 3 seconds timeout for each task

    tasks.forEach((task, index) => {
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Task timed out")), TIMEOUT)
        );

        // Race the task against the timeout
        const taskWithTimeout = Promise.race([task(), timeoutPromise]);

        taskWithTimeout
            .then(result => {
                results.push(result); // Collect result if task finishes within timeout
            })
            .catch(error => {
                errors.push(error.message || error); // Collect error or timeout message
            })
            .finally(() => {
                // Ensure callback is called once all tasks finish
                if (results.length + errors.length === tasks.length) {
                    callback(errors, results);
                }
            });
    });
}

// Example task creator with random delay
function createAsyncTask(duration) {
    return function() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.2) {
                    resolve(`Task with ${duration}s`);
                } else {
                    reject(`Error with duration ${duration}`);
                }
            }, duration * 1000);
        });
    };
}

// Example usage with tasks
const tasks = [
    createAsyncTask(3),
    createAsyncTask(1),
    createAsyncTask(2),
];

asyncParallelWithTimeout(tasks, (errors, results) => {
    console.log("Errors:", errors);
    console.log("Results:", results);
});
```

#### **Explanation of Timeout Handling:**
- **Timeout Logic**: Each task is "raced" against a timeout promise, which rejects after 3 seconds.
- **`Promise.race()`**: This ensures that whichever promise (the task or the timeout) resolves first will dictate the outcome.

---

### **Version 3: Async/Await with Parallel Execution**

We can also use `async/await` with `Promise.all()` to execute tasks in parallel more cleanly.

```javascript
async function asyncParallelWithAwait(tasks, callback) {
    try {
        // Wait for all tasks to finish concurrently
        const results = await Promise.all(tasks.map(task => task()));
        callback(null, results); // Return results via callback
    } catch (error) {
        callback(error.message, null); // Handle any error
    }
}

// Example task creator with delay
function createAsyncTask(duration) {
    return () => new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.2) {
                resolve(`Task with ${duration}s`);
            } else {
                reject(`Error with duration ${duration}`);
            }
        }, duration * 1000);
    });
}

const tasks = [
    createAsyncTask(3),
    createAsyncTask(1),
    createAsyncTask(2),
];

asyncParallelWithAwait(tasks, (error, results) => {
    if (error) {
        console.log("Error:", error);
    } else {
        console.log("Results:", results);
    }
});
```

#### **Explanation of Async/Await Version:**
- We use `await Promise.all()` to execute all tasks concurrently.
- The `callback` function is invoked with the results or errors after all tasks finish.
- This version uses `async/await` for cleaner syntax.

---

### **Key Concepts:**

1. **Parallel Execution**: Using `Promise.all()` or `Promise.race()` helps run asynchronous tasks concurrently.
2. **Error Handling**: It's important to handle errors from any of the tasks, ensuring that failures do not block subsequent tasks.
3. **Task Timeout**: Timeout logic can be implemented to abort tasks that take too long.
4. **Order of Results**: `Promise.all()` ensures that results are returned in the order the tasks were provided, even if they finish in a different order.

