# Scenario: The Process Crashes in Production with No Application-Level Error Log

You suspect an uncaught exception is bypassing all your logging, but you have no visibility into what's happening before the crash — production just shows a bare stack trace in stdout.

**Approach:**
Install process-level handlers early (at the very top of your entrypoint, before anything else runs) that log full context via your structured logger before exiting, and configure a process manager to restart cleanly. This won't prevent the crash, but it stops you from losing visibility into it.

```js
// entrypoint.js — first thing that runs
const logger = require('./logger');

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'uncaughtException — shutting down');
  // give the logger a tick to flush before exiting
  setTimeout(() => process.exit(1), 100);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason, promise }, 'unhandledRejection');
  process.exit(1);
});

require('./app'); // start the actual server after handlers are registered
```
Pair this with a process manager (PM2, systemd, or a Kubernetes restart policy) so the process comes back up automatically, and use the newly-visible stack traces to find and fix the actual missing try/catch or unguarded `await` causing the crash — the handlers are a safety net for visibility and clean shutdown, not a fix.
