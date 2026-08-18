# Output-Based: Prisma Implicit Connection Reuse Across Module Reloads

```js
// db.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // module-level singleton
module.exports = prisma;

// every route requires('./db') and gets the SAME instance
```

**Answer:** All routes share one `PrismaClient` instance and its single internal connection pool — this is correct and intended, not a bug.

**Why:** Because `require()` caches modules, every file that does `require('./db')` receives the exact same `prisma` object rather than creating a new client (and a new connection pool) per import. This is the correct pattern — the common mistake would be calling `new PrismaClient()` inside a route handler or inside a function that runs per-request, which (like the pg `Pool` example above) would spin up redundant connection pools instead of reusing the shared one.
