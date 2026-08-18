# Sequential vs. Parallel `await`

Awaiting inside a `for` loop runs requests **sequentially** — each iteration waits for the previous one to fully finish before starting the next, even when the requests have no dependency on each other:

```js
// SLOW — sequential, ~300ms total if each call takes 100ms
for (const id of ids) {
  const result = await fetchItem(id);
  results.push(result);
}

// FAST — parallel, ~100ms total
const results = await Promise.all(ids.map(id => fetchItem(id)));
```

Use sequential `await` only when each step genuinely depends on the previous step's result (or when rate-limiting is required — see `scenarios/02-rate-limited-api-concurrency-control.md`); otherwise, kick off all the promises first (without awaiting inside the loop) and use `Promise.all` to wait for them together.

## Comparison table

| Aspect | `for` loop with `await` inside | `Promise.all(items.map(async ...))` |
|---|---|---|
| Execution | Strictly sequential — one at a time | All started concurrently |
| Total time | Sum of all individual durations | Roughly the duration of the *slowest* one |
| Use when | Each step depends on the previous step's result, or rate-limiting is required | Steps are independent of each other |
| Error behavior | Stops at the first error (loop halts) | `Promise.all` fails fast; consider `allSettled` if partial failure is fine |

The common and costly mistake is defaulting to a `for...of` loop with `await` inside for a batch of independent async calls (e.g., fetching 20 unrelated URLs) — this makes 20 sequential round trips instead of 1 concurrent batch, needlessly multiplying total latency by 20x in the worst case.

## Timing proof

```js
const delay = (ms, val) => new Promise(res => setTimeout(() => res(val), ms));

async function sequential() {
  console.time('sequential');
  const a = await delay(100, 'a');
  const b = await delay(100, 'b');
  console.timeEnd('sequential'); // ~200ms
}

async function parallel() {
  console.time('parallel');
  const [a, b] = await Promise.all([delay(100, 'a'), delay(100, 'b')]);
  console.timeEnd('parallel'); // ~100ms
}
```
