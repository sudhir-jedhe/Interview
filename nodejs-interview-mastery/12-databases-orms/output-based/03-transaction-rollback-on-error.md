# Output-Based: Transaction Rollback on Error

```js
async function run(client) {
  await client.query('BEGIN');
  try {
    await client.query("INSERT INTO logs(msg) VALUES ('step 1')");
    throw new Error('something failed mid-transaction');
    await client.query("INSERT INTO logs(msg) VALUES ('step 2')"); // never reached
  } catch (err) {
    await client.query('ROLLBACK');
    console.log('rolled back:', err.message);
  }
}
// after run() completes, query: SELECT COUNT(*) FROM logs
```

**Answer:** `rolled back: something failed mid-transaction`, and `SELECT COUNT(*) FROM logs` returns `0` new rows from this transaction — the "step 1" insert is gone too.

**Why:** `ROLLBACK` undoes every statement issued since `BEGIN`, not just the ones after the error — the whole transaction is atomic, so a partial failure discards all of it, including the successful "step 1" insert. This is exactly the guarantee transactions provide: you never end up with only half the related writes committed.
