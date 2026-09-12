To implement a **Circuit Breaker** inside an ES6 Proxy pipeline, you encapsulate a shared finite state machine with three states:

* **`CLOSED`**: Requests pass through normally. Successes reset the failure count. Repeated failures trip the circuit.
* **`OPEN`**: Requests fail immediately without executing the downstream operation (**fail fast**), protecting external services from overload.
* **`HALF-OPEN`**: After a cooling period (`resetTimeoutMs`), a trial execution is permitted. If it succeeds, the circuit heals (`CLOSED`); if it fails, it trips again (`OPEN`).

---

### 1. The Circuit Breaker State Machine

This state machine maintains the counters and state transitions:

```javascript
class CircuitBreakerOpenException extends Error {
  constructor(message = 'Circuit breaker is OPEN. Fast-failing execution.') {
    super(message);
    this.name = 'CircuitBreakerOpenException';
  }
}

class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 3;
    this.resetTimeoutMs = options.resetTimeoutMs || 5000;
    this.state = 'CLOSED'; // 'CLOSED' | 'OPEN' | 'HALF-OPEN'
    this.failureCount = 0;
    this.nextAttempt = Date.now();
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() >= this.nextAttempt) {
        this.state = 'HALF-OPEN';
      } else {
        throw new CircuitBreakerOpenException(
          `Circuit breaker is OPEN. Next probe allowed in ${this.nextAttempt - Date.now()}ms`
        );
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error);
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure(error) {
    this.failureCount++;
    if (this.state === 'HALF-OPEN' || this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeoutMs;
    }
  }
}

```

---

### 2. Integrating the Circuit Breaker into the Async Proxy Pipeline

We attach the circuit breaker instance to the proxy so that all method resolutions, direct calls, and pipelines share the circuit state:

```javascript
function createProtectedPipeline(initialValue, options = {}) {
  // A shared circuit breaker instance for all operations across this pipeline instance
  const breaker = options.breaker || new CircuitBreaker(options);

  function createProxy(currentPromise) {
    const targetFn = function () {};

    return new Proxy(targetFn, {
      // Thenable protocol allows native `await pipeline`
      get(target, prop) {
        if (prop === 'then') {
          return (onFulfilled, onRejected) =>
            currentPromise.then(onFulfilled, onRejected);
        }
        if (prop === 'catch') {
          return (onRejected) => currentPromise.catch(onRejected);
        }
        if (prop === 'finally') {
          return (onFinally) => currentPromise.finally(onFinally);
        }

        // Inspection hook
        if (prop === 'breakerState') {
          return breaker.state;
        }

        return function (...args) {
          const nextPromise = currentPromise.then(async (resolvedVal) => {
            // Guard the execution through the circuit breaker
            return breaker.execute(async () => {
              if (prop === 'pipe') {
                const [fn] = args;
                return fn(resolvedVal);
              }

              if (resolvedVal != null && typeof resolvedVal[prop] === 'function') {
                return resolvedVal[prop](...args);
              }

              if (typeof Math[prop] === 'function') {
                return Math[prop](resolvedVal, ...args);
              }

              throw new TypeError(`Method "${String(prop)}" not found on target.`);
            });
          });

          return createProxy(nextPromise);
        };
      },

      // Direct functional invocation: pipeline(async val => ...)
      apply(target, thisArg, args) {
        const [fn] = args;
        const nextPromise = currentPromise.then(async (resolvedVal) => {
          return breaker.execute(() => fn(resolvedVal));
        });

        return createProxy(nextPromise);
      },
    });
  }

  return createProxy(Promise.resolve(initialValue));
}

```

---

### 3. Usage & Behavior Verification

Let's test this with a remote service that goes down and then recovers:

```javascript
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

let serviceOnline = false;
let callCount = 0;

async function queryThirdPartyService(query) {
  callCount++;
  console.log(`[HTTP Request #${callCount}] Attempting call for: ${query}`);
  if (!serviceOnline) {
    throw new Error('500 Internal Server Error');
  }
  return { status: 200, data: `Payload for ${query}` };
}

async function run() {
  const sharedBreaker = new CircuitBreaker({
    failureThreshold: 2, // Trips after 2 consecutive errors
    resetTimeoutMs: 1500, // Stays open for 1.5s before half-open probe
  });

  const runRequest = (id) =>
    createProtectedPipeline(id, { breaker: sharedBreaker })
      .pipe(queryThirdPartyService)
      .pipe((res) => res.data);

  // 1. Initial failures trip the breaker
  try { await runRequest('req-1'); } catch (e) { console.error('Req 1 Failed:', e.message); }
  try { await runRequest('req-2'); } catch (e) { console.error('Req 2 Failed:', e.message); }

  console.log('\n--- Breaker tripped. State is now OPEN ---');

  // 2. These fail instantly without calling queryThirdPartyService (callCount doesn't increase)
  try { await runRequest('req-3'); } catch (e) { console.error('Req 3 Short-Circuited:', e.message); }
  try { await runRequest('req-4'); } catch (e) { console.error('Req 4 Short-Circuited:', e.message); }

  console.log(`Total actual network requests sent so far: ${callCount}`); // Still 2!

  // 3. Wait for reset timeout to expire
  console.log('\nWaiting 1.6 seconds for circuit to transition to HALF-OPEN...');
  await wait(1600);
  serviceOnline = true; // Remote service recovers

  // 4. Trial probe succeeds and heals the circuit back to CLOSED
  const recoveredResult = await runRequest('req-5');
  console.log('Req 5 Succeeded:', recoveredResult);
  console.log('Breaker state healed to:', sharedBreaker.state);
}

run();

```

**Output Log:**

```text
[HTTP Request #1] Attempting call for: req-1
Req 1 Failed: 500 Internal Server Error
[HTTP Request #2] Attempting call for: req-2
Req 2 Failed: 500 Internal Server Error

--- Breaker tripped. State is now OPEN ---
Req 3 Short-Circuited: Circuit breaker is OPEN. Next probe allowed in 1498ms
Req 4 Short-Circuited: Circuit breaker is OPEN. Next probe allowed in 1497ms
Total actual network requests sent so far: 2

Waiting 1.6 seconds for circuit to transition to HALF-OPEN...
[HTTP Request #3] Attempting call for: req-5
Req 5 Succeeded: Payload for req-5
Breaker state healed to: CLOSED

```

---

### Key Architectural Safeguards

1. **Shared Breaker Instance:** When scaling across concurrent pipelines, pass the same `breaker` instance into `createProtectedPipeline(id, { breaker: sharedBreaker })`. This ensures that one failed pipeline trips the breaker for all other parallel pipelines hitting that same downstream dependency.
2. **Selective Filtering:** Don't count application-level validation errors (like HTTP `400 Bad Request` or `404 Not Found`) against the circuit. Update `breaker.onFailure` to inspect `error.status >= 500` before incrementing `failureCount`.
3. **Fallback Fallthrough:** You can catch `CircuitBreakerOpenException` to immediately serve a cached fallback value instead of failing the user request outright.
