# Connection Pooling

Opening a TCP connection to a database is expensive — TCP handshake, TLS negotiation, database-side authentication — typically tens of milliseconds. Doing this per-request would tank throughput and can exhaust the database's max-connection limit under load. Instead, you create a **pool** of reusable connections once at startup; each query borrows a connection, uses it, and returns it to the pool.

```js
const { Pool } = require('pg');

// created ONCE at module load — not inside a request handler
const pool = new Pool({
  host: process.env.DB_HOST,
  max: 20,              // max concurrent connections in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

app.get('/users/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
  res.json({ data: rows[0] });
});
```
A common interview trap: instantiating `new Pool()` or `mongoose.connect()` *inside* a route handler — that either silently reuses a global connection accidentally (if using a singleton library like Mongoose) or, worse, creates a brand-new pool per request, leaking connections until the DB refuses new ones.

## Connection-per-request vs connection pooling

| Aspect | New connection per request | Connection pooling |
|---|---|---|
| Latency per request | High — pays the TCP handshake + TLS + DB auth cost every single time | Low — borrows an already-established connection from the pool |
| Behavior under load | Connection count grows unbounded with concurrent requests, quickly hitting the database's max-connections limit | Bounded — the pool caps concurrent connections; excess requests wait briefly for one to free up |
| Resource usage on the DB server | Each connection consumes DB-side memory/file descriptors even when idle; churn adds overhead | Stable, predictable resource footprint — connections are reused, not constantly opened/closed |

Always use a pool created once at application startup. The common mistake is instantiating the pool/client inside a request handler "because that's where I needed it" — with `pg.Pool` this creates a new pool (and therefore new connections) on every request, and even with a singleton-style client like Mongoose, calling `.connect()` repeatedly wastes cycles and can trigger confusing "already connected" warnings or race conditions during startup.

## Connection error handling and retries

Databases restart, networks blip, connection pools exhaust — your app needs to fail gracefully rather than crash or hang.

```js
pool.on('error', (err) => {
  console.error('Unexpected pool error', err); // idle client errors — log, don't crash
});

async function connectWithRetry(attempt = 1) {
  try {
    await pool.query('SELECT 1');
    console.log('DB connected');
  } catch (err) {
    if (attempt > 5) throw err;
    const delay = 1000 * 2 ** attempt;
    console.warn(`DB connection failed, retrying in ${delay}ms`);
    await new Promise((r) => setTimeout(r, delay));
    return connectWithRetry(attempt + 1);
  }
}
```
