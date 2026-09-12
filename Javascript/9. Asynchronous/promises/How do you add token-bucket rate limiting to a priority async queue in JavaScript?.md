To combine **Token Bucket Rate Limiting** with a **Priority Queue**, tasks must satisfy two gates before executing:

1. **Concurrency Gate:** In-flight tasks must be below `concurrency`.
2. **Rate Limit Gate:** The token bucket must have at least one token.

If no tokens are available, the queue pauses execution, schedules a single timer for the exact duration until the next token regenerates, and then dispenses it to the **highest-priority** queued task.

---

### Implementation: `PriorityRateLimitedQueue`

```javascript
class PriorityRateLimitedQueue {
  /**
   * @param {Object} options
   * @param {number} options.concurrency - Max simultaneous in-flight tasks.
   * @param {number} options.capacity - Max tokens the bucket can hold (burst limit).
   * @param {number} options.refillRate - Tokens regenerated per second.
   */
  constructor({ concurrency = 2, capacity = 5, refillRate = 2 } = {}) {
    this.concurrency = concurrency;
    this.capacity = capacity;
    this.refillRate = refillRate; // tokens per second

    // Token Bucket State
    this.tokens = capacity;
    this.lastRefill = Date.now();
    this.refillTimer = null;

    // Concurrency & Queue State
    this.running = 0;
    this.queue = [];
    this.seq = 0; // Deterministic FIFO tie-breaker
  }

  /**
   * Calculates dynamic token regeneration based on elapsed time.
   */
  _refillTokens() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    const addedTokens = elapsed * this.refillRate;

    if (addedTokens > 0) {
      this.tokens = Math.min(this.capacity, this.tokens + addedTokens);
      this.lastRefill = now;
    }
  }

  /**
   * Enqueue a task with priority, cancellation, and token requirements.
   *
   * @param {Function} taskFn - `(signal: AbortSignal) => Promise<T>`
   * @param {Object} [options]
   * @param {number} [options.priority=0] - Higher values run first.
   * @param {AbortSignal} [options.signal] - Cancellation signal.
   * @returns {Promise<T>}
   */
  add(taskFn, { priority = 0, signal } = {}) {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        return reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
      }

      const descriptor = {
        taskFn,
        priority,
        order: this.seq++,
        resolve,
        reject,
        signal,
        onAbort: null,
      };

      if (signal) {
        descriptor.onAbort = () => {
          const idx = this.queue.indexOf(descriptor);
          if (idx !== -1) this.queue.splice(idx, 1);
          reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
        };
        signal.addEventListener("abort", descriptor.onAbort, { once: true });
      }

      this._insertSorted(descriptor);
      this._drain();
    });
  }

  _insertSorted(descriptor) {
    let low = 0;
    let high = this.queue.length;

    while (low < high) {
      const mid = (low + high) >>> 1;
      const midItem = this.queue[mid];

      // Order: Descending priority, then ascending arrival order
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
   * Orchestrates consumption of concurrency slots and tokens.
   */
  _drain() {
    // 1. Concurrency limit check
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }

    // 2. Refresh token bucket
    this._refillTokens();

    // 3. Token capacity check
    if (this.tokens < 1) {
      // If a refill timer is already scheduled, don't create duplicates
      if (!this.refillTimer) {
        const tokensNeeded = 1 - this.tokens;
        // Exact milliseconds until 1 whole token becomes available
        const waitMs = Math.ceil((tokensNeeded / this.refillRate) * 1000);

        this.refillTimer = setTimeout(() => {
          this.refillTimer = null;
          this._drain();
        }, waitMs);
      }
      return;
    }

    // 4. Consume token & allocate concurrency slot
    this.tokens -= 1;
    this.running++;

    const descriptor = this.queue.shift();
    const { taskFn, resolve, reject, signal, onAbort } = descriptor;

    if (signal && onAbort) {
      signal.removeEventListener("abort", onAbort);
    }

    // Handle edge case where task aborted right as it was being drained
    if (signal?.aborted) {
      // Refund token since execution never took place
      this.tokens = Math.min(this.capacity, this.tokens + 1);
      this.running--;
      this._drain();
      return;
    }

    Promise.resolve()
      .then(() => taskFn(signal))
      .then(resolve, reject)
      .finally(() => {
        this.running--;
        this._drain();
      });

    // Attempt to launch additional workers if both concurrency & tokens allow
    this._drain();
  }
}

```

---

### Verification Example

In this scenario:

* `capacity = 2`: Can burst 2 tasks right away.
* `refillRate = 1`: Generates only 1 token per second after that.
* Multiple tasks are queued at once with different priorities.

```javascript
const q = new PriorityRateLimitedQueue({
  concurrency: 2,
  capacity: 2,
  refillRate: 1, // 1 token every 1000ms
});

const start = Date.now();
function log(msg) {
  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`[t = ${elapsed}s] ${msg}`);
}

function createTask(name) {
  return async () => {
    log(`Started: ${name}`);
    await new Promise((res) => setTimeout(res, 200));
    log(`Finished: ${name}`);
    return name;
  };
}

// Burst initial tokens (capacity = 2)
q.add(createTask("Task A (Pri: 1)"), { priority: 1 });
q.add(createTask("Task B (Pri: 1)"), { priority: 1 });

// Must wait for token regeneration (rate: 1/sec)
q.add(createTask("Task C (Pri: 1)"), { priority: 1 });
q.add(createTask("Task D (Pri: 10 - High)"), { priority: 10 }); // High priority
q.add(createTask("Task E (Pri: 5 - Medium)"), { priority: 5 });

```

---

### Execution Timeline

```text
[t = 0.00s] Started: Task A (Pri: 1)        <-- Consumes burst Token 1
[t = 0.00s] Started: Task B (Pri: 1)        <-- Consumes burst Token 2
[t = 0.20s] Finished: Task A (Pri: 1)       <-- Slot open, but 0 tokens left (bucket empty)
[t = 0.20s] Finished: Task B (Pri: 1)
[t = 1.00s] Started: Task D (Pri: 10 - High)<-- 1 token regenerated; Highest priority jumps line
[t = 1.20s] Finished: Task D (Pri: 10 - High)
[t = 2.00s] Started: Task E (Pri: 5 - Med)  <-- Next token regenerated; runs before Task C
[t = 2.20s] Finished: Task E (Pri: 5 - Med)
[t = 3.00s] Started: Task C (Pri: 1)        <-- Next token regenerated; lowest priority runs last
[t = 3.20s] Finished: Task C (Pri: 1)

```

---

### Critical Details

* **Floating-Point Token Math:** `this.tokens` increments continuously via `elapsed * refillRate`. It is not bound to rigid whole-second intervals, meaning fractionally replenished tokens are correctly tracked across rapid task finishes.
* **Sleep-to-Regen vs Polling:** Instead of using an interval or polling loop that burns CPU, the queue calculates `tokensNeeded / this.refillRate` and sleeps for that exact period before re-checking.
* **Token Refunding on Pre-Flight Abort:** If an `AbortSignal` fires immediately after `.shift()` but before `taskFn` starts running, the method refunds `this.tokens = Math.min(capacity, tokens + 1)` so the token isn't wasted.
