**Your app has a "search as you type" feature that calls an API on every keystroke. Fast typers trigger overlapping requests, and slow network responses can arrive out of order, sometimes showing stale results after newer ones. How do you use promise/async patterns to guarantee only the latest request's result is ever displayed?**

**Approach:**
Track a request "generation" counter (or the promise itself) and discard any response that isn't the most recent one:

```js
let latestRequestId = 0;

async function search(query) {
  const requestId = ++latestRequestId;
  const results = await fetchSearchResults(query);
  if (requestId !== latestRequestId) {
    return; // a newer search has started since this one began — discard
  }
  renderResults(results);
}
```
This is more robust than relying on `Promise.race` (which would still show a fast-but-stale result if it happens to win the race against a slower newer one) — the counter check explicitly ties correctness to "is this still the most recent request," not "which one finished first." An alternative using `AbortController` additionally cancels the in-flight network request itself (saving bandwidth) rather than just ignoring its eventual result:

```js
let controller;
async function search(query) {
  controller?.abort();
  controller = new AbortController();
  try {
    const results = await fetchSearchResults(query, { signal: controller.signal });
    renderResults(results);
  } catch (err) {
    if (err.name !== 'AbortError') throw err;
  }
}
```
