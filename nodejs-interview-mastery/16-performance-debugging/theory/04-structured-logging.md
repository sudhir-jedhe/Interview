# Performance & Debugging — Structured Logging

## Logging best practices

`console.log` is synchronous when stdout is a file/pipe (common in production, where output is redirected) and offers no structure, levels, or filtering — it doesn't scale past local development. Use a structured logger (`pino`, `winston`) that emits JSON with consistent fields (timestamp, level, message, request ID) so log aggregation tools can index and query it.

```js
const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

logger.info({ userId: 42, action: 'login' }, 'user logged in');
logger.error({ err }, 'payment processing failed');
```

Log levels (`trace`/`debug`/`info`/`warn`/`error`/`fatal`) let you dial verbosity per environment without code changes — verbose in development, `warn`+ in production to control volume and cost.

## `console.log` vs a structured logger (pino/winston) in production

| Aspect | `console.log` | Structured logger (pino) |
|---|---|---|
| Output format | Freeform strings | JSON, consistently shaped, queryable by log aggregators |
| Log levels | None (everything prints) | `debug`/`info`/`warn`/`error`, filterable at runtime |
| Performance | Synchronous when stdout is redirected to a file (common in prod), can itself become a bottleneck under high volume | Designed for high-throughput async writes; skips serialization entirely for filtered-out levels |
| Context (request ID, user ID) | Manual, inconsistent per call site | Structured fields, often auto-attached via child loggers |

Use `console.log` for local scratch debugging; use a structured logger for anything that runs in production, since log aggregation tools (Datadog, CloudWatch, ELK) need structured, filterable output and volume control that raw string logging doesn't provide. The common mistake is leaving verbose `console.log` calls in a hot request path — under load, especially when stdout is piped to a file, this synchronous I/O can itself measurably degrade throughput.
