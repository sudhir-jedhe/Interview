**You're calling a rate-limited third-party API that allows only 1 request at a time (no concurrent requests), and you have an array of 50 IDs to fetch data for. A naive `Promise.all(ids.map(fetchItem))` would fire 50 requests simultaneously and get you rate-limited. How do you process them safely?**

**Approach:**
Process sequentially with `await` inside a loop (deliberately, this time — sequential awaiting is not always a bug, it's a bug specifically when concurrency was intended but a loop accidentally serializes it):

```js
async function fetchAllSequential(ids) {
  const results = [];
  for (const id of ids) {
    const item = await fetchItem(id); // one at a time, respects rate limit
    results.push(item);
  }
  return results;
}
```
If the API allows a small concurrency window (say, 5 at a time) rather than strictly 1, a simple worker-pool pattern is better than pure sequential or pure `Promise.all`:

```js
async function fetchWithConcurrency(ids, limit) {
  const results = new Array(ids.length);
  let index = 0;
  async function worker() {
    while (index < ids.length) {
      const current = index++;
      results[current] = await fetchItem(ids[current]);
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}
```
This caps concurrency at `limit` workers pulling from a shared index, giving you controlled parallelism instead of all-50-at-once or fully sequential. (This exact pattern, generalized into a reusable queue, is built out fully in `projects/async-task-queue/`.)
