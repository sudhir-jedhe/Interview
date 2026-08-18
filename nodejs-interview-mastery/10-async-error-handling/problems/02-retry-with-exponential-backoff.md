# Problem: Implement a Retry-with-Exponential-Backoff Utility for Flaky Async Operations

## Problem statement

Write a reusable `retryWithBackoff` utility that retries a flaky async operation (a network call, a database query against a database that occasionally blips) a bounded number of times, waiting exponentially longer between each attempt, with jitter to avoid a "thundering herd" of retries all firing at the same instant.

## Requirements

- Configurable max retries, base delay, max delay cap, and jitter
- Rethrows the *last* error if all retries are exhausted (never silently resolve with `undefined`)
- Optionally accepts an `isRetryable(err)` predicate so non-retryable errors (e.g. a `400 Bad Request`) fail immediately instead of wasting retry attempts
- Works with any zero-argument async function

## Worked solution

```js
// utils/retryWithBackoff.js

/**
 * Retries an async operation with exponential backoff and jitter.
 * @param {() => Promise<any>} fn - the operation to retry
 * @param {object} [options]
 * @param {number} [options.retries=5] - max retry attempts (not counting the first try)
 * @param {number} [options.baseDelayMs=200] - base delay before the first retry
 * @param {number} [options.maxDelayMs=10000] - cap on the delay between attempts
 * @param {(err: Error) => boolean} [options.isRetryable] - decide whether to retry a given error
 */
async function retryWithBackoff(fn, {
  retries = 5,
  baseDelayMs = 200,
  maxDelayMs = 10000,
  isRetryable = () => true,
} = {}) {
  let attempt = 0;
  let lastError;

  while (attempt <= retries) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      if (!isRetryable(err) || attempt === retries) {
        throw err; // exhausted retries, or the error is explicitly non-retryable — fail loudly
      }

      const exponential = baseDelayMs * 2 ** attempt;
      const capped = Math.min(exponential, maxDelayMs);
      const jitter = Math.random() * capped * 0.5; // up to 50% jitter
      const delay = capped / 2 + jitter; // avoid full-zero and full-cap clustering

      console.warn(`Attempt ${attempt + 1} failed: ${err.message}. Retrying in ~${Math.round(delay)}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      attempt++;
    }
  }

  throw lastError; // unreachable in practice, but keeps the function's contract explicit
}

module.exports = retryWithBackoff;
```

```js
// usage: retry a flaky HTTP call, but don't waste retries on a 4xx client error
const retryWithBackoff = require('./utils/retryWithBackoff');

async function fetchExchangeRate() {
  const res = await fetch('https://flaky-fx-api.example.com/rate');
  if (!res.ok) {
    const err = new Error(`FX API returned ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

async function getRateWithRetry() {
  return retryWithBackoff(fetchExchangeRate, {
    retries: 4,
    baseDelayMs: 300,
    isRetryable: (err) => !err.status || err.status >= 500, // retry network errors and 5xx, not 4xx
  });
}
```

**Why jitter matters:** if many concurrent requests all fail at the same moment (e.g. a downstream service briefly restarts) and all retry with the exact same deterministic backoff schedule, they'll all hit the recovering service again at the same instant, potentially knocking it back down. Adding randomness to each delay spreads retries out over time instead of synchronizing them.
