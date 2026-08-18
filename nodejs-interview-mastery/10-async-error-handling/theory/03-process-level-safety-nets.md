# Process-Level Safety Nets

```js
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection:', reason);
  // log it, alert, then typically exit — don't just swallow it
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1); // do NOT try to keep running
});
```
`unhandledRejection` fires when a promise rejects and nothing ever attaches a `.catch`. `uncaughtException` fires when a synchronous throw escapes every try/catch in the call stack. Both indicate a bug in error handling somewhere in your code — they are last-resort nets, not a substitute for actually handling errors where they occur.

**Why you shouldn't resume after `uncaughtException`:** once an exception has escaped its context, the process is in an unknown state — timers, open connections, in-flight I/O may be inconsistent or half-mutated. The Node docs are explicit: the only safe thing to do is log, clean up (close DB connections, flush logs), and exit, letting your process manager (PM2, Kubernetes, systemd) restart a fresh process.

## unhandledRejection vs uncaughtException

| Aspect | `unhandledRejection` | `uncaughtException` |
|---|---|---|
| Triggered by | A promise rejects and no `.catch`/`try-catch` ever handles it | A synchronous throw escapes every enclosing try/catch |
| Is the process guaranteed corrupted? | Less certain — depends on what the rejected operation was doing | Yes, generally — an exception escaped its intended handling context |
| Recommended action | Log, alert, then exit — treat as a bug to fix, not a thing to routinely handle here | Log, clean up (close connections/flush logs), and exit immediately — never resume |

Use both as last-resort observability/safety nets, not as your primary error-handling strategy — by the time either fires, you've already lost the specific context (which request, which user) that a local `try/catch` or centralized Express error middleware would have preserved. The common mistake is treating these handlers as a way to "keep the server alive no matter what" — that just delays a crash while the process runs in an increasingly inconsistent state.

## Important ordering nuance

A synchronous `throw` that happens on the same tick as a pending unhandled rejection will surface as `uncaughtException` first — the throw unwinds the call stack immediately, before the event loop gets a chance to flush the microtask queue where the rejection would otherwise be reported. See the output-based question on this exact ordering for a concrete example.
