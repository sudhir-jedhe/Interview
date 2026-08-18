# Transactions

A transaction groups multiple writes into a single all-or-nothing unit — critical whenever an operation must update more than one row/document atomically (e.g. transferring money between two accounts: debit one, credit the other — either both happen or neither does).

```js
// raw pg
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
  client.release(); // always return the connection to the pool
}
```
```js
// Prisma — interactive transaction
await prisma.$transaction(async (tx) => {
  await tx.account.update({ where: { id: fromId }, data: { balance: { decrement: 100 } } });
  await tx.account.update({ where: { id: toId }, data: { balance: { increment: 100 } } });
});
```
If any statement inside throws, Prisma automatically rolls back the whole transaction.

## Rollback undoes everything since BEGIN, not just the failing statement

`ROLLBACK` undoes every statement issued since `BEGIN` — not just the ones after the point of failure. If step 1 of a 3-step transaction succeeds and step 2 throws, rolling back discards step 1's write too. This is the entire point of atomicity: you never end up with only some of a set of related writes persisted.

## Row locking for read-then-write races

A transaction alone doesn't prevent a lost-update race if two concurrent transactions both read the same row before either writes. `SELECT ... FOR UPDATE` locks the row for the duration of the transaction, forcing a second concurrent transaction targeting the same row to wait:

```js
await client.query('BEGIN');
const { rows } = await client.query('SELECT balance FROM accounts WHERE id = $1 FOR UPDATE', [fromId]);
if (rows[0].balance < amount) throw new Error('Insufficient funds');
await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, fromId]);
await client.query('COMMIT');
```
For simple deltas (increment/decrement), an atomic single-statement update (`balance = balance - $1`) is often simpler and avoids the lock entirely — see the N+1/race-condition scenarios for a worked comparison.
