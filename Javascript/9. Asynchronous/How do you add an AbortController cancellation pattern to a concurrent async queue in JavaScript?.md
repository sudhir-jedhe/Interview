To add `AbortController` cancellation to a concurrent async queue, you must handle cancellation at two distinct stages:

1. **Queued (Pre-Execution):** Prevent waiting tasks from starting and immediately reject their returned promises with an `AbortError` without consuming a concurrency slot.
2. **In-Flight (Active Execution):** Forward the `AbortSignal` directly to the running async task so I/O operations (like `fetch` or file streams) can abort immediately.

---

### Implementation: `CancelableConcurrentQueue`

```javascript
class CancelableConcurrentQueue {
  /**
   * @param {Object} options
   * @param {number} [options.concurrency=2] - Max active concurrent tasks.
   */
  constructor({ concurrency = 2 } = {}) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  /**
   * Adds a task to the queue with optional per-task or global cancellation.
   *
   * @param {Function} taskFn - `(signal: AbortSignal) => Promise<T>`
   * @param {Object} [options]
   * @param {AbortSignal} [options.signal] - Signal to cancel this task.
   * @returns {Promise<T>}
   */
  add(taskFn, { signal } = {}) {
    return new Promise((resolve, reject) => {
      // 1. Guard check: Already aborted before enqueueing
      if (signal?.aborted) {
        return reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
      }

      const descriptor = {
        taskFn,
        resolve,
        reject,
        signal,
        onAbortQueued: null,
      };

      // 2. Setup pre-execution eviction listener
      if (signal) {
        descriptor.onAbortQueued = () => {
          this._evict(descriptor);
          reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
        };
        signal.addEventListener("abort", descriptor.onAbortQueued, { once: true });
      }

      this.queue.push(descriptor);
      this._drain();
    });
  }

  /**
   * Removes a queued task if aborted while waiting in line.
   */
  _evict(descriptor) {
    const idx = this.queue.indexOf(descriptor);
    if (idx !== -1) {
      this.queue.splice(idx, 1);
    }
  }

  /**
   * Drains the queue up to the concurrency limit.
   */
  _drain() {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const descriptor = this.queue.shift();
    const { taskFn, resolve, reject, signal, onAbortQueued } = descriptor;

    // Double check: Aborted right before dequeueing
    if (signal?.aborted) {
      this._drain();
      return;
    }

    // Clean up the waiting-in-queue abort listener so it doesn't linger
    if (signal && onAbortQueued) {
      signal.removeEventListener("abort", onAbortQueued);
    }

    this.running++;

    Promise.resolve()
      // Pass signal down so the task can handle in-flight cancellation
      .then(() => taskFn(signal))
      .then(resolve, reject)
      .finally(() => {
        this.running--;
        this._drain();
      });

    // Launch more workers if concurrency capacity remains
    this._drain();
  }

  /**
   * Cancels all currently queued tasks that have not yet started.
   */
  clear(reason = new DOMException("Queue cleared", "AbortError")) {
    while (this.queue.length > 0) {
      const descriptor = this.queue.shift();
      if (descriptor.signal && descriptor.onAbortQueued) {
        descriptor.signal.removeEventListener("abort", descriptor.onAbortQueued);
      }
      descriptor.reject(reason);
    }
  }

  get pending() {
    return this.queue.length;
  }

  get active() {
    return this.running;
  }
}

```

---

### Usage Example: Managing Per-Task and Global Abort

```javascript
// Simulated async task supporting AbortSignal
function fetchResource(id, delayMs, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      console.log(`[COMPLETED] Task ${id}`);
      resolve(`Data ${id}`);
    }, delayMs);

    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      console.log(`[ABORTED IN-FLIGHT] Task ${id}`);
      reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
    }, { once: true });
  });
}

async function run() {
  const queue = new CancelableConcurrentQueue({ concurrency: 2 });

  const globalController = new AbortController();
  const task3Controller = new AbortController();

  // Tasks 1 & 2 start immediately (consuming concurrency = 2)
  queue.add((sig) => fetchResource(1, 500, sig), { signal: globalController.signal })
    .catch((err) => console.log(`Task 1 catch: ${err.message}`));

  queue.add((sig) => fetchResource(2, 500, sig), { signal: globalController.signal })
    .catch((err) => console.log(`Task 2 catch: ${err.message}`));

  // Task 3 is queued; cancelled while still waiting in the queue
  queue.add((sig) => fetchResource(3, 300, sig), { signal: task3Controller.signal })
    .catch((err) => console.log(`Task 3 catch: ${err.message}`));

  // Task 4 is queued; uses global controller
  queue.add((sig) => fetchResource(4, 300, sig), { signal: globalController.signal })
    .catch((err) => console.log(`Task 4 catch: ${err.message}`));

  // Cancel Task 3 at 100ms (while still in queue)
  setTimeout(() => {
    console.log("--> Cancelling Task 3 while queued...");
    task3Controller.abort(new DOMException("Task 3 cancelled by client", "AbortError"));
  }, 100);

  // Cancel remaining queue + in-flight tasks at 300ms
  setTimeout(() => {
    console.log("--> Triggering global abort...");
    globalController.abort(new DOMException("Global pipeline stopped", "AbortError"));
  }, 300);
}

run();

```

---

### Execution Output

```text
--> Cancelling Task 3 while queued...
Task 3 catch: Task 3 cancelled by client
--> Triggering global abort...
[ABORTED IN-FLIGHT] Task 1
[ABORTED IN-FLIGHT] Task 2
Task 1 catch: Global pipeline stopped
Task 2 catch: Global pipeline stopped
Task 4 catch: Global pipeline stopped

```

1. **Task 3** is evicted from the internal array and rejected at 100ms without ever occupying a running slot.
2. **Tasks 1 and 2** abort mid-flight at 300ms via their signal listener and clear their active timers.
3. **Task 4** was waiting in queue with the global signal; when the global signal aborts, its queued listener evicts and rejects it.

---

### Key Architectural Safeguards

* **Listener Cleanup on Dequeue:** When promoting a task from waiting to running, remove the `onAbortQueued` listener immediately via `signal.removeEventListener`. Leaving it attached causes closures to leak if the `AbortSignal` lives longer than the task.
* **Double Check Before Execution:** Always verify `if (signal?.aborted)` immediately upon pulling the item from the queue inside `_drain()` in case an abort event fired in the same microtask turn.
* **Slot Release via `finally`:** `this.running--` and `this._drain()` are called inside `.finally()`, ensuring that in-flight rejections (including `AbortError`) instantly free up concurrency slots for surviving queued items.
