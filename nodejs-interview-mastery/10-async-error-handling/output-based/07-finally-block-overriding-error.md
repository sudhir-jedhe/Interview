# Output-Based: finally Block and Re-Thrown Errors

```js
async function run() {
  try {
    throw new Error('first');
  } finally {
    console.log('cleanup');
    throw new Error('second'); // overrides the original error
  }
}

run().catch((err) => console.log('caught:', err.message));
```

**Answer:** `cleanup`, then `caught: second`.

**Why:** The `finally` block always runs before the function's promise settles, but if `finally` itself throws, that new error **replaces** the original one — the original `'first'` error is silently discarded. This is a common real-world bug in cleanup code (e.g. closing a DB connection in `finally`) that accidentally masks the actual error that caused the failure.
