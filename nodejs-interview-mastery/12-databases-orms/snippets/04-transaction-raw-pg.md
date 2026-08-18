# Snippet: Database Transaction for a Multi-Step Write That Must Be Atomic (Raw pg)

```js
async function transferFunds(pool, fromId, toId, amount) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query('SELECT balance FROM accounts WHERE id = $1 FOR UPDATE', [fromId]);
    if (rows[0].balance < amount) throw new Error('Insufficient funds');

    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, fromId]);
    await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, toId]);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
```

**Explanation:** `pool.connect()` checks out a single dedicated connection for the entire transaction — using `pool.query()` directly here would be wrong, since each call to `pool.query()` may borrow a *different* connection from the pool, breaking the transaction. `SELECT ... FOR UPDATE` locks the `fromId` row for the duration of the transaction so a concurrent transfer targeting the same account can't read a stale balance. The `try/catch/finally` guarantees `ROLLBACK` runs on any failure and `client.release()` always returns the connection to the pool, even on the error path.
