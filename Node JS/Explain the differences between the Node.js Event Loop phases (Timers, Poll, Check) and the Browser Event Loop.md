While both the **Browser** and **Node.js** use an event loop to execute non-blocking, asynchronous JavaScript on top of a single main thread, their underlying architecture and implementation details differ significantly.

* **The Browser Event Loop** is defined by the **HTML5 Specification** and revolves around user interactions, microtasks, and maintaining a smooth 60fps/120fps UI rendering pipeline.
* **The Node.js Event Loop** is powered by **libuv** (a C library) and is structured around low-level system I/O phases (file system, network sockets, OS timers, and process signals).

---

## 1. Architectural Difference Overview

```
   BROWSER EVENT LOOP                       NODE.JS (LIBUV) EVENT LOOP
┌─────────────────────────┐               ┌─────────────────────────────────┐
│     Call Stack (Sync)   │               │   1. Timers Phase               │
└────────────┬────────────┘               │      (setTimeout, setInterval)  │
             │                            └────────────────┬────────────────┘
┌────────────▼────────────┐                                │
│    Microtask Queue      │               ┌────────────────▼────────────────┐
│   (Promises, Mutation)  │               │   2. Pending I/O Callbacks Phase│
└────────────┬────────────┘               └────────────────┬────────────────┘
             │                                             │
┌────────────▼────────────┐               ┌────────────────▼────────────────┐
│     Render Pipeline     │               │   3. Idle, Prepare Phase        │
│    (rAF, Layout, Paint) │               └────────────────┬────────────────┘
└────────────┬────────────┘                                │
             │                            ┌────────────────▼────────────────┐
┌────────────▼────────────┐               │   4. Poll Phase (I/O Fetching)  │
│     Macrotask Queue     │               └────────────────┬────────────────┘
│   (1 Task per iteration)│                                │
└─────────────────────────┘               ┌────────────────▼────────────────┐
                                          │   5. Check Phase (setImmediate) │
                                          └────────────────┬────────────────┘
                                                           │
                                          ┌────────────────▼────────────────┐
                                          │   6. Close Callbacks Phase      │
                                          └─────────────────────────────────┘

```

---

## 2. Deep Dive: The Node.js Libuv Event Loop Phases

Unlike the browser's dual-queue system (Microtask vs. Macrotask), libuv executes asynchronous tasks through **six distinct phases**. Each phase has its own FIFO queue of callbacks.

### 1. Timers Phase

* **What runs here:** Callbacks scheduled by `setTimeout()` and `setInterval()`.
* **Mechanics:** Checks if the elapsed time exceeds the threshold set by the timer. If ready, executes their callbacks.

### 2. Pending I/O Callbacks Phase

* **What runs here:** System-level error callbacks.
* **Mechanics:** Executes I/O callbacks deferred from the previous loop iteration (for example, socket errors like `ECONNREFUSED` reported by the OS).

### 3. Idle, Prepare Phase

* **What runs here:** Used internally by Node.js and libuv for housekeeping before starting main I/O polling.

### 4. Poll Phase (The Engine Room)

This is the most critical phase of the Node.js event loop. It has two main functions:

1. **Executing pending I/O callbacks:** Reads incoming data from network sockets, database responses, or disk file reads.
2. **Calculating polling timeouts:** If the Poll Queue is empty:

* If `setImmediate()` scripts are queued, the loop **ends the Poll phase immediately** and moves to the **Check phase**.
* If timers are pending, it waits until the nearest timer threshold is reached, then circles back to the **Timers phase**.
* Otherwise, it blocks and waits for new I/O events to arrive.

### 5. Check Phase

* **What runs here:** Callbacks scheduled by **`setImmediate()`**.
* **Mechanics:** `setImmediate()` is specifically designed to run callbacks immediately after the Poll phase completes I/O operations.

### 6. Close Callbacks Phase

* **What runs here:** Cleanup and handle teardown events (e.g., `socket.on('close', ...)`).

---

## 3. Key Differences: Node.js vs. Browser

