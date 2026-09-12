To implement cancellation with an `AbortController` in an `async generator`, you must handle two points in the generator's lifecycle:

1. **Before/After yielding:** Check `signal.throwIfAborted()` so the generator ceases iteration and cleans up before starting the next item.
2. **During asynchronous pauses:** Pass the `signal` directly into asynchronous operations or use a race against an abort event listener so the generator interrupts immediately without waiting for the promise to resolve.
3. **Resource Cleanup:** Use `try...finally` blocks to guarantee file handles, sockets, or cursors close properly upon cancellation.

---

### Implementation: The Abort-Aware Async Generator

```javascript
/**
 * Helper: Sleep with immediate cancellation support.
 */
function abortableSleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    function onAbort() {
      clearTimeout(timer);
      reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
    }

    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

/**
 * Async generator that yields items sequentially and supports cancellation.
 */
async function* paginatedDataGenerator(totalPages, signal) {
  let page = 1;

  try {
    while (page <= totalPages) {
      // 1. Guard check prior to starting the next iteration
      signal?.throwIfAborted();

      console.log(`[Generator] Fetching page ${page}...`);

      // 2. Perform async work while passing the signal
      // e.g., await fetch(`/api/items?page=${page}`, { signal })
      await abortableSleep(500, signal);

      const pageData = { page, items: [`item-${page}A`, `item-${page}B`] };

      // 3. Yield the value to the consumer
      yield pageData;

      page++;
    }
  } finally {
    // 4. Guaranteed cleanup block (runs on break, return, error, or abort)
    console.log("[Generator Cleanup] Closing open cursors and freeing resources.");
  }
}

```

---

### Consuming with `for await...of`

When consuming the generator, wrap the loop in a `try...catch` block to intercept the cancellation error cleanly:

```javascript
async function run() {
  const controller = new AbortController();
  const { signal } = controller;

  // Cancel the pipeline after 1200ms (during page 3)
  setTimeout(() => {
    console.log("--> [Controller] Triggering abort signal...");
    controller.abort(new DOMException("Operation canceled by user", "AbortError"));
  }, 1200);

  try {
    // Consume values as they are produced
    for await (const data of paginatedDataGenerator(5, signal)) {
      console.log("[Consumer] Received:", data);
    }
    console.log("[Consumer] Stream completed naturally.");
  } catch (err) {
    if (err.name === "AbortError") {
      console.warn("[Consumer] Iteration halted via cancellation:", err.message);
    } else {
      console.error("[Consumer] Iteration encountered an unexpected error:", err);
    }
  }
}

run();

```

---

### Execution Output

```text
[Generator] Fetching page 1...
[Consumer] Received: { page: 1, items: [ 'item-1A', 'item-1B' ] }
[Generator] Fetching page 2...
[Consumer] Received: { page: 2, items: [ 'item-2A', 'item-2B' ] }
[Generator] Fetching page 3...
--> [Controller] Triggering abort signal...
[Generator Cleanup] Closing open cursors and freeing resources.
[Consumer] Iteration halted via cancellation: Operation canceled by user

```

---

### Alternative: Forcing Generator Termination via `.return()`

If you have a third-party async generator that does not accept an `AbortSignal` parameter, you can wire the signal to invoke the generator's native `return()` method:

```javascript
async function consumeWithSignal(asyncGenIterable, signal) {
  const iterator = asyncGenIterable[Symbol.asyncIterator]();

  const onAbort = () => {
    // Forcibly terminates the generator and triggers its finally block
    iterator.return?.();
  };

  signal?.addEventListener("abort", onAbort, { once: true });

  try {
    while (true) {
      signal?.throwIfAborted();
      const { value, done } = await iterator.next();
      if (done) break;

      console.log("Processed:", value);
    }
  } finally {
    signal?.removeEventListener("abort", onAbort);
  }
}

```

---

### Key Takeaways

* **`try...finally` Reliability:** Whenever an exception or an `AbortError` is thrown inside an async generator (or when `.return()` is called), JavaScript guarantees the `finally` block executes, preventing memory or socket leaks.
* **Synchronous Check Points:** Calling `signal?.throwIfAborted()` directly after `yield` prevents the generator from performing an extra expensive async request if the consumer signaled an abort between chunks.
* **Propagation:** Native `for await...of` loops re-throw any error that bubbles out of the generator, allowing you to centralize error handling and UI notifications in the caller.
