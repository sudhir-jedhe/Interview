# Problem: Implement a Naive Promise.all() Using Only Callbacks

## Problem statement

Implement `callbackAll(tasks, done)` — a function that behaves like `Promise.all()`, but takes an array of Node-style callback-based async functions (each shaped `(cb) => void` where `cb` is `(err, result) => void`) instead of Promises, and does not use any native Promise combinator (`Promise.all`, `Promise.allSettled`, etc.) internally. You may use plain Promises/async-await for your *own* call site convenience, but the combinator logic itself must be hand-rolled with callbacks and counters.

## Requirements

- `callbackAll(tasks, done)` runs every task concurrently (not serially — don't `await` them one at a time).
- `done(err, results)` is called once: either with the first error encountered (short-circuiting further error reporting, mirroring `Promise.all` rejecting on first failure), or with an array of all results in the **same order as the input tasks** (not completion order).
- If `tasks` is an empty array, `done(null, [])` should be called (mirroring `Promise.all([])` resolving immediately).
- Must handle the case where a task's callback is invoked synchronously (before `callbackAll` even returns) as well as asynchronously.

## Solution

```js
function callbackAll(tasks, done) {
  if (tasks.length === 0) {
    return done(null, []);
  }

  const results = new Array(tasks.length);
  let completed = 0;
  let settled = false; // guards against calling done() more than once after an error

  tasks.forEach((task, index) => {
    task((err, result) => {
      if (settled) return; // ignore late callbacks after we've already errored out

      if (err) {
        settled = true;
        return done(err);
      }

      results[index] = result;
      completed++;

      if (completed === tasks.length) {
        settled = true;
        done(null, results);
      }
    });
  });
}

// --- usage example ---

function fetchUser(id) {
  return (cb) => {
    setTimeout(() => {
      if (id === 3) return cb(new Error(`user ${id} not found`));
      cb(null, { id, name: `user-${id}` });
    }, Math.random() * 100);
  };
}

callbackAll([fetchUser(1), fetchUser(2), fetchUser(4)], (err, results) => {
  if (err) return console.error('failed:', err.message);
  console.log('all users:', results); // order matches input, not completion order
});

callbackAll([fetchUser(1), fetchUser(3), fetchUser(4)], (err) => {
  console.log('expected error:', err.message); // 'user 3 not found'
});
```

**Key design points:**

- **Concurrency, not serialization:** all tasks are started in the same synchronous `forEach` pass, so they run concurrently (limited only by whatever I/O/thread-pool concurrency the underlying tasks use) rather than one-at-a-time.
- **Order preservation:** results are written to `results[index]` using each task's original index, not push order, so the final array matches input order regardless of which task finishes first — the same guarantee `Promise.all` provides.
- **Single-callback guarantee:** the `settled` flag ensures `done` is called exactly once, even if multiple tasks error out concurrently or a task's callback fires more than once (a common bug in poorly-written Node APIs).
- **Empty array edge case:** handled explicitly upfront, since the `completed === tasks.length` check would otherwise never fire (0 === 0 is technically true, but there'd be no callbacks to trigger the check in the first place).
- **Sync-callback safety:** because `results`/`completed`/`settled` are set up *before* the `forEach` loop starts invoking tasks, a task that calls its callback synchronously (before `callbackAll` returns) is handled identically to one that calls back asynchronously later.
