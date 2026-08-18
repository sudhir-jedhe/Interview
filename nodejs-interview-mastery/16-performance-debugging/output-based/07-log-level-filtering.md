# Output-Based: `warn`-level config filters out `info` logs

```js
process.env.LOG_LEVEL = 'warn';
const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL });

logger.info('routine info message');
logger.warn('something worth noting');
logger.error('something broke');
```

**Answer:** Only `something worth noting` and `something broke` are emitted; `routine info message` is suppressed.

**Why:** Structured loggers filter by configured level — `warn` is a higher severity threshold than `info`, so `info`-level calls are silently dropped without ever formatting/writing output (a performance win too, since the log line isn't even serialized). This is exactly the mechanism that lets you run verbose `debug`-level logging locally and quieter `warn`+ logging in production without changing any log call sites.
