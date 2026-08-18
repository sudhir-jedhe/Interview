# Interview Q&A: N+1 Queries and Transactions

**Q: What is the N+1 query problem, and how do ORMs make it easy to introduce by accident?**
It's fetching a list of N parent records and then lazily fetching related data for each one individually, resulting in 1 + N queries instead of a single joined query. ORMs make it easy to write unintentionally because accessing a lazy association looks like a harmless property access or a simple `for` loop — there's no visual cue that each iteration fires a network round-trip to the database, unlike raw SQL where you'd see the extra queries explicitly. The fix is eager loading (`include` in Sequelize/Prisma, `.populate()` in Mongoose), which folds the related-data fetch into the original query or one batched follow-up query.

**Q: Why do transactions matter, and what's the basic pattern for using one?**
A transaction groups multiple writes into a single all-or-nothing unit — essential whenever an operation must update more than one row/document atomically, like debiting one account and crediting another. The basic pattern is `BEGIN`, issue your writes, then `COMMIT` if everything succeeded or `ROLLBACK` if anything failed, wrapped in a `try/catch/finally` that always releases the connection back to the pool regardless of outcome.

```js
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [100, fromId]);
  await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [100, toId]);
  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
} finally {
  client.release();
}
```

**Q: What happens if an error is thrown partway through a transaction and you roll back — does the earlier successful statement in that transaction get kept?**
No — `ROLLBACK` undoes every statement issued since `BEGIN`, not just the ones after the failure point. That's the entire point of atomicity: a transaction either commits in full or leaves the database exactly as it was before it started, so you never end up with only some of a set of related writes persisted.

**Q: How would you fix a "lost update" race condition where two concurrent requests read the same value, then both write back a stale increment?**
Don't read-then-write in application code when the write is a simple delta — push the operation into the database as a single atomic statement instead, e.g. `UPDATE counters SET value = value + 1 WHERE id = $1` (or MongoDB's `$inc` operator), which the database executes atomically without an application-level read step to race on. If the logic is too complex for a single atomic statement, use a row lock (`SELECT ... FOR UPDATE`) inside a transaction so concurrent transactions serialize on that row instead of both operating on a stale read.
