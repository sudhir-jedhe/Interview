### 1. **Build a custom Promise from scratch**

A basic **Promise** implementation includes the `resolve`, `reject`, and the logic to handle callbacks (`then`, `catch`, and `finally`).

```javascript
class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.handlers = [];

    const resolve = (value) => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        this.handlers.forEach((handler) => handler.onFulfilled(value));
      }
    };

    const reject = (reason) => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.value = reason;
        this.handlers.forEach((handler) => handler.onRejected(reason));
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handle = {
        onFulfilled: (value) => {
          try {
            resolve(onFulfilled ? onFulfilled(value) : value);
          } catch (e) {
            reject(e);
          }
        },
        onRejected: (reason) => {
          try {
            reject(onRejected ? onRejected(reason) : reason);
          } catch (e) {
            reject(e);
          }
        },
      };

      if (this.state === "fulfilled") {
        handle.onFulfilled(this.value);
      } else if (this.state === "rejected") {
        handle.onRejected(this.value);
      } else {
        this.handlers.push(handle);
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(callback) {
    return this.then(
      (value) => MyPromise.resolve(callback()).then(() => value),
      (reason) =>
        MyPromise.resolve(callback()).then(() => {
          throw reason;
        }),
    );
  }

  static resolve(value) {
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }
}
```

### 2. **Create your own Promise.all implementation**

`Promise.all` takes an array of promises and returns a new promise that resolves with an array of values when all promises resolve or rejects with the first error.

```javascript
MyPromise.all = function (promises) {
  return new MyPromise((resolve, reject) => {
    let results = [];
    let completed = 0;

    if (promises.length === 0) resolve([]);

    promises.forEach((promise, index) => {
      MyPromise.resolve(promise).then(
        (value) => {
          results[index] = value;
          completed++;
          if (completed === promises.length) resolve(results);
        },
        (reason) => reject(reason),
      );
    });
  });
};
```

### 3. **Design a Promise.any that resolves to the first fulfilled promise**

`Promise.any` resolves as soon as any promise is fulfilled. If all promises reject, it rejects with an `AggregateError`.

```javascript
MyPromise.any = function (promises) {
  return new MyPromise((resolve, reject) => {
    let errors = [];
    let rejectCount = 0;

    if (promises.length === 0)
      reject(new AggregateError("All promises were rejected", errors));

    promises.forEach((promise) => {
      MyPromise.resolve(promise).then(resolve, (reason) => {
        errors.push(reason);
        rejectCount++;
        if (rejectCount === promises.length)
          reject(new AggregateError("All promises were rejected", errors));
      });
    });
  });
};
```

### 4. **Develop a Promise.race to resolve based on the fastest result**

`Promise.race` returns the result of the first promise to settle (either resolve or reject).

```javascript
MyPromise.race = function (promises) {
  return new MyPromise((resolve, reject) => {
    promises.forEach((promise) => {
      MyPromise.resolve(promise).then(resolve, reject);
    });
  });
};
```

### 5. **Implement Promise.allSettled to handle multiple results—fulfilled or rejected**

`Promise.allSettled` waits for all promises to settle, either resolved or rejected.

```javascript
MyPromise.allSettled = function (promises) {
  return new MyPromise((resolve) => {
    let results = [];
    let completed = 0;

    if (promises.length === 0) resolve([]);

    promises.forEach((promise, index) => {
      MyPromise.resolve(promise).then(
        (value) => {
          results[index] = { status: "fulfilled", value };
          completed++;
          if (completed === promises.length) resolve(results);
        },
        (reason) => {
          results[index] = { status: "rejected", reason };
          completed++;
          if (completed === promises.length) resolve(results);
        },
      );
    });
  });
};
```

### 6. **Add a finally method for promises that always runs, regardless of outcome**

The `finally` method ensures that a callback is executed after the promise resolves or rejects.

```javascript
MyPromise.prototype.finally = function (callback) {
  return this.then(
    (value) => MyPromise.resolve(callback()).then(() => value),
    (reason) =>
      MyPromise.resolve(callback()).then(() => {
        throw reason;
      }),
  );
};
```

