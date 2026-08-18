# Databases & ORMs

Talking to a database from Node.js means understanding connection pooling (never opening a fresh connection per request), choosing between a raw driver and an ORM/ODM (Mongoose, Sequelize, Prisma), and being aware of the failure modes ORMs are prone to hiding — most notoriously the N+1 query problem. This topic also covers transactions (why they exist and the basic begin/commit/rollback pattern), how to handle connection errors and retries gracefully instead of crashing, and structuring configuration so the same codebase can point at different databases per environment. Expect interview questions here to probe whether you understand what an ORM is actually doing under the hood, not just how to call its API.

## Folder structure

```
12-databases-orms/
  theory/          Core concepts, one focused file per topic
  snippets/         Standalone, runnable code snippets with explanations
  output-based/     "What does this code print/return?" questions with answers
  scenarios/         Real-world problem scenarios with worked approaches
  interview-qa/     Themed Q&A pairs for verbal interview prep
  problems/          Practice problems with full worked solutions
  assets/            Images/PDFs from original notes (placeholder)
```

## theory/
1. `01-connection-pooling.md` — Why pooling matters, connection-per-request vs pooling, retry-with-backoff
2. `02-orm-odm-vs-raw-driver.md` — ORM/ODM concept, raw driver trade-offs, Mongoose vs Sequelize vs Prisma
3. `03-n-plus-one-problem.md` — The N+1 anti-pattern and eager-loading fixes
4. `04-transactions.md` — BEGIN/COMMIT/ROLLBACK, row locking with `FOR UPDATE`
5. `05-configuration-and-environments.md` — Environment-based config, migrations vs auto-sync
6. `06-atomicity-and-race-conditions.md` — Read-then-write races, atomic updates, retry-loop pitfalls

## snippets/
Seven standalone code snippets: a `pg` connection pool, a Mongoose schema with a singleton connection, fixing N+1 with Sequelize eager loading, a raw `pg` transaction, a Prisma transaction, connection retry with backoff, and environment-based DB config.

## output-based/
Seven "what does this print?" questions covering a pool created per request, N+1 hidden in a loop, transaction rollback scope, a Mongoose concurrent-write race condition, eager-load query counts, a retry loop that silently gives up, and Prisma's singleton connection reuse via `require` caching.

## scenarios/
Five real-world scenarios with worked approaches: fixing N+1-driven API slowness, running three related writes atomically, recovering from connection-pool exhaustion under a traffic spike, migrating to a new ORM with zero downtime, and fixing an overselling race condition with atomic conditional updates.

## interview-qa/
Ten Q&A pairs grouped into three themed files: pooling/ORM fundamentals, N+1 queries & transactions, and operational concerns (connection failures, config, migrations).

## problems/
Three practice problems with full worked solutions: a raw SQL JOIN vs the N+1 anti-pattern and its ORM eager-loading fix shown side by side, a minimal in-memory connection-pool simulator with acquire/release and a waiting queue, and a transaction wrapper that rolls back on any step failing (simulated with an array of async "queries").

> No `projects/` folder for this topic — see the task scope in the parent README for which topics include a full project.
