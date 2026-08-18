# Snippet: Structured logging with levels (pino) instead of `console.log`

```js
const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

logger.debug('this is filtered out at "info" level');
logger.info({ requestId: 'abc-123' }, 'handled request');
logger.error({ err: new Error('boom') }, 'unexpected failure');
```

**Explanation:** `pino`'s log level filters output at the configured threshold — with `level: 'info'`, the `debug` call is dropped entirely without even being serialized, while `info` and `error` calls emit structured JSON with the extra context object merged in. Setting `LOG_LEVEL` via environment variable lets you run verbose `debug` logging locally and quieter `warn`+ logging in production without touching any call site.