### 7. **Convert traditional callback-based functions into promises (promisify)**

```javascript
function promisify(fn) {
  return function (...args) {
    return new MyPromise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
}
```

### 8. **Implement custom methods for Promise.resolve() and Promise.reject()**

```javascript
MyPromise.resolve = function (value) {
  return new MyPromise((resolve) => resolve(value));
};

MyPromise.reject = function (reason) {
  return new MyPromise((_, reject) => reject(reason));
};
```

### 9. **Execute N async tasks in series—one after another**

```javascript
function series(tasks) {
  return tasks.reduce((promise, task) => {
    return promise.then((result) => task(result));
  }, MyPromise.resolve());
}
```

### 10. **Handle N async tasks in parallel and collect results**

```javascript
function parallel(tasks) {
  return MyPromise.all(tasks.map((task) => task()));
}
```

### 11. **Process N async tasks in race to pick the fastest one**

```javascript
function race(tasks) {
  return MyPromise.race(tasks.map((task) => task()));
}
```

### 12. **Recreate setTimeout() from scratch**

```javascript
function customSetTimeout(callback, delay) {
  let timeoutId;
  const startTime = Date.now();

  function check() {
    if (Date.now() - startTime >= delay) {
      callback();
    } else {
      timeoutId = requestAnimationFrame(check);
    }
  }

  timeoutId = requestAnimationFrame(check);
  return timeoutId;
}
```

### 13. **Rebuild setInterval() for periodic execution**

```javascript
function customSetInterval(callback, delay) {
  let intervalId;

  function execute() {
    callback();
    intervalId = setTimeout(execute, delay);
  }

  intervalId = setTimeout(execute, delay);
  return intervalId;
}
```

### 14. **Design a clearAllTimers function to cancel all timeouts and intervals**

```javascript
let timers = [];

function customSetTimeout(callback, delay) {
  const timerId = setTimeout(callback, delay);
  timers.push(timerId);
  return timerId;
}

function customSetInterval(callback, delay) {
  const timerId = setInterval(callback, delay);
  timers.push(timerId);
  return timerId;
}

function clearAllTimers() {
  timers.forEach((timer) => clearTimeout(timer));
  timers = [];
}
```

### 15. **Add auto-retry logic for failed API calls with exponential backoff**

```javascript
function retryWithExponentialBackoff(fn, retries = 3, delay = 1000) {
  return new MyPromise((resolve, reject) => {
    function attempt(retriesLeft, delayTime) {
      fn()
        .then(resolve)
        .catch((err) => {
          if (retriesLeft <= 0) {
            reject(err);
          } else {
            setTimeout(
              () => attempt(retriesLeft - 1, delayTime * 2),
              delayTime,
            );
          }
        });
    }
    attempt(retries, delay);
  });
}
```

---

Here are implementations for the tasks you've outlined:

---

### 16. **Create a debounce function to limit how often a task is executed.**

A **debounce** function ensures that a task is only executed after a delay, waiting for the last call before executing it. It’s typically used for events like typing in search input.

```javascript
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
```

---

### 17. **Implement throttling to control the frequency of function calls.**

**Throttling** ensures a function is executed at most once in a specified period, no matter how often the event occurs.

```javascript
function throttle(fn, delay) {
  let lastExecution = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastExecution >= delay) {
      lastExecution = now;
      fn(...args);
    }
  };
}
```

---

### 18. **Group API calls in batches to reduce server load.**

Batching API calls reduces the number of requests to the server by combining multiple requests into one.

```javascript
function batchApiCalls(apiCalls, batchSize) {
  const results = [];
  for (let i = 0; i < apiCalls.length; i += batchSize) {
    const batch = apiCalls.slice(i, i + batchSize);
    results.push(Promise.all(batch.map((fn) => fn())));
  }
  return Promise.all(results);
}
```

---

### 19. **Build a cache system to memoize identical API calls for better performance.**

Memoization caches the result of expensive function calls so that subsequent calls with the same parameters return the cached result.

```javascript
const cache = new Map();

function memoize(fn) {
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return Promise.resolve(cache.get(key));
    }
    return fn(...args).then((result) => {
      cache.set(key, result);
      return result;
    });
  };
}
```

