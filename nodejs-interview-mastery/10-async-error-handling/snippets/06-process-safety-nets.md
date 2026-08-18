# Snippet: Process-Level Safety Nets for Unhandled Rejections and Exceptions

```js
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
  process.exit(1); // fail fast rather than run in a corrupted state
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1); // never attempt to keep serving requests after this
});
```

**Explanation:** These handlers should be registered as early as possible in your entrypoint — before the rest of the app starts — so they're guaranteed to catch anything that slips through local error handling anywhere in the codebase. Both immediately `process.exit(1)` rather than trying to keep the server alive: by the time either fires, the process's internal state (open connections, in-flight I/O, timers) can no longer be trusted, so the only safe action is to log, exit, and let a process manager (PM2, Kubernetes, systemd) start a fresh instance.