| Feature                | Browser Event Loop                                  | Node.js (libuv) Event Loop                                         |
| ---------------------- | --------------------------------------------------- | ------------------------------------------------------------------ |
| **Specification**      | HTML5 Standard                                      | libuv C-library Implementation                                     |
| **Primary Goal**       | User input, DOM updates, UI smooth rendering        | Low-level OS I/O, server throughput, filesystem access             |
| **Macrotask Model**    | Generic queue (processes **1 macrotask** per cycle) | Phased execution queues (**Timers, Poll, Check, Close**)           |
| **`setImmediate()`**   | Non-standard / Unsupported                          | First-class citizen (runs in the **Check Phase**)                  |
| **UI Rendering**       | Runs rendering pipeline (~16.6ms) between ticks     | No rendering layer (Headless environment)                          |
| **`process.nextTick`** | Not available                                       | Dedicated high-priority queue evaluated before standard microtasks |

---

## 4. Microtask Execution Differences (Node 11+ vs. Legacy)

Historically (Node.js 10 and older), Node.js drained the microtask queue only **between phases** of the libuv event loop.

However, since **Node.js 11**, Node aligned its behavior with the Browser HTML5 standard: **microtasks are drained immediately after every single async callback finishes execution**, regardless of which phase the event loop is currently in.

```javascript
setTimeout(() => {
  console.log('Timeout 1');
  Promise.resolve().then(() => console.log('Promise 1'));
}, 0);

setTimeout(() => {
  console.log('Timeout 2');
  Promise.resolve().then(() => console.log('Promise 2'));
}, 0);

```

### Execution Output (Node 11+ & Modern Browsers)

```text
Timeout 1
Promise 1
Timeout 2
Promise 2

```

*(In both Node 11+ and modern browsers, the microtask `Promise 1` runs immediately after `Timeout 1` completes, before `Timeout 2` is allowed to run).*

---

## 5. Classic Node.js Edge Case: `setTimeout(..., 0)` vs `setImmediate()`

One of the most common interview questions is predicting the order of `setTimeout(..., 0)` vs `setImmediate()`.

### Case A: Called in the Main (Global) Module

```javascript
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));

```

**Output:** **Nondeterministic!** (`timeout` then `immediate`, or `immediate` then `timeout`).

**Why?**
Entering the event loop takes a few CPU cycles. In Node.js, `setTimeout(fn, 0)` is automatically converted to `setTimeout(fn, 1ms)`. If the event loop enters the **Timers Phase** faster than 1ms, the timer hasn't expired yet, so it skips to the **Check Phase** (`immediate` logs first). If CPU execution takes longer than 1ms, the timer is ready (`timeout` logs first).

### Case B: Called Inside an I/O Cycle

```javascript
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
});

```

**Output:** **Always deterministic!**

```text
immediate
timeout

```

**Why?**

1. `fs.readFile` finishes in the **Poll Phase**.
2. Inside the Poll Phase callback, both `setTimeout` and `setImmediate` are registered.
3. The event loop leaves the Poll Phase and moves directly to the next phase: the **Check Phase**!
4. Therefore, `setImmediate` **always executes first** when called inside an I/O callback.

---

## 6. The `process.nextTick()` Exception in Node.js

Node.js features a unique function called `process.nextTick()`.

Technically, `process.nextTick()` is **not part of the event loop at all**. Instead, it sits in its own microtask queue managed directly by V8.

```
Priority Chain in Node.js:
[ Synchronous Code ] ──► [ process.nextTick Queue ] ──► [ Promise Microtask Queue ] ──► [ Current Event Loop Phase ]

```

```javascript
Promise.resolve().then(() => console.log('Promise microtask'));
process.nextTick(() => console.log('nextTick microtask'));

console.log('Sync main module');

```

**Output:**

```text
Sync main module
nextTick microtask
Promise microtask

```

> **Warning:** Recursively calling `process.nextTick()` will completely starve the Event Loop, blocking all phases (Timers, I/O, and Check) from ever executing.
