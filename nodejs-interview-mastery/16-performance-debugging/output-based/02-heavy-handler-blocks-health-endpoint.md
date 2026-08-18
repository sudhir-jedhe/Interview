# Output-Based: a CPU-bound handler blocks an unrelated trivial route

```js
const app = require('express')();
app.get('/health', (req, res) => res.send('ok'));
app.get('/heavy', (req, res) => {
  let x = 0;
  for (let i = 0; i < 5e9; i++) x += i;
  res.send('done');
});
app.listen(3000);

// Client A requests GET /heavy
// Client B requests GET /health 10ms later
```

**Answer:** Client B's `/health` response does **not** arrive first, even though it requires no real work — it queues behind `/heavy` and only gets a response once the busy loop finishes.

**Why:** Node handles one request at a time on its single JS thread; a synchronous CPU-bound handler occupies that thread completely until it returns. Client B's request is fully received by the OS but its handler can't execute until the event loop is free — there is no preemption between requests within a single Node process.