---

### 20. **Develop a promise chaining system to handle dependent tasks seamlessly.**

Promise chaining allows you to execute asynchronous tasks one after another, where each task depends on the previous one.

```javascript
function chainPromises(tasks) {
  return tasks.reduce((promise, task) => {
    return promise.then(task);
  }, Promise.resolve());
}
```

---

### 21. **Write a timeout-safe promise to reject automatically if it takes too long.**

This method ensures that if the promise takes longer than the specified timeout, it will reject.

```javascript
function promiseWithTimeout(promise, timeout) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), timeout),
  );
  return Promise.race([promise, timeoutPromise]);
}
```

---

### 22. **Implement a retry mechanism with a maximum attempt limit.**

This function retries a failed task a certain number of times before failing.

```javascript
function retry(fn, maxAttempts, delay) {
  let attempts = 0;

  function attempt() {
    return fn().catch((error) => {
      if (attempts < maxAttempts) {
        attempts++;
        return new Promise((resolve) => setTimeout(resolve, delay)).then(
          attempt,
        );
      }
      throw error;
    });
  }

  return attempt();
}
```

---

### 23. **Create a cancelable promise to terminate unwanted async tasks.**

A **cancelable promise** lets you cancel an ongoing promise before it resolves or rejects.

```javascript
function cancelablePromise(promise) {
  let cancel;
  const cancelPromise = new Promise((_, reject) => {
    cancel = () => reject(new Error("Promise was canceled"));
  });

  const racePromise = Promise.race([promise, cancelPromise]);

  return {
    promise: racePromise,
    cancel,
  };
}
```

---

### 24. **Build an event emitter to handle custom events in an asynchronous flow.**

An **event emitter** allows objects to listen for and trigger custom events.

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
  }

  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach((listener) => listener(...args));
    }
  }

  off(event, listener) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((l) => l !== listener);
    }
  }
}
```

---

### 25. **Simulate async polling to continuously check server updates.**

**Polling** is an asynchronous technique where a task runs repeatedly at intervals to check for updates.

```javascript
function poll(fn, interval) {
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(() => {
      fn()
        .then((result) => {
          if (result) {
            clearInterval(intervalId);
            resolve(result);
          }
        })
        .catch(reject);
    }, interval);
  });
}
```

---

### 26. **Design a rate limiter to handle high-frequency API requests.**

A **rate limiter** controls the number of requests that can be made within a specified time window.

```javascript
class RateLimiter {
  constructor(limit, window) {
    this.limit = limit;
    this.window = window;
    this.requests = [];
  }

  request(fn) {
    const now = Date.now();
    this.requests = this.requests.filter((time) => now - time < this.window);

    if (this.requests.length < this.limit) {
      this.requests.push(now);
      return fn();
    }

    return new Promise((_, reject) =>
      setTimeout(
        () => reject("Rate limit exceeded"),
        this.window - (now - this.requests[0]),
      ),
    );
  }
}
```

---

### 27. **Implement a job scheduler that runs async tasks at specified intervals.**

A **job scheduler** allows tasks to run at periodic intervals.

```javascript
class JobScheduler {
  constructor(interval) {
    this.interval = interval;
    this.jobs = [];
  }

  addJob(jobFn) {
    this.jobs.push(jobFn);
  }

