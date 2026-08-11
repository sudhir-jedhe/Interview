Creating a custom event loop simulation in JavaScript can help you understand how JavaScript's concurrency model works. JavaScript uses an event-driven, non-blocking I/O model that works on a single-threaded event loop. Below is a simplified custom simulation of how the event loop works in JavaScript.

This custom event loop will simulate tasks in the **call stack**, **event queue**, and the **macro/micro tasks** that are processed by the event loop.

### Custom Event Loop Simulation Example

```javascript
class EventLoop {
  constructor() {
    this.callStack = [];
    this.eventQueue = [];
    this.microTaskQueue = [];
  }

  // Simulate pushing a task to the call stack
  pushToCallStack(task) {
    this.callStack.push(task);
    console.log(
      `Call Stack: ${this.callStack.map((task) => task.name).join(", ")}`,
    );
  }

  // Simulate running the event loop
  run() {
    console.log("Event Loop Started");

    // Start processing tasks from the call stack
    while (this.callStack.length > 0) {
      const currentTask = this.callStack.shift(); // Take the first task from the call stack
      console.log(`Running task: ${currentTask.name}`);

      currentTask();

      // Check if there are micro-tasks to run after a task
      while (this.microTaskQueue.length > 0) {
        const microTask = this.microTaskQueue.shift();
        console.log(`Running micro-task: ${microTask.name}`);
        microTask();
      }

      // After a task finishes, push any event queue tasks to the call stack
      if (this.eventQueue.length > 0) {
        const eventTask = this.eventQueue.shift();
        console.log(`Pushing event task to call stack: ${eventTask.name}`);
        this.callStack.push(eventTask);
      }

      // Simulate async event loop behavior (not blocking UI)
      this.simulateAsyncBehavior();
    }

    console.log("Event Loop Finished");
  }

  // Simulate adding a task to the event queue
  addToEventQueue(task) {
    this.eventQueue.push(task);
    console.log(`Added to Event Queue: ${task.name}`);
  }

  // Simulate adding a micro-task
  addMicroTask(task) {
    this.microTaskQueue.push(task);
    console.log(`Added to Micro Task Queue: ${task.name}`);
  }

  // Simulate async behavior by putting a timeout
  simulateAsyncBehavior() {
    setTimeout(() => {
      console.log("Async behavior: Simulating I/O or timers");
    }, 0);
  }
}

// Create a new Event Loop simulation
const eventLoop = new EventLoop();

// Define some tasks
const task1 = () => {
  console.log("Task 1 started");
  eventLoop.addMicroTask(() => {
    console.log("Micro Task 1 from Task 1");
  });
  eventLoop.addToEventQueue(task2);
  console.log("Task 1 finished");
};

const task2 = () => {
  console.log("Task 2 started");
  eventLoop.addMicroTask(() => {
    console.log("Micro Task 2 from Task 2");
  });
  console.log("Task 2 finished");
};

// Start the simulation
eventLoop.pushToCallStack(task1);
eventLoop.run();
```

### Explanation

1. **Call Stack**: A stack of tasks that are being executed synchronously. Tasks are processed in a Last In, First Out (LIFO) order.
2. **Event Queue**: A queue for tasks that are scheduled to run asynchronously, like event listeners, setTimeout, or setInterval. These tasks are added after the call stack is empty.
3. **Micro Task Queue**: A queue for micro-tasks like promises that need to be executed after the currently running task finishes and before any event queue tasks are processed.

### Flow

- Initially, `task1` is pushed to the call stack.
- `task1` starts running. It adds a micro-task (`Micro Task 1 from Task 1`) and schedules `task2` to the event queue.
- After `task1` completes, micro-tasks are processed. In this case, `Micro Task 1 from Task 1` is executed.
- Once all micro-tasks are finished, `task2` is processed by the event loop.

### Simulating Async Behavior

- The `simulateAsyncBehavior()` function mimics async events like I/O or timers by using `setTimeout`. This simulates how the event loop processes asynchronous code after the synchronous code (call stack) and micro-tasks are processed.

