# Scenario: Migrating to a New ORM Without Downtime on a Live Production Database

The team is moving from raw `mysql2` queries to Prisma, but the app can't have a maintenance window — traffic must keep flowing throughout the migration.

**Approach:**
Migrate incrementally, route by route, rather than a big-bang rewrite. Introduce Prisma alongside the existing raw-query code, point it at the *same* database and schema (using `prisma db pull` to introspect the existing tables rather than generating new ones), and convert one route/module at a time behind the existing tests, verifying query-for-query parity before removing the old code path.

```js
// Step 1: introspect the existing database into a Prisma schema (no schema changes yet)
// npx prisma db pull

// Step 2: run both data-access layers side by side during the transition
const prisma = require('./db/prisma');       // new
const { pool } = require('./db/mysql-raw');  // old, still used by unmigrated routes

// Step 3: migrate one route at a time
app.get('/users/:id', async (req, res) => {
  // OLD: const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
  const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } }); // NEW
  if (!user) return res.status(404).json({ error: { message: 'User not found' } });
  res.json({ data: user });
});
```
Keep both connection pools alive simultaneously during the transition (mind the combined connection count against the DB's limit), add integration tests that assert both code paths return identical results for a sample of real queries, and only remove the raw `mysql2` pool once every route has been migrated and verified in production for a full traffic cycle.
