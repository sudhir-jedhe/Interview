# Scenario Questions: Asynchronous JavaScript

**You need to fetch data from 3 independent API endpoints to render a dashboard, but the dashboard should still render partially even if one endpoint fails (showing an error state just for that widget). Which combinator do you use, and how do you structure the rendering logic?**

**Approach:**
`Promise.allSettled` is the right tool since it never short-circuits on a single failure and reports every outcome:

```js
async function loadDashboard() {
  const [users, revenue, alerts] = await Promise.allSettled([
    fetchUsers(),
    fetchRevenue(),
    fetchAlerts(),
  ]);

  return {
    users: users.status === 'fulfilled' ? users.value : { error: users.reason },
    revenue: revenue.status === 'fulfilled' ? revenue.value : { error: revenue.reason },
    alerts: alerts.status === 'fulfilled' ? alerts.value : { error: alerts.reason },
  };
}
```
Using `Promise.all` here would be a mistake — a single failing endpoint would reject the whole batch, and even the two successful results would be discarded, leaving the entire dashboard blank instead of degrading gracefully. Each widget checks its own `status` and renders either real data or a per-widget error state.

---

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
This caps concurrency at `limit` workers pulling from a shared index, giving you controlled parallelism instead of all-50-at-once or fully sequential.

---

**You inherited a legacy Node.js module that reads a config file using the old `fs.readFile(path, callback)` API, and it's littered throughout a codebase that has since moved to `async`/`await` everywhere else. How do you promisify it cleanly, and are there built-in shortcuts?**

**Approach:**
Manual promisification wraps the callback API in a `new Promise`:

```js
function readConfig(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
}

async function loadConfig() {
  const config = await readConfig('./config.json');
  return config;
}
```
For the common Node.js convention of `fn(...args, (err, result) => {})`, Node's built-in `util.promisify` avoids writing this boilerplate by hand:

```js
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const data = await readFile('./config.json', 'utf8');
```
`util.promisify` only works cleanly for functions following the standard "error-first callback as last argument, single result value" convention — APIs with multiple callback result arguments or non-standard signatures still need manual wrapping.

---

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