### Output (simplified simulation)

```text
Event Loop Started
Call Stack: task1
Running task: task1
Task 1 started
Added to Micro Task Queue: Micro Task 1 from Task 1
Added to Event Queue: task2
Task 1 finished
Call Stack:
Running micro-task: Micro Task 1 from Task 1
Micro Task 1 from Task 1
Call Stack: task2
Running task: task2
Task 2 started
Added to Micro Task Queue: Micro Task 2 from Task 2
Task 2 finished
Call Stack:
Running micro-task: Micro Task 2 from Task 2
Micro Task 2 from Task 2
Event Loop Finished
```

### Summary

- **Call Stack** processes synchronous tasks first.
- **Micro Task Queue** handles micro-tasks (like promises) before any tasks in the **Event Queue**.
- The **Event Queue** stores async tasks like `setTimeout`, `setInterval`, and event handlers.
- The custom event loop simulates the sequence of task execution, ensuring that async tasks are processed after synchronous tasks and micro-tasks.

This example provides a basic simulation of how JavaScript handles the event loop and asynchronous operations in a real-world browser environment.

Here's my take: To build a custom **Event Loop** from scratch in JavaScript, you need to simulate the core components that power V8 / Node.js runtime concurrency.

An event loop continuously coordinates four main pieces:

1. **Call Stack:** Executes synchronous functions immediately.
2. **Microtask Queue (`queueMicrotask`, Promises):** High-priority queue drained completely after _every_ call stack turn before moving to macrotasks.
3. **Macrotask Queue (`setTimeout`, timers):** Lower-priority queue executed one task at a time per tick.
4. **Timer Web APIs:** Background handler that tracks delays and moves callbacks to the macrotask queue when ready.

---

### Complete Custom Event Loop Implementation

This class models synchronous execution, microtask prioritization, macrotask scheduling, and delayed timers:

```javascript
class CustomEventLoop {
  constructor() {
    this.callStack = [];
    this.microtaskQueue = [];
    this.macrotaskQueue = [];
    this.timers = []; // Active timer Web APIs
    this.isRunning = false;
  }

  // --- API Methods ---

  // Synchronous execution: pushes directly onto the call stack
  runSync(task, ...args) {
    this.callStack.push({ task, args });
    this._processCallStack();
  }

  // Microtask: High priority (Promises / queueMicrotask)
  queueMicrotask(task) {
    this.microtaskQueue.push(task);
  }

  // Macrotask: Low priority (setTimeout)
  setTimeout(callback, delay = 0) {
    const executeAt = Date.now() + delay;
    this.timers.push({ callback, executeAt });
  }

  // --- Core Loop Mechanics ---

  // Drains the synchronous Call Stack
  _processCallStack() {
    while (this.callStack.length > 0) {
      const { task, args } = this.callStack.pop();
      try {
        task(...args);
      } catch (err) {
        console.error("Uncaught error in call stack:", err);
      }
    }
  }

  // Drains ALL Microtasks until the microtask queue is completely empty
  _drainMicrotasks() {
    while (this.microtaskQueue.length > 0) {
      const microtask = this.microtaskQueue.shift();
      try {
        microtask();
      } catch (err) {
        console.error("Error in microtask:", err);
      }
    }
  }

  // Checks background Web API timers and pushes ready callbacks to macrotask queue
  _checkTimers() {
    const now = Date.now();
    this.timers = this.timers.filter((timer) => {
      if (now >= timer.executeAt) {
        this.macrotaskQueue.push(timer.callback);
        return false; // Remove from active timers
      }
      return true; // Keep waiting
    });
  }

  // Starts the event loop ticker
  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    const tick = () => {
      // 1. Drain any initial synchronous stack work
      this._processCallStack();

      // 2. Drain ALL microtasks before touching any macrotask
      this._drainMicrotasks();

      // 3. Move ready background timers into the macrotask queue
      this._checkTimers();

      // 4. Process ONE macrotask per tick (if available)
      if (this.macrotaskQueue.length > 0) {
        const macrotask = this.macrotaskQueue.shift();
        try {
          macrotask();
        } catch (err) {
          console.error("Error in macrotask:", err);
        }

        // Immediately drain microtasks that might have been spawned by this macrotask
        this._drainMicrotasks();
      }

      // 5. Continue looping if tasks or timers remain
      if (
        this.microtaskQueue.length > 0 ||
        this.macrotaskQueue.length > 0 ||
        this.timers.length > 0
      ) {
        // Use native scheduling to keep tick loop alive non-blockingly
        setImmediate(tick);
      } else {
        this.isRunning = false;
        console.log("\n[EventLoop] All queues empty. Execution finished.");
      }
    };

    tick();
  }
}
```