  start() {
    setInterval(() => {
      this.jobs.forEach((job) => job());
    }, this.interval);
  }
}
```

---

### 28. **Develop a parallel execution pool to limit concurrency in async tasks.**

A **parallel execution pool** restricts the number of concurrent async tasks running at once.

```javascript
class Pool {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.queue = [];
    this.active = 0;
  }

  addTask(task) {
    this.queue.push(task);
    this.processQueue();
  }

  processQueue() {
    if (this.active < this.concurrency && this.queue.length) {
      const task = this.queue.shift();
      this.active++;
      task().finally(() => {
        this.active--;
        this.processQueue();
      });
    }
  }
}
```

---

### 29. **Create a lazy loader for async data fetching.**

A **lazy loader** only fetches data when it’s needed, like infinite scrolling or on-demand loading.

```javascript
function lazyLoader(fn) {
  let loaded = false;
  return function () {
    if (!loaded) {
      loaded = true;
      return fn();
    }
    return Promise.resolve();
  };
}
```

---

### 30. **Build an async pipeline to process tasks in stages with dependencies.**

An **async pipeline** processes tasks one by one, where each stage depends on the output of the previous one.

```javascript
function asyncPipeline(tasks) {
  return tasks.reduce((promise, task) => {
    return promise.then((result) => task(result));
  }, Promise.resolve());
}
```

---

These implementations cover a wide range of utilities for managing async tasks, rate limiting, retry logic, and more. Let me know if you need further clarification or additional implementations!

This is an impressive and comprehensive collection of asynchronous JavaScript coding challenges and polyfills. It covers almost every major async utility pattern asked in senior frontend machine coding interviews.

While many of these solutions are functional, a few contain subtle bugs or edge cases that would fail in a production environment or technical interview.

Here are the key corrections and improvements for the most critical problems:

---

### Critical Bug Fixes & Refinements

#### 1. `MyPromise` (Item #1) — Microtask Async Execution

**Problem:** In your implementation, `resolve` executes handler callbacks **synchronously**. Promises are required by the Promises/A+ spec to execute handlers asynchronously as microtasks (e.g. via `queueMicrotask`).

```javascript
// Fixed constructor resolve/reject using queueMicrotask
const resolve = (value) => {
  if (this.state === "pending") {
    this.state = "fulfilled";
    this.value = value;
    queueMicrotask(() => {
      this.handlers.forEach((handler) => handler.onFulfilled(value));
    });
  }
};
```

---

#### 2. `batchApiCalls` (Item #18) — Sequential Batches

**Problem:** Your `batchApiCalls` code triggers **all** batches simultaneously in the loop (`Promise.all(batch.map(...))`), which defeats the purpose of batching. Batches must be executed sequentially.

```javascript
async function batchApiCalls(apiCalls, batchSize) {
  const results = [];
  for (let i = 0; i < apiCalls.length; i += batchSize) {
    const batch = apiCalls.slice(i, i + batchSize);
    // Wait for the current batch to finish before moving to the next
    const batchResults = await Promise.all(batch.map((fn) => fn()));
    results.push(...batchResults);
  }
  return results;
}
```

---

#### 3. `customSetTimeout` using `requestAnimationFrame` (Item #12)

**Problem:** `requestAnimationFrame` stops running when the browser tab is backgrounded/inactive, which causes timer drift. A better custom timeout uses a high-resolution loop or worker, but if using `rAF`, remember to continuously loop until elapsed:

```javascript
function customSetTimeout(callback, delay) {
  const start = performance.now();
  let handle;

  function loop(now) {
    if (now - start >= delay) {
      callback();
    } else {
      handle = requestAnimationFrame(loop);
    }
  }

  handle = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(handle);
}
```

---

#### 4. Concurrency Pool with Results (Item #28)

**Problem:** Your `Pool` class doesn't return a promise resolving to the task's output. Here is a cleaner function-based concurrency limiter that resolves with results:

```javascript
async function mapConcurrent(tasks, concurrency) {
  const results = [];
  const executing = new Set();

  for (const [index, task] of tasks.entries()) {
    const p = Promise.resolve()
      .then(() => task())
      .then((res) => {
        results[index] = res;
        executing.delete(p);
      });
    executing.add(p);

    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}
```

---

#### 5. Throttling with Trailing Call Support (Item #17)

Your basic throttling implementation drops calls that happen within the cool-down window. In UI development (e.g., scroll/resize events), a complete throttle often needs a **leading** and **trailing** invocation:

```javascript
function throttle(fn, delay) {
  let timer = null;
  let lastArgs = null;

  return function (...args) {
    if (!timer) {
      fn.apply(this, args); // Leading execution
      timer = setTimeout(() => {
        timer = null;
        if (lastArgs) {
          fn.apply(this, lastArgs); // Trailing execution
          lastArgs = null;
        }
      }, delay);
    } else {
      lastArgs = args;
    }
  };
}
```

---

### Quick Accuracy Summary Table

| Problem                      | Status         | Issue / Fix                                                              |
| ---------------------------- | -------------- | ------------------------------------------------------------------------ |
| **#1 Custom Promise**        | ⚠️ Spec Warning | Add `queueMicrotask` to make callbacks asynchronous.                     |
| **#2 Promise.all**           | ✅ Good         | Handles empty array edge case and order indexing correctly.              |
| **#3 Promise.any**           | ✅ Good         | Collects errors in `AggregateError`.                                     |
| **#12 customSetTimeout**     | ⚠️ Limitation   | `requestAnimationFrame` pauses in inactive browser tabs.                 |
| **#18 batchApiCalls**        | ❌ Bug          | Needs `await` inside loop to avoid executing all batches simultaneously. |
| **#21 Promise.race Timeout** | ✅ Perfect      | Clean implementation of `Promise.race`.                                  |
| **#23 Cancelable Promise**   | ✅ Solid        | Standard race condition wrapper.                                         |
| **#28 Execution Pool**       | ⚡ Improvement  | Extended above to collect and return task execution results.             |

Here's my take: Most custom `Promise` implementations written during interviews or in tutorials are good enough to pass basic tests, but they almost always fail the official **Promises/A+ Specification**.

The Promises/A+ spec is intentionally rigid to ensure interoperability—meaning your custom promise must work seamlessly with native promises, Bluebird, jQuery Deferreds, or any third-party "thenable."

Here are the **6 critical requirements** from the spec that custom implementations usually miss, along with how to fix them.

---

### 1. The Promise Resolution Procedure (`[[Resolve]](promise, x)`)

This is the biggest piece missing from simplified implementations. When a handler returns a value $x$, you can't just pass $x$ to the next `resolve()`. The spec defines an intricate algorithm (`[[Resolve]]`) to handle what $x$ is:

#### A. Checking for Self-Resolution (Spec 2.3.1)

If a promise returns _itself_ inside a `.then()` callback, it creates an infinite chain loop. The spec requires throwing a `TypeError`.

```javascript
// Spec 2.3.1: If promise and x refer to the same object, reject promise with a TypeError.
const p = promise.then(() => p); // Must reject with TypeError
```

#### B. Handshake with Foreign "Thenables" (Spec 2.3.3)

If $x$ is an object or function with a `.then` property, your promise **must adopt its state**. This is how native promises interoperate with legacy libraries.

Furthermore, accessing `x.then` can throw an error (e.g., via a getter property with side effects), or calling `then` might invoke callbacks multiple times. You must guard against this:

```javascript
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError("Chaining cycle detected for promise"));
  }

  let called = false; // Spec 2.3.3.3.3: Ensure resolve/reject are only called ONCE

  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      let then = x.then; // Spec 2.3.3.1: Retrieve x.then once
      if (typeof then === "function") {
        // Spec 2.3.3.3: Call then with x as 'this'
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject); // Recursively resolve
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          },
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}
```

---

### 2. Strict Microtask Async Execution (Spec 2.2.4)

> _" `onFulfilled` or `onRejected` must not be called until the execution context stack contains only platform code."_

Standard custom implementations often call callbacks synchronously if the promise is already fulfilled/rejected. The spec strictly forbids this. Handlers **must** execute asynchronously via microtasks (`queueMicrotask` or `process.nextTick`).

```javascript
// ❌ WRONG (Synchronous execution)
if (this.state === "fulfilled") {
  onFulfilled(this.value);
}

