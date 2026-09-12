To implement cancellation across queued promises, you need to handle two distinct phases:

1. **Pending in Queue (Unstarted):** If cancelled before execution starts, reject the caller's promise immediately and drop it from the queue without ever invoking the underlying task.
2. **Currently Active (In-Flight):** Pass an active `AbortSignal` directly to the task so ongoing operations (like `fetch`, timers, or streams) can be interrupted immediately.

---

### Implementation: Cancelable Async Queue

```javascript
class CancelableQueue {
  constructor({ concurrency = 1 } = {}) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  /**
   * Enqueue a task with an optional AbortSignal.
   *
   * @param {Function} taskFn - `(signal: AbortSignal) => Promise<T>`
   * @param {Object} [options]
   * @param {AbortSignal} [options.signal] - Signal to cancel this specific task
   * @returns {Promise<T>}
   */
  add(taskFn, { signal } = {}) {
    return new Promise((resolve, reject) => {
      // 1. Fast-path: Already aborted before entering the queue
      if (signal?.aborted) {
        return reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
      }

      // Descriptor holding execution contexts
      const taskDescriptor = {
        taskFn,
        resolve,
        reject,
        signal,
        abortListener: null,
      };

      // 2. Setup cancellation listener while waiting in queue
      if (signal) {
        taskDescriptor.abortListener = () => {
          // Remove from pending queue if not yet started
          const idx = this.queue.indexOf(taskDescriptor);
          if (idx !== -1) {
            this.queue.splice(idx, 1);
          }
          reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
        };

        signal.addEventListener("abort", taskDescriptor.abortListener, { once: true });
      }

      this.queue.push(taskDescriptor);
      this._dequeue();
    });
  }

  _dequeue() {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const descriptor = this.queue.shift();
    const { taskFn, resolve, reject, signal, abortListener } = descriptor;

    // Edge check: Aborted while in queue right before dequeue
    if (signal?.aborted) {
      this._dequeue();
      return;
    }

    // Task is now active; detach queue-waiting abort listener
    if (signal && abortListener) {
      signal.removeEventListener("abort", abortListener);
    }

    this.running++;

    // Execute active task, passing through the signal for in-flight cancellation
    Promise.resolve()
      .then(() => taskFn(signal))
      .then(
        (value) => {
          resolve(value);
        },
        (err) => {
          reject(err);
        }
      )
      .finally(() => {
        this.running--;
        this._dequeue();
      });
  }

  /**
   * Number of pending (unstarted) tasks in the queue.
   */
  get size() {
    return this.queue.length;
  }

  /**
   * Purge all queued unstarted tasks.
   */
  clear() {
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task.signal && task.abortListener) {
        task.signal.removeEventListener("abort", task.abortListener);
      }
      task.reject(new DOMException("Queue cleared", "AbortError"));
    }
  }
}

```

---

### Usage: Per-Task and Global Cancellation

```javascript
// Simulated async operation respecting an AbortSignal
function mockNetworkRequest(id, delay, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      console.log(`[Task ${id}] Finished`);
      resolve(`Result ${id}`);
    }, delay);

    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        console.log(`[Task ${id}] Aborted in-flight!`);
        reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
      },
      { once: true }
    );
  });
}

async function run() {
  const queue = new CancelableQueue({ concurrency: 2 });
  const globalController = new AbortController();
  const task3Controller = new AbortController();

  // Task 1 & 2 run immediately (concurrency = 2)
  queue.add((sig) => mockNetworkRequest(1, 1000, sig), { signal: globalController.signal })
    .catch((err) => console.error(`Task 1 error: ${err.message}`));

  queue.add((sig) => mockNetworkRequest(2, 1000, sig), { signal: globalController.signal })
    .catch((err) => console.error(`Task 2 error: ${err.message}`));

  // Task 3 will wait in queue
  queue.add((sig) => mockNetworkRequest(3, 1000, sig), { signal: task3Controller.signal })
    .then((res) => console.log("Task 3 got:", res))
    .catch((err) => console.error(`Task 3 error: ${err.name} - ${err.message}`));

  // Task 4 will wait in queue
  queue.add((sig) => mockNetworkRequest(4, 1000, sig), { signal: globalController.signal })
    .catch((err) => console.error(`Task 4 error: ${err.message}`));

  // Case A: Cancel Task 3 while it is STILL in the queue (unstarted)
  setTimeout(() => {
    console.log("--> Cancelling Task 3 while queued...");
    task3Controller.abort(new DOMException("Task 3 cancelled by user", "AbortError"));
  }, 200);

  // Case B: Abort everything remaining (Task 1 & 2 in-flight, Task 4 in queue)
  setTimeout(() => {
    console.log("--> Triggering Global Abort...");
    globalController.abort(new DOMException("Global pipeline stopped", "AbortError"));
  }, 600);
}

run();

```

---

### Key Architectural Safeguards

* **Listener Cleanup (`removeEventListener`):** When a task transitions from "queued" to "running", its queue-waiting abort listener is removed. This prevents memory leaks and ensures abort events inside the execution phase are handled by the actual worker task logic.
* **Slot Recovery in `finally`:** Concurrency decrementation (`this.running--`) and the next `_dequeue()` call are located exclusively inside `.finally()`, ensuring workers don't get stuck if a task rejects synchronously or via abort.
* **No Phantom Invocations:** If a task aborts while queued, splicing it out of `this.queue` prevents it from consuming CPU or slots when preceding tasks resolve.
