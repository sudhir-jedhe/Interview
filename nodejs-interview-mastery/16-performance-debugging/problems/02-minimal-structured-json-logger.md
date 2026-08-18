# Problem: A Minimal Structured JSON Logger

## Problem statement

Implement a small structured logger (without using `pino`/`winston`) that emits one JSON object per log line, containing at minimum `level`, `timestamp`, `message`, and any extra metadata, and supports level-based filtering configured at construction time.

## Requirements

- Support standard levels: `debug`, `info`, `warn`, `error`, in increasing severity order.
- The logger should be constructed with a minimum level (e.g. `warn`); calls below that level are complete no-ops — they should not even serialize their arguments, matching real structured loggers' performance behavior.
- Each log call accepts a message string and an optional metadata object: `logger.info('user logged in', { userId: 42 })`.
- Output must be a single line of valid JSON per call (so log aggregators can parse it line-by-line), with a consistent field order: `level`, `timestamp` (ISO 8601), `message`, then metadata fields spread in.
- Provide a `child(bindings)` method that returns a new logger which automatically includes the given metadata (e.g. a `requestId`) on every call, without the caller needing to repeat it.

## Solution

```js
// logger.js
const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };

class Logger {
  constructor({ level = 'info', bindings = {} } = {}) {
    if (!(level in LEVELS)) throw new Error(`Unknown log level: ${level}`);
    this.minLevel = LEVELS[level];
    this.bindings = bindings;
  }

  _log(level, message, meta = {}) {
    if (LEVELS[level] < this.minLevel) return; // filtered out — no serialization cost

    const entry = {
      level,
      timestamp: new Date().toISOString(),
      message,
      ...this.bindings,
      ...meta,
    };

    process.stdout.write(JSON.stringify(entry) + '\n');
  }

  debug(message, meta) { this._log('debug', message, meta); }
  info(message, meta) { this._log('info', message, meta); }
  warn(message, meta) { this._log('warn', message, meta); }
  error(message, meta) { this._log('error', message, meta); }

  child(bindings) {
    const merged = { ...this.bindings, ...bindings };
    const child = new Logger({ bindings: merged });
    child.minLevel = this.minLevel; // inherit the parent's configured level
    return child;
  }
}

module.exports = { Logger };
```

```js
// usage
const { Logger } = require('./logger');

const logger = new Logger({ level: process.env.LOG_LEVEL || 'info' });

logger.debug('this is filtered out at "info" level'); // no-op, not even serialized
logger.info('server started', { port: 3000 });
// {"level":"info","timestamp":"2026-08-17T12:00:00.000Z","message":"server started","port":3000}

logger.error('payment failed', { orderId: 'ord_123', reason: 'card_declined' });
// {"level":"error","timestamp":"...","message":"payment failed","orderId":"ord_123","reason":"card_declined"}

// Per-request child logger carrying a requestId on every call
const requestLogger = logger.child({ requestId: 'req-abc-123' });
requestLogger.info('handled request', { statusCode: 200 });
// {"level":"info","timestamp":"...","message":"handled request","requestId":"req-abc-123","statusCode":200}
```

**How it works:** `LEVELS` maps each named level to a numeric severity, so `_log` can cheaply compare `LEVELS[level] < this.minLevel` and bail out immediately for filtered-out calls — critically, this check happens *before* building the `entry` object or calling `JSON.stringify`, so a suppressed `debug` call in a hot path costs almost nothing at runtime, matching how real structured loggers avoid serialization overhead for filtered levels. `child()` returns a new `Logger` whose `bindings` merge the parent's bindings with the new ones, so metadata like a per-request `requestId` gets automatically included on every subsequent call without the caller repeating it at each log site — exactly the pattern used for request-scoped logging in production Express apps.