// ✅ SPEC COMPLIANT (Async microtask)
if (this.state === "fulfilled") {
  queueMicrotask(() => {
    try {
      const x = onFulfilled(this.value);
      resolvePromise(promise2, x, resolve, reject);
    } catch (e) {
      reject(e);
    }
  });
}
```

---

### 3. Execution Context Restrictions (Spec 2.2.5)

> _" `onFulfilled` and `onRejected` must be called as functions (i.e. with no `this` value)."_

In strict mode, `this` inside `.then(function() { ... })` must be `undefined`. In non-strict mode, it should be the global object.

If you invoke a handler as `handler(value)` without careful binding, or if it's called as a method of an internal handler object (`handlerObj.onFulfilled(value)`), `this` will point to `handlerObj` instead of `undefined`.

---

### 4. Exception Handling Inside the Executor AND Handlers

Most custom promise tutorials wrap `executor(resolve, reject)` in a `try...catch` block. But they miss two edge cases:

1. **Async Errors in Executor:** If an async operation inside the executor throws an unhandled error (e.g., `setTimeout(() => { throw Error() })`), `try...catch` won't catch it. (Though this is a JavaScript runtime constraint, the executor must safely catch synchronous throws during initialization).
2. **Errors inside `.then` callbacks:** If a user-provided `onFulfilled` function throws an error, `promise2` **must be rejected** with that error, even if `promise1` was successfully fulfilled.

```javascript
// Inside .then():
queueMicrotask(() => {
  try {
    const x = onFulfilled(this.value); // If this throws...
    resolvePromise(promise2, x, resolve, reject);
  } catch (error) {
    reject(error); // ...promise2 must REJECT with the error
  }
});
```

---

### 5. Value and Reason Passthrough (Spec 2.2.1 & 2.2.7)

If the arguments passed to `.then()` are not functions (e.g., `promise.then(null, null)` or `promise.then(123)`), they must be ignored and the original value/reason passed down the chain.

- If `onFulfilled` is not a function and `promise1` is fulfilled, `promise2` must be fulfilled with the **same value** as `promise1`.
- If `onRejected` is not a function and `promise1` is rejected, `promise2` must be rejected with the **same reason** as `promise1`.

```javascript
// Default fallbacks required by Spec 2.2.7.3 & 2.2.7.4
onFulfilled =
  typeof onFulfilled === "function" ? onFulfilled : (value) => value;
