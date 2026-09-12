When pairing a **Circuit Breaker** with a **Concurrency Limiter**, ordering is critical:

* **Placement:** The Circuit Breaker wraps the task execution **inside** or **before** entering the concurrency pool.
* **Why:** If a downstream service is down (circuit is `OPEN`), failing fast immediately prevents tasks from clogging the concurrency limiter's queue and consuming worker capacity.

---

### 1. The Circuit Breaker Implementation

A classic three-state machine:

* **`CLOSED`**: Traffic flows normally. Failures increment a counter; reaching `failureThreshold` trips to `OPEN`.
* **`OPEN`**: Fails fast immediately with `CircuitBreakerOpenError` without hitting the downstream resource. After `resetTimeout`, transitions to `HALF_OPEN`.
* **`HALF_OPEN`**: Permits a limited trial probe. If successful, resets to `CLOSED`; if it fails, trips back to `OPEN`.

```javascript
class CircuitBreakerOpenError extends Error {
  constructor(message = "Circuit breaker is OPEN. Fast-failing request.") {
    super(message);
    this.name = "CircuitBreakerOpenError";
  }
}

class CircuitBreaker {
  constructor({
    failureThreshold = 5,
    resetTimeout = 10000, // 10s
    successThreshold = 2  // required consecutive successes to close from HALF_OPEN
  } = {}) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
    this.successThreshold = successThreshold;

    this.state = "CLOSED"; // "CLOSED" | "OPEN" | "HALF_OPEN"
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttempt = Date.now();
  }

  async execute(fn) {
    if (this.state === "OPEN") {
      if (Date.now() >= this.nextAttempt) {
        this.state = "HALF_OPEN";
        this.successCount = 0;
      } else {
        throw new CircuitBreakerOpenError();
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure(err);
      throw err;
    }
  }

  onSuccess() {
    if (this.state === "HALF_OPEN") {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.state = "CLOSED";
        this.failureCount = 0;
      }
    } else if (this.state === "CLOSED") {
      this.failureCount = 0;
    }
  }

  onFailure(err) {
    // Ignore intentional cancellation or already-open errors
    if (err.name === "AbortError" || err.name === "CircuitBreakerOpenError") {
      return;
    }

    if (this.state === "HALF_OPEN") {
      // Any failure during probe immediately trips circuit
      this.trip();
    } else if (this.state === "CLOSED") {
      this.failureCount++;
      if (this.failureCount >= this.failureThreshold) {
        this.trip();
      }
    }
  }

  trip() {
    this.state = "OPEN";
    this.nextAttempt = Date.now() + this.resetTimeout;
  }
}

```

---

### 2. The Worker Pool Concurrency Limiter

Using the iterator-based concurrency pattern from before, extended to safely drain queue tasks.

```javascript
async function runConcurrent(items, limit, workerFn) {
  const results = new Array(items.length);
  const iterator = items.entries();

  async function worker() {
    for (const [index, item] of iterator) {
      try {
        results[index] = {
          status: "fulfilled",
          value: await workerFn(item)
        };
      } catch (err) {
        results[index] = {
          status: "rejected",
          reason: err
        };
      }
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    () => worker()
  );

  await Promise.all(workers);
  return results;
}

```

---

### 3. Assembling the Pipeline

By placing the circuit check inside the worker loop, the worker immediately drains items when the service is degraded without holding concurrency slots or waiting for network round-trips.

```javascript
// Simulated flaky downstream service
async function callRemoteService(id) {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 100));

  // Simulate remote service outage for items 3 through 8
  if (id >= 3 && id <= 8) {
    throw new Error(`503 Service Unavailable for ID: ${id}`);
  }

  return { id, data: `Payload for ${id}` };
}

async function main() {
  const items = Array.from({ length: 15 }, (_, i) => i + 1);

  // Initialize shared Circuit Breaker for the downstream resource
  const breaker = new CircuitBreaker({
    failureThreshold: 3,  // Trip after 3 consecutive failures
    resetTimeout: 2000,   // Try half-open probe after 2s
    successThreshold: 2
  });

  console.log("Starting execution with Concurrency: 2...");

  const results = await runConcurrent(items, 2, async (item) => {
    // Wrap target call in the circuit breaker
    return await breaker.execute(() => callRemoteService(item));
  });

  // Report outputs
  results.forEach((res, i) => {
    const id = items[i];
    if (res.status === "fulfilled") {
      console.log(`[Item ${id}] Success:`, res.value);
    } else {
      console.log(`[Item ${id}] Failed: ${res.reason.name} - ${res.reason.message}`);
    }
  });
}

main();

```

---

### Execution Dynamics

1. **Initial Flow:** Requests $1$ and $2$ run concurrently and resolve. The breaker remains `CLOSED`.
2. **Tripping:** Requests $3$, $4$, and $5$ fail with `503`. Once the failure count hits $3$, the breaker transitions to `OPEN`.
3. **Queue Evacuation (Fast Fail):** Subsequent requests ($6$, $7$, $8$, etc.) encounter `state === "OPEN"`. Instead of waiting for HTTP requests to time out, they throw `CircuitBreakerOpenError` synchronously. The remaining queue drains in milliseconds.
4. **Recovery (`HALF_OPEN`):** Once $2000\text{ms}$ elapses, the next item serves as a trial probe. If successful, the circuit gradually restores to normal traffic.
