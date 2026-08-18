# Scenario: Log volume is expensive and unstructured `console.log` calls make incidents hard to debug

Your team's app logs with scattered `console.log('user logged in', userId)` calls everywhere. During an incident, grepping raw text logs across services to correlate a single request is slow and error-prone, and your log aggregator's bill has grown because every log line — regardless of importance — is captured at full volume.

**Approach:** Replace ad hoc `console.log` with a structured JSON logger that supports levels, so verbosity can be dialed per environment without touching code, and so downstream tooling can filter/query by field instead of parsing free text:

```js
const pino = require('pino');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info', // 'debug' locally, 'warn' in prod to control volume
  base: { service: 'orders-api' },
});

// Attach a request ID so every log line for one request can be correlated
app.use((req, res, next) => {
  req.log = logger.child({ requestId: req.headers['x-request-id'] || crypto.randomUUID() });
  next();
});

app.post('/login', (req, res) => {
  req.log.info({ userId: req.body.userId }, 'user logged in');
  res.json({ ok: true });
});

app.use((err, req, res, next) => {
  req.log.error({ err }, 'unhandled request error');
  res.status(500).json({ error: 'internal error' });
});
```

This gets you three wins at once: structured JSON that log aggregators can index and query by field (`requestId`, `userId`, `level`) instead of regex-grepping text; level-based filtering so `debug` noise never even gets serialized in production (`warn`+ only), directly cutting log volume and cost; and consistent per-request correlation via a child logger carrying `requestId` on every line it emits.