onRejected =
  typeof onRejected === "function"
    ? onRejected
    : (reason) => {
        throw reason;
      };
```

---

### 6. Multiple Calls to `.then()` on the Same Promise (Spec 2.2.6)

Promises are not just chains; they are **event emitters**. You can attach multiple distinct `.then()` callbacks to a single promise instance, and they must all execute in the order they were registered.

```javascript
const p = new MyPromise((res) => setTimeout(res, 100));

// Multiple independent listeners on the SAME promise:
p.then((val) => console.log("Listener 1"));
p.then((val) => console.log("Listener 2"));

// Custom implementations that store only a single `this.onFulfilled`
// callback will overwrite Listener 1 with Listener 2!
```

**Fix:** Store handlers in an array (`this.handlers = []`) and iterate through all of them when the promise settles.

---

### Summary Checklist for a Spec-Compliant Promise

| Feature                        | Standard "Naïve" Polyfill             | Promises/A+ Spec Compliant                             |
| ------------------------------ | ------------------------------------- | ------------------------------------------------------ |
| **Handler Timing**             | Synchronous if state is settled       | **Always asynchronous** (`queueMicrotask`)             |
| **Chaining $x$ return**        | Resolves directly                     | Recursively handles thenable objects / self-references |
| **`this` inside handler**      | Points to internal object or instance | Strict `undefined`                                     |
| **Non-function `.then(null)**` | Crashes or breaks chain               | Passes through value / re-throws reason                |
| **Multiple `.then()**`         | Overwrites previous handler           | Queues and executes all handlers in order              |

Building a basic **Observable** from scratch helps demystify reactive programming frameworks like RxJS.

At its core, an Observable is simply a **function that sets up a stream of data** by accepting an `observer` object (with `next`, `error`, and `complete` callbacks) and returning an `unsubscribe` function to clean up resources.

Here is a clean, dependency-free implementation in vanilla JavaScript.

---

### 1. The Core `Observable` Class

```javascript
class Observable {
  /**
   * @param {Function} subscribeFn - The blueprint function defining how values are emitted.
   */
  constructor(subscribeFn) {
    this._subscribe = subscribeFn;
  }

