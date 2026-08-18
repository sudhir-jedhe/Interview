# Scenario: The Connection Pool Is Exhausted Under a Traffic Spike

During a flash sale, `pool.query()` calls start rejecting with connection-acquire timeouts. The pool's `max` is set to 20, and traffic has spiked to far more concurrent requests than that.

**Approach:**
First, confirm nothing is leaking connections — every `pool.connect()` call must have a matching `client.release()`, even on the error path (a `finally` block is the safe pattern). Then size the pool deliberately against the database's actual max-connections limit and the number of app instances (`pool_max * instance_count` must stay under the DB's ceiling), add a bounded queue/timeout so requests fail fast with a clear error instead of hanging indefinitely, and consider a request-level rate limiter upstream so the pool is protected from being overwhelmed in the first place.

```js
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                       // per-instance cap — coordinate with DB's max_connections and instance count
  connectionTimeoutMillis: 3000, // fail fast instead of hanging forever waiting for a free connection
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  console.error('Unexpected idle client error', err); // never let this crash the process silently
});

app.get('/products', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE active = true');
    res.json({ data: rows });
  } catch (err) {
    if (err.message.includes('timeout')) {
      return res.status(503).json({ error: { message: 'Service temporarily overloaded, please retry' } });
    }
    next(err);
  }
});
```
For sustained high-traffic events, consider an external connection pooler (e.g. PgBouncer) in front of Postgres so many app instances can share a much larger effective connection budget without each hitting the database directly, and add autoscaling/backpressure (a queue in front of order processing) rather than only scaling the pool size indefinitely.
