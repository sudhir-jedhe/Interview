# Problem: Global Handlers for a Node Script

**Goal:** Implement `process.on('unhandledRejection', ...)` and `process.on('uncaughtException', ...)` for a small Node script, so that any error which slips past all local `try`/`catch` blocks is still logged with useful context before the process exits gracefully — rather than crashing with an unhelpful stack dump, or (worse) silently continuing in a corrupted state.

## Implementation

```js
function setupGlobalErrorHandlers({ logger = console, exitCode = 1 } = {}) {
  let isShuttingDown = false;

  function shutdown(reason, error) {
    if (isShuttingDown) return; // avoid handling the same fatal condition twice
    isShuttingDown = true;

    logger.error(`[fatal] ${reason}:`, error);
    // In a real app: flush logs, close DB connections, stop accepting new work, etc.
    // Exiting deliberately rather than trying to "keep going" — app state may be corrupted.
    process.exitCode = exitCode;
    setTimeout(() => process.exit(exitCode), 100).unref(); // give async logging a moment to flush
  }

  process.on("unhandledRejection", (reason) => {
    // `reason` is often (but not guaranteed to be) an Error instance
    const error = reason instanceof Error ? reason : new Error(String(reason));
    shutdown("Unhandled promise rejection", error);
  });

  process.on("uncaughtException", (error) => {
    shutdown("Uncaught exception", error);
  });
}

module.exports = { setupGlobalErrorHandlers };
```

## Wiring it up in a script's entry point

```js
const { setupGlobalErrorHandlers } = require("./errorHandlers");

setupGlobalErrorHandlers({ logger: console, exitCode: 1 });

async function main() {
  // ... normal application logic, with its own local try/catch where recovery IS possible ...
  await runJob();
}

main().catch((err) => {
  // Errors from main() itself should still be handled explicitly here —
  // global handlers are a safety net for what slips through, not the primary path.
  console.error("main() failed:", err);
  process.exitCode = 1;
});
```

## Demonstrating both paths fire correctly

```js
setupGlobalErrorHandlers();

// Simulate an unhandled rejection — nothing ever calls .catch() on this promise
setTimeout(() => {
  Promise.reject(new Error("simulated unhandled rejection"));
}, 10);

// (In a separate run) simulate a genuine uncaught synchronous exception:
// setTimeout(() => { throw new Error("simulated uncaught exception"); }, 10);
```

## Key implementation details interviewers probe for

- **Log then exit, don't try to "recover"**: the Node docs explicitly warn that resuming normal operation after `uncaughtException` is unsafe, since the error may have left internal state inconsistent (a half-completed operation, a corrupted in-memory cache, etc.) — this handler's job is a clean, logged shutdown, not error recovery.
- **`reason` in `unhandledRejection` isn't guaranteed to be an `Error`**: code can do `Promise.reject("just a string")`, so defensively normalizing non-Error reasons avoids `logger.error` receiving something with no `.stack`.
- **Guarding against double-shutdown**: if both handlers somehow fire in quick succession (or the same fatal condition triggers multiple events), the `isShuttingDown` flag prevents redundant shutdown logic or a confusing double log.
- **`setTimeout(...).unref()` before `process.exit()`**: gives buffered/async logging (e.g., to a file or remote service) a brief moment to flush before the process actually terminates, rather than calling `process.exit()` synchronously and potentially losing the final log line.
