# Scenario: A Background Job Crashes the Entire Process When One Item Fails

You process a queue of 10,000 records nightly with `Promise.all`. One malformed record causes the whole batch job to die instantly, leaving the rest unprocessed and no record of which one failed.

**Approach:**
`Promise.all` rejects (and stops) as soon as *any* promise in the array rejects, discarding information about the rest. Switch to `Promise.allSettled` so each item's outcome is captured independently, and wrap per-item logic so failures are isolated and logged with enough context to retry just the failed items.

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
Also make sure the top-level job runner itself has a `try/catch` and a process-level `unhandledRejection` handler as a final safety net, in case a bug still slips through.
