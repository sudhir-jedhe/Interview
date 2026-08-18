# Scenario: mode-prefixed logger via bind's partial application

**Prompt:** You need to implement a family of logging functions: a function that pre-fills a "mode" argument and locks `this` to a specific logger object, while still letting the caller supply the rest of the arguments each time. Show how `bind`'s partial-application behavior solves this cleanly.

**Approach:**

```js
const logger = {
  prefix: '[APP]',
  write(mode, message) {
    console.log(`${this.prefix} [${mode.toUpperCase()}] ${message}`);
  }
};

const logError = logger.write.bind(logger, 'error'); // locks `this` AND pre-fills mode='error'
const logInfo = logger.write.bind(logger, 'info');

logError('Failed to connect'); // '[APP] [ERROR] Failed to connect'
logInfo('Server started');     // '[APP] [INFO] Server started'
```

This is `bind`'s two responsibilities working together in one call: locking `this` to `logger` (so `this.prefix` always resolves correctly no matter where `logError`/`logInfo` end up being called from) and pre-filling the leading `mode` argument, leaving the message as the only argument the caller needs to supply at call time. This pattern is a clean way to derive several specialized functions from one general-purpose method without writing separate wrapper functions by hand.
