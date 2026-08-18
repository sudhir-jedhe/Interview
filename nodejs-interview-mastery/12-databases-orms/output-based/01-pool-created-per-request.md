# Output-Based: Pool Created Per Request

```js
const { Pool } = require('pg');

app.get('/users', async (req, res) => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 10 });
  const { rows } = await pool.query('SELECT * FROM users');
  res.json({ data: rows });
});

// 50 concurrent requests hit this endpoint
```

**Answer:** Under load, requests start failing with connection errors like `too many clients already`, or the app hangs as it exhausts the database's max connection limit — even though each individual `Pool` is capped at `max: 10`.

**Why:** A new `Pool` is instantiated on every request instead of once at module load, so 50 concurrent requests create up to 50 separate pools, each trying to open up to 10 connections — potentially 500 connection attempts against a database that typically allows only ~100. The pool must be created once, outside the request handler, and reused.
