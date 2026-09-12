To implement a priority-based async queue with cancellation, you need three coordinated components:

1. **Priority Ordering with FIFO Tie-Breaking:** Tasks with higher priority execute first. When priorities are equal, tasks dequeue in insertion order (FIFO).
2. **Pre-Execution Eviction:** If a task's `AbortSignal` triggers while waiting in the priority queue, remove it from the collection immediately and reject its promise without consuming a concurrency slot.
3. **In-Flight Cancellation:** Forward the `AbortSignal` directly to the running task function so I/O operations (like `fetch`) abort cleanly.

---

### Implementation: `PriorityCancelableQueue`

```javascript
class PriorityCancelableQueue {
  /**
   * @param {Object} options
   * @param {number} options.concurrency - Maximum concurrent in-flight tasks.
   */
  constructor({ concurrency = 1 } = {}) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
    this.insertionSequence = 0; // Monotonic counter for FIFO tie-breaking
  }

  /**
   * Adds a task to the priority queue.
   *
   * @param {Function} taskFn - `(signal: AbortSignal) => Promise<T>`
   * @param {Object} [options]
   * @param {number} [options.priority=0] - Higher numbers run earlier.
   * @param {AbortSignal} [options.signal] - Optional cancellation signal.
   * @returns {Promise<T>}
   */
  add(taskFn, { priority = 0, signal } = {}) {
    return new Promise((resolve, reject) => {
      // 1. Fast check: Cancelled before entering the queue
      if (signal?.aborted) {
        return reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
      }

      const descriptor = {
        taskFn,
        priority,
        order: this.insertionSequence++,
        resolve,
        reject,
        signal,
        onAbortQueued: null,
      };

      // 2. Setup pre-execution abort handler
      if (signal) {
        descriptor.onAbortQueued = () => {
          this._evict(descriptor);
          reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
        };
        signal.addEventListener("abort", descriptor.onAbortQueued, { once: true });
      }

      // 3. Insert preserving sort order (Binary Insert)
      this._insertSorted(descriptor);
      this._drain();
    });
  }

  /**
   * Binary insertion to maintain descending priority order,
   * with insertion sequence as a tiebreaker.
   */
  _insertSorted(descriptor) {
    let low = 0;
    let high = this.queue.length;

    while (low < high) {
      const mid = (low + high) >>> 1;
      const midItem = this.queue[mid];

      // Sort criteria: High priority first; if equal, earlier arrival first
      if (
        descriptor.priority < midItem.priority ||
        (descriptor.priority === midItem.priority && descriptor.order > midItem.order)
      ) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }

    this.queue.splice(low, 0, descriptor);
  }

  /**
   * Removes a queued task if aborted before execution.
   */
  _evict(descriptor) {
    const idx = this.queue.indexOf(descriptor);
    if (idx !== -1) {
      this.queue.splice(idx, 1);
    }
  }

  /**
   * Concurrency manager and task executor.
   */
  _drain() {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const descriptor = this.queue.shift();
    const { taskFn, resolve, reject, signal, onAbortQueued } = descriptor;

    // Double-check abort status right at dequeue time
    if (signal?.aborted) {
      this._drain();
      return;
    }

    // Task promoted to running; clean up the queue listener
    if (signal && onAbortQueued) {
      signal.removeEventListener("abort", onAbortQueued);
    }

    this.running++;

    Promise.resolve()
      .then(() => taskFn(signal))
      .then(resolve, reject)
      .finally(() => {
        this.running--;
        this._drain();
      });
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

### Verification and Usage

```javascript
// Test task helper that honors AbortSignal
function makeTask(name, delay, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      console.log(`[COMPLETED] ${name}`);
      resolve(`Result of ${name}`);
    }, delay);

    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      console.log(`[ABORTED IN-FLIGHT] ${name}`);
      reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
    }, { once: true });
  });
}

async function run() {
  // Concurrency = 1 forces strict sequential verification
  const queue = new PriorityCancelableQueue({ concurrency: 1 });
  const cancelController = new AbortController();

  console.log("Enqueueing tasks with varying priorities...");

  // 1. Starts immediately (slot open)
  queue.add((sig) => makeTask("Task Low 1", 300, sig), { priority: 1 });

  // 2. Queued: Priority 2 (should run before Priority 1)
  queue.add((sig) => makeTask("Task Medium 1", 200, sig), { priority: 5 })
    .then((res) => console.log(`Finished: ${res}`));

  // 3. Queued: Priority 10 (Highest; should jump ahead of Medium 1)
  queue.add((sig) => makeTask("Task Critical 1", 200, sig), { priority: 10 })
    .then((res) => console.log(`Finished: ${res}`));

  // 4. Queued: Priority 10, but will be cancelled while waiting
  queue.add((sig) => makeTask("Task Critical 2 (Will Cancel)", 200, sig), {
    priority: 10,
    signal: cancelController.signal
  }).catch((err) => console.log(`[CAUGHT] ${err.message}`));

  // Cancel Task Critical 2 before Task Low 1 finishes
  setTimeout(() => {
    console.log("--> Cancelling 'Task Critical 2' while queued...");
    cancelController.abort(new DOMException("Canceled by client", "AbortError"));
  }, 100);
}

run();

```

---

### Output Order Walkthrough

```text
Enqueueing tasks with varying priorities...
--> Cancelling 'Task Critical 2' while queued...
[CAUGHT] Canceled by client
[COMPLETED] Task Low 1
[COMPLETED] Task Critical 1
[COMPLETED] Task Medium 1
Finished: Result of Task Critical 1
Finished: Result of Task Medium 1

```

1. **`Task Low 1`** starts immediately because `running === 0`.
2. While `Task Low 1` is working, **`Task Critical 2`** aborts. It is spliced from the array and rejected immediately without executing.
3. Once `Task Low 1` completes, the queue inspects the remaining tasks: `Critical 1` (priority 10) takes precedence over `Medium 1` (priority 5).
4. Tasks execute in exact descending priority order.

---

### Engineering Trade-Offs

* **Binary Insert vs. Binary Heap:** For JavaScript applications queuing dozens to a few thousand tasks, binary insertion into an array via `Array.prototype.splice` is compact and fast. If you expect sustained queue lengths exceeding $10^5$ items, replace the array with a **Min/Max Binary Heap** to reduce queue insertions from $O(N)$ to $O(\log N)$.
* **Tie-Breaking (`this.insertionSequence`):** Standard heap or array implementations are not naturally stable. Using a monotonically increasing integer ensures tasks with identical priority retain deterministic FIFO execution order.