---

### Demonstration & Execution Order

Let's test the execution order against standard JavaScript event loop rules:

```javascript
const loop = new CustomEventLoop();

console.log("--- Enqueuing Tasks ---");

// 1. Queue Macrotask (setTimeout 0ms)
loop.setTimeout(() => {
  console.log("4. Macrotask 1 (setTimeout 0)");

  // Macrotask spawning a microtask
  loop.queueMicrotask(() => {
    console.log("5. Microtask inside Macrotask 1");
  });
}, 0);

// 2. Queue Microtask
loop.queueMicrotask(() => {
  console.log("2. Microtask 1");
});

loop.queueMicrotask(() => {
  console.log("3. Microtask 2");
});

// 3. Synchronous Code
loop.runSync(() => {
  console.log("1. Synchronous Execution");
});

// Start loop worker
loop.start();
```

#### Output Log

```text
--- Enqueuing Tasks ---
1. Synchronous Execution
2. Microtask 1
3. Microtask 2
4. Macrotask 1 (setTimeout 0)
5. Microtask inside Macrotask 1

[EventLoop] All queues empty. Execution finished.

```

---

### Key Execution Rules Modeled

1. **Microtask Starvation Prevention:** `_drainMicrotasks()` runs continuously until the queue is zero. If a microtask schedules _another_ microtask, it will execute before any `setTimeout` macrotask.
2. **One Macrotask per Loop:** Only a single macrotask is processed per loop tick, followed immediately by a microtask flush.
3. **Call Stack Priority:** Synchronous operations execute immediately before any queued tasks can begin.

What are the specific phases of the Node.js event loop like poll, check, and timers, and how do they differ from browser event loops?

Here's my take: While both environments run JavaScript, the **Node.js event loop is fundamentally different from the Browser event loop**.

Browsers use a simple **two-queue model** (Microtasks vs. Macrotasks), whereas Node.js uses **libuv** under the hood, which divides execution into **six distinct phases**, each maintaining its own FIFO queue of callbacks.

---

### The 6 Phases of the Node.js Event Loop

In Node.js, one full rotation through these phases is called a **tick**:

1. **Timers Phase:** Executes callbacks scheduled by `setTimeout()` and `setInterval()` whose threshold times have elapsed.
2. **Pending Callbacks Phase:** Executes I/O callbacks deferred to the next loop iteration (e.g., specific TCP system errors like `ECONNREFUSED`).
3. **Idle, Prepare Phase:** Used purely internally by Node.js for engine house-keeping.
4. **Poll Phase (The Engine Heart):**

- Calculates how long it should block for I/O.
- Processes I/O callbacks (file system reads, incoming network connections, HTTP requests).
- If the poll queue becomes empty, Node.js stays here waiting for new I/O _unless_ `setImmediate()` timers exist in the Check phase.

1. **Check Phase:** Executes callbacks scheduled specifically by **`setImmediate()`**.
2. **Close Callbacks Phase:** Handles resource teardown callbacks (e.g., `socket.on('close', ...)`).

---

### What About Microtasks in Node.js?

Unlike the 6 phases above (which process macrotasks), microtasks in Node.js belong to **two internal microtask queues**:

