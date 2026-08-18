# Atomicity and Race Conditions in Concurrent Writes

A read-then-write sequence in application code (read a value, compute a new value, write it back) is not atomic — two concurrent requests can both read the same starting value before either writes, silently losing one of the updates.

```js
// UNSAFE: read-then-write race — concurrent calls can both read the same starting value
async function incrementBadly(Counter) {
  const doc = await Counter.findOne();
  doc.value = doc.value + 1;
  await doc.save();
}

await Promise.all([incrementBadly(Counter), incrementBadly(Counter), incrementBadly(Counter)]);
// starting value 0 -> may end up at 1 instead of the expected 3
```

## The fix: push the operation into the database as one atomic statement

```js
// SAFE: MongoDB executes $inc atomically server-side — no read-then-write window at all
await Counter.updateOne({}, { $inc: { value: 1 } });

// SAFE: SQL equivalent — the UPDATE's WHERE clause is evaluated atomically against the current row
await pool.query(
  'UPDATE flights SET seats_available = seats_available - 1 WHERE id = $1 AND seats_available > 0',
  [flightId]
);
```
This has nothing to do with connection pooling (which can be perfectly fine while this bug exists) and everything to do with the operation not being atomic — the database, not application code, needs to own the read-modify-write step whenever concurrent writers might target the same row.

## When a single atomic statement isn't expressive enough

For logic too complex to express as one `UPDATE`, use `SELECT ... FOR UPDATE` inside an explicit transaction to lock the row for the duration of the read-modify-write sequence, forcing concurrent transactions targeting the same row to wait rather than racing.

## A retry helper that silently swallows failure is its own bug

A connection-retry (or any retry) loop that reaches its max attempts and simply returns instead of rethrowing makes the caller believe the operation succeeded, since the returned promise resolves with `undefined` rather than rejecting — always rethrow (or throw a wrapping error) once retries are exhausted.
