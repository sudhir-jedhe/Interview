To run traditional callback-based asynchronous functions (e.g., Node.js style `(err, result) => void`) strictly in sequence without third-party libraries, there are three primary approaches:

---

### 1. The Modern Way: Promisify + `for...of` Loop (Recommended)

Wrap callback-based functions into native Promises so you can use standard sequential `async/await` syntax.

```javascript
// A typical callback-style async function
function asyncTask(id, ms, callback) {
  setTimeout(() => {
    console.log(`Finished task ${id}`);
    callback(null, `Result ${id}`);
  }, ms);
}

// Convert a Node-style callback function into a Promise
function toPromise(fn, ...args) {
  return new Promise((resolve, reject) => {
    fn(...args, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

// In Node.js, you can simply use:
// import { promisify } from 'node:util';
// const taskPromise = promisify(asyncTask);

async function runInSequence() {
  const operations = [
    () => toPromise(asyncTask, 1, 600),
    () => toPromise(asyncTask, 2, 200),
    () => toPromise(asyncTask, 3, 400),
  ];

  const results = [];
  for (const op of operations) {
    const result = await op();
    results.push(result);
  }

  console.log("All tasks completed:", results);
}

runInSequence();

```

---

### 2. Pure Recursive Iterator (Zero Dependencies / Zero Promises)

If you must stay entirely within plain callbacks without creating Promise wrappers, use an index-driven recursive helper:

```javascript
/**
 * Runs an array of callback tasks strictly in sequence.
 *
 * @param {Array<Function>} tasks - Array of functions shaped: (next: (err, res) => void) => void
 * @param {Function} done - Final callback called after all tasks or on error
 */
function runCallbacksSequentially(tasks, done) {
  const results = [];
  let index = 0;

  function next(err, result) {
    // Collect result (skip for initial invocation where result is undefined)
    if (index > 0) {
      if (err) return done(err); // Halt immediately on first error
      results.push(result);
    }

    // Base condition: all operations finished
    if (index >= tasks.length) {
      return done(null, results);
    }

    const currentTask = tasks[index++];

    try {
      // Pass `next` as the callback to the current task
      currentTask(next);
    } catch (syncError) {
      done(syncError);
    }
  }

  next(); // Kick off the sequence
}

// Example tasks
const tasks = [
  (next) => asyncTask("A", 300, next),
  (next) => asyncTask("B", 100, next),
  (next) => asyncTask("C", 200, next),
];

runCallbacksSequentially(tasks, (err, results) => {
  if (err) {
    console.error("Sequence failed:", err);
  } else {
    console.log("Finished all callbacks:", results);
  }
});

```

---

### 3. Pipeline Reduction with Data Passing (Waterfall)

When each subsequent callback requires the output from the previous callback (similar to `async.waterfall`):

```javascript
function waterfall(tasks, initialValue, finalCallback) {
  function step(index, currentValue) {
    if (index >= tasks.length) {
      return finalCallback(null, currentValue);
    }

    const currentTask = tasks[index];
    currentTask(currentValue, (err, nextValue) => {
      if (err) return finalCallback(err);
      step(index + 1, nextValue);
    });
  }

  step(0, initialValue);
}

// Each step takes input and passes its output to the next
const pipeline = [
  (val, next) => setTimeout(() => next(null, val + 10), 200),
  (val, next) => setTimeout(() => next(null, val * 2), 100),
  (val, next) => setTimeout(() => next(null, `Final value: ${val}`), 150),
];

waterfall(pipeline, 5, (err, result) => {
  console.log(result); // "Final value: 30" ((5 + 10) * 2)
});

```

---

### Key Pitfalls to Avoid

* **Never use loops without recursion or `await`:** A standard `tasks.forEach((task) => task(callback))` will launch every callback concurrently in parallel, not sequentially.
* **Stack Overflow on Synchronous Calls:** If any task in a recursive callback chain invokes its callback synchronously (`next()` without asynchronous I/O), running thousands of tasks will exceed the maximum call stack size. Wrap synchronous continuations in `queueMicrotask(next)` or `process.nextTick(next)` to unwind the stack.