1. **`process.nextTick()` Queue:** Highest priority.
2. **Promise Queue (`Promise.resolve()`, `queueMicrotask()`):** Second highest priority.

#### The Interruption Rule

Whenever Node.js finishes a task in _any_ phase (or transitions between phases), it immediately pauses the event loop, completely drains the `process.nextTick()` queue, and then completely drains the Promise queue before resuming the phase execution.

---

### Node.js vs. Browser Event Loops: Key Differences

| Feature                  | Node.js Event Loop                                                                                    | Browser Event Loop                                                                                           |
| ------------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Underlying Engine**    | Powered by **libuv** (C library).                                                                     | Driven by the browser's HTML Living Standard event loop spec.                                                |
| **Phase Structure**      | **Multi-Phase Pipeline:** Fixed loop order (Timers $\to$ Pending $\to$ Poll $\to$ Check $\to$ Close). | **Two-Queue System:** Task/Macrotask Queue vs. Microtask Queue.                                              |
| **`setImmediate()`**     | Supported natively (runs specifically in the **Check Phase** right after I/O).                        | Not supported in standard modern browsers.                                                                   |
| **`process.nextTick()`** | Exists as an ultra-high priority microtask queue that runs _before_ Promise microtasks.               | Does not exist in browser runtimes.                                                                          |
| **Render Steps**         | No rendering pipeline; runs backend server code until the event loop dies or process exits.           | Includes a dedicated **RequestAnimationFrame / Render Step** to sync with screen refresh rates (60Hz/120Hz). |
| **I/O Strategy**         | Optimized for background threadpool work (`libuv`), non-blocking socket handling, and disk access.    | Optimized for DOM manipulation, network fetching, and user interaction events (clicks, input).               |

---

### Classic Node.js Quirks: `setTimeout` vs `setImmediate`

#### Scenario 1: Top-Level Execution (Non-Deterministic)

```javascript
setTimeout(() => console.log("setTimeout"), 0);
setImmediate(() => console.log("setImmediate"));
```

- **Output:** Order is **non-deterministic** (can log either order depending on system CPU performance).
- _Why?_ Entering the Timers phase requires checking if `1ms` (the default minimum delay) has elapsed. If CPU setup takes $>1\text{ms}$, `setTimeout` runs first; otherwise, the loop passes Timers and hits `setImmediate` in the Check phase first.

#### Scenario 2: Inside an I/O Cycle (Guaranteed Order)

```javascript
const fs = require("fs");

fs.readFile(__filename, () => {
  setTimeout(() => console.log("setTimeout"), 0);
  setImmediate(() => console.log("setImmediate"));
});
```

- **Output:**

```text
setImmediate
setTimeout

```

- _Why?_ File I/O completes inside the **Poll phase**. From the Poll phase, the loop moves _directly_ to the **Check phase** next, guaranteeing `setImmediate()` executes before returning around to the **Timers phase**!

How can we write a custom Promise implementation from scratch that integrates with our custom event loop?

Here's my take: To make a custom `Promise` work with our custom event loop, we need to ensure that **`.then()` and `.catch()` callbacks are never executed synchronously**. Instead, they must be pushed into the event loop's **Microtask Queue**.

Below is a complete, Promises/A+ compliant `CustomPromise` class that connects directly to the `CustomEventLoop` we built earlier.

---

### Custom Promise Implementation (`CustomPromise`)

