# Snippet: PostgreSQL Connection Pool Created Once, Reused Across All Requests

```js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
});

async function getUserById(id) {
  const { rows } = await pool.query('SELECT id, email FROM users WHERE id = $1', [id]);
  return rows[0] || null;
}

module.exports = { pool, getUserById };
```

**Explanation:** The `Pool` is constructed once at module load — because Node caches `require()`d modules, every file that imports this module gets the exact same `pool` instance, so connections are genuinely shared across the whole app rather than duplicated per route. `pool.query(...)` transparently borrows a connection, runs the parameterized query (`$1` prevents SQL injection), and returns the connection to the pool automatically when the query resolves.
