# Batch Operations and Cleanup Pitfalls

## Promise.all vs Promise.allSettled for batch work

`Promise.all` rejects (and stops) as soon as *any* promise in the array rejects, discarding information about the rest of the batch — fine when you genuinely want all-or-nothing semantics. For background/batch jobs processing many independent items, this is usually the wrong tool: one bad record shouldn't abort processing of everything else.

`Promise.allSettled` waits for every promise to settle and returns an array of `{status, value|reason}` for each item, letting you isolate and log failures without losing the rest of the batch.

```js
async function processRecord(record) {
  try {
    await saveToDatabase(record);
    return { status: 'fulfilled', id: record.id };
  } catch (err) {
    return { status: 'rejected', id: record.id, error: err.message };
  }
}

async function runNightlyJob(records) {
  const results = await Promise.allSettled(records.map(processRecord));

  const failed = results
    .map((r, i) => ({ result: r, record: records[i] }))
    .filter(({ result }) => result.status === 'rejected' || result.value?.status === 'rejected');

  console.log(`Processed ${records.length}, failed: ${failed.length}`);
  if (failed.length) {
    await logFailuresForRetry(failed); // persist so a retry job can pick them up
  }
}
```

## The `finally` block overriding an error

If a `finally` block itself throws, the error it throws **replaces** the error that was already propagating — the original is silently discarded.

```js
async function run() {
  try {
    throw new Error('first');
  } finally {
    console.log('cleanup');
    throw new Error('second'); // overrides the original error
  }
}

run().catch((err) => console.log('caught:', err.message)); // logs: cleanup, then caught: second
```
This is a real-world bug source in cleanup code — e.g. closing a database connection in `finally` — that can accidentally mask the actual root-cause error with an unrelated cleanup failure. If cleanup itself might throw, wrap it in its own try/catch inside `finally` so it can't clobber the original error.

## A retry helper that silently gives up is worse than one that fails loudly

A retry loop that reaches its max attempts and simply `return`s (instead of re-throwing) makes the caller believe the operation succeeded, since the returned promise resolves with `undefined` rather than rejecting. Always rethrow (or throw a wrapping error) once retries are exhausted — see the retry-with-backoff utility in `problems/` for the correct pattern.