```javascript
// State constants
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class CustomPromise {
  /**
   * @param {Function} executor - (resolve, reject) => void
   * @param {CustomEventLoop} eventLoop - Reference to our custom event loop instance
   */
  constructor(executor, eventLoop) {
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;

    // Callbacks to execute when state changes
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    // Store event loop reference (defaults to global event loop if passed)
    this.eventLoop = eventLoop;

    const resolve = (value) => {
      // Handle promise resolution procedure if value is another CustomPromise
      if (value instanceof CustomPromise) {
        return value.then(resolve, reject);
      }

      if (this.state === PENDING) {
        this.state = FULFILLED;
        this.value = value;

        // Schedule fulfillment callbacks as MICRO-TASKS in our custom event loop
        this.onFulfilledCallbacks.forEach((cb) => {
          this.eventLoop.queueMicrotask(() => cb(this.value));
        });
      }
    };

    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.reason = reason;

        // Schedule rejection callbacks as MICRO-TASKS in our custom event loop
        this.onRejectedCallbacks.forEach((cb) => {
          this.eventLoop.queueMicrotask(() => cb(this.reason));
        });
      }
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  /**
   * Chaining method returning a new CustomPromise
   */
  then(onFulfilled, onRejected) {
    // Default pass-through handlers for chaining
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            throw err;
          };

    const nextPromise = new CustomPromise((resolve, reject) => {
      const handleCallback = (cb, arg) => {
        try {
          const result = cb(arg);
          if (result instanceof CustomPromise) {
            result.then(resolve, reject);
          } else {
            resolve(result);
          }
        } catch (err) {
          reject(err);
        }
      };

      if (this.state === FULFILLED) {
        // Queue as microtask
        this.eventLoop.queueMicrotask(() =>
          handleCallback(onFulfilled, this.value),
        );
      } else if (this.state === REJECTED) {
        // Queue as microtask
        this.eventLoop.queueMicrotask(() =>
          handleCallback(onRejected, this.reason),
        );
      } else if (this.state === PENDING) {
        // Save callbacks for when promise resolves/rejects later
        this.onFulfilledCallbacks.push((val) =>
          handleCallback(onFulfilled, val),
        );
        this.onRejectedCallbacks.push((err) => handleCallback(onRejected, err));
      }
    }, this.eventLoop);

    return nextPromise;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  // Helper static resolve
  static resolve(value, eventLoop) {
    return new CustomPromise((resolve) => resolve(value), eventLoop);
  }
}
```

---

### Integrating Custom Promises with the Custom Event Loop

Let's wire `CustomPromise` directly into `CustomEventLoop` and run an execution trace combining **synchronous code**, **promises**, and **`setTimeout` macrotasks**:

```javascript
// Initialize Custom Event Loop
const loop = new CustomEventLoop();

console.log("--- Starting Execution ---");

// 1. Enqueue Macrotask (setTimeout)
loop.setTimeout(() => {
  console.log("4. Macrotask (setTimeout 0ms)");
}, 0);

// 2. Create Async Custom Promise
const promise = new CustomPromise((resolve) => {
  console.log("1. Synchronous code inside Promise Executor");

  // Asynchronously resolve after 10ms
  loop.setTimeout(() => {
    resolve("Async Promise Data");
  }, 10);
}, loop);

// 3. Chain .then() handlers
promise
  .then((res) => {
    console.log(`5. Resolved Promise microtask 1: ${res}`);
    return "Next Chained Result";
  })
  .then((res) => {
    console.log(`6. Chained Promise microtask 2: ${res}`);
  });

// 4. Synchronous Stack Code
loop.runSync(() => {
  console.log("2. Synchronous code on Call Stack");
});

// Queue Immediate Microtask
loop.queueMicrotask(() => {
  console.log("3. Direct Microtask");
});

// Start the Event Loop
loop.start();
```

---

### Output Log

```text
--- Starting Execution ---
1. Synchronous code inside Promise Executor
2. Synchronous code on Call Stack
3. Direct Microtask
4. Macrotask (setTimeout 0ms)
5. Resolved Promise microtask 1: Async Promise Data
6. Chained Promise microtask 2: Next Chained Result

[EventLoop] All queues empty. Execution finished.

```

---

### Key Takeaways

1. **Microtask Enclosure:** `CustomPromise` delegates all `.then()` handlers to `eventLoop.queueMicrotask()`. Even if a promise is already fulfilled, `.then()` callbacks are forced to run asynchronously in the next microtask turn.
2. **Chainability:** Every `.then()` call creates and returns a new `CustomPromise` instance bound to the same `CustomEventLoop`, maintaining proper microtask ordering across deep promise chains.
