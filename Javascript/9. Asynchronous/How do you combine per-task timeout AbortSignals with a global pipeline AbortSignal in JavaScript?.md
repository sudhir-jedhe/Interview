The modern standard to combine a global pipeline `AbortSignal` with a per-task timeout `AbortSignal` is **`AbortSignal.any()`** paired with **`AbortSignal.timeout()`**.

`AbortSignal.any()` takes an array of signals and returns a unified signal that fires as soon as the **first** constituent signal triggers, preserving the specific abort reason (`TimeoutError` vs. manual `AbortError`).

---

### Basic Pattern

```javascript
async function fetchWithTaskTimeout(url, { globalSignal, timeoutMs = 3000 } = {}) {
  // 1. Create a transient, per-task timeout signal
  const timeoutSignal = AbortSignal.timeout(timeoutMs);

  // 2. Compose signals: aborts if global cancels OR if local timeout expires
  const combinedSignal = globalSignal
    ? AbortSignal.any([globalSignal, timeoutSignal])
    : timeoutSignal;

  try {
    const response = await fetch(url, { signal: combinedSignal });
    return await response.json();
  } catch (err) {
    // 3. Inspect which signal caused the interruption
    if (globalSignal?.aborted) {
      console.warn("Operation cancelled by user/pipeline shutdown.");
    } else if (timeoutSignal.aborted) {
      console.warn(`Task exceeded duration limit of ${timeoutMs}ms.`);
    }
    throw err;
  }
}

```

---

### Integrating into an Asynchronous Loop / Pool

When executing a sequence of tasks or pulling from a concurrency pool, the **global signal stays constant**, while a **new timeout signal must be instantiated for each task**:

```javascript
async function processTask(taskItem, globalSignal, perTaskLimitMs = 2000) {
  // Fresh timeout per attempt/task
  const timeoutSignal = AbortSignal.timeout(perTaskLimitMs);
  const combinedSignal = AbortSignal.any(
    globalSignal ? [globalSignal, timeoutSignal] : [timeoutSignal]
  );

  return executeOperation(taskItem, combinedSignal);
}

async function runPipeline(items, { globalSignal, perTaskLimitMs = 1500 } = {}) {
  const results = [];

  for (const item of items) {
    // Stop pipeline immediately if global cancellation fired earlier
    globalSignal?.throwIfAborted();

    try {
      const result = await processTask(item, globalSignal, perTaskLimitMs);
      results.push({ status: "fulfilled", value: result });
    } catch (err) {
      // If the global pipeline was aborted, stop the entire loop
      if (globalSignal?.aborted) {
        throw err;
      }

      // If only this single task timed out, record failure and continue pipeline
      results.push({ status: "rejected", reason: err });
    }
  }

  return results;
}

```

---

### Polyfill for Environments Missing `AbortSignal.any()`

If targeting runtimes that do not yet support `AbortSignal.any()` natively, combine them using an intermediary `AbortController`:

```javascript
function composeSignals(signals) {
  const controller = new AbortController();

  for (const signal of signals) {
    if (!signal) continue;

    // Fast-path: already aborted
    if (signal.aborted) {
      controller.abort(signal.reason);
      return controller.signal;
    }

    signal.addEventListener(
      "abort",
      () => controller.abort(signal.reason),
      { once: true }
    );
  }

  return controller.signal;
}

```

---

### Critical Implementation Rules

* **Error Identification:**
* When triggered by `AbortSignal.timeout()`, the thrown exception is a native `DOMException` where `err.name === "TimeoutError"`.
* When triggered by `controller.abort()`, it defaults to `err.name === "AbortError"`.

* **Avoid Reusing Timeout Signals:** Never share an `AbortSignal.timeout()` across multiple items or retry attempts. Once an `AbortSignal` transitions to the `aborted` state, it cannot be reset; reusing it will cause subsequent tasks to fail instantly.
* **Pre-Execution Checks:** Always check `globalSignal?.throwIfAborted()` before dispatching the next task in a sequence so tasks are not invoked if the pipeline has already been canceled.