  /**
   * Connects an observer to the Observable stream.
   * @param {Object|Function} observerOrNext - Observer object or a simple next callback.
   * @returns {Object} Unsubscribe handle with an `unsubscribe` method.
   */
  subscribe(observerOrNext) {
    // Standardize input: normalize a simple function into an observer object
    const observer =
      typeof observerOrNext === "function"
        ? { next: observerOrNext, error: () => {}, complete: () => {} }
        : {
            next: observerOrNext.next || (() => {}),
            error: observerOrNext.error || (() => {}),
            complete: observerOrNext.complete || (() => {}),
          };

    let isTeardown = false;

    // Create a safe subscriber wrapper to enforce Observable rules:
    // 1. Don't emit after unsubscribe/teardown
    // 2. Stop stream on error or complete
    const safeObserver = {
      next: (value) => {
        if (!isTeardown) observer.next(value);
      },
      error: (err) => {
        if (!isTeardown) {
          isTeardown = true;
          observer.error(err);
        }
      },
      complete: () => {
        if (!isTeardown) {
          isTeardown = true;
          observer.complete();
        }
      },
    };

    // Execute the blueprint function passing our safe observer
    const cleanup = this._subscribe(safeObserver);

    // Return teardown function to consumer
    return {
      unsubscribe: () => {
        isTeardown = true;
        if (typeof cleanup === "function") {
          cleanup();
        }
      },
    };
  }

  /**
   * Transform each value emitted by the source Observable.
   */
  map(transformFn) {
    return new Observable((observer) => {
      // Subscribe to the SOURCE observable
      const subscription = this.subscribe({
        next: (val) => {
          try {
            observer.next(transformFn(val));
          } catch (err) {
            observer.error(err);
          }
        },
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });

      // Pass teardown logic through
      return () => subscription.unsubscribe();
    });
  }

  /**
   * Selectively pass values that satisfy a predicate condition.
   */
  filter(predicateFn) {
    return new Observable((observer) => {
      // Subscribe to the SOURCE observable
      const subscription = this.subscribe({
        next: (val) => {
          try {
            if (predicateFn(val)) {
              observer.next(val);
            }
          } catch (err) {
            observer.error(err);
          }
        },
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });

      // Pass teardown logic through
      return () => subscription.unsubscribe();
    });
  }
}
```

---

### 2. Usage Examples

#### Example A: Synchronous Stream

```javascript
const numberStream$ = new Observable((observer) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.next(4);
  observer.complete();
});

numberStream$
  .filter((x) => x % 2 === 0) // Keep even numbers: 2, 4
  .map((x) => x * 10) // Multiply: 20, 40
  .subscribe({
    next: (val) => console.log("Received:", val),
    complete: () => console.log("Stream finished!"),
  });

// Console Output:
// Received: 20
// Received: 40
// Stream finished!
```

---

#### Example B: Asynchronous Stream with Unsubscribe Teardown

```javascript
const interval$ = new Observable((observer) => {
  let count = 0;
  console.log("--- Stream Started ---");

  const timerId = setInterval(() => {
    count++;
    observer.next(count);
  }, 1000);

  // Return cleanup function (called on unsubscribe or completion)
  return () => {
    clearInterval(timerId);
    console.log("--- Stream Cleaned Up ---");
  };
});

const subscription = interval$
  .filter((num) => num % 2 !== 0) // Filter odd counts
  .map((num) => `Tick #${num}`) // Format string
  .subscribe((val) => console.log(val));

// Unsubscribe after 5.5 seconds
setTimeout(() => {
  subscription.unsubscribe();
}, 5500);

// Console Output:
// --- Stream Started ---
// Tick #1  (at 1s)
// Tick #3  (at 3s)
// Tick #5  (at 5s)
// --- Stream Cleaned Up --- (at 5.5s)
```

---

### Key Architectural Principles

1. **Lazy Execution:** The code inside `new Observable(fn)` doesn't execute when created. It only runs when `.subscribe()` is explicitly called.
2. **Immutability via Chaining:** Methods like `.map()` and `.filter()` return **new `Observable` instances** wrapping the source stream rather than mutating the existing one.
3. **Teardown Cascade:** Unsubscribing from a derived stream (the one created by `.map()` or `.filter()`) triggers an unsubscribe chain back up to the original source observable, stopping timer IDs or event listeners cleanly.
