# process.nextTick Recursion Can Starve I/O — Avoid Unbounded Recursion

Because the `nextTick` queue must be fully drained — including entries added *during* its own draining — before the loop can proceed to any phase, a long or unbounded chain of recursive `nextTick` calls delays everything else, including timers.

```js
let count = 0;
function recurse() {
  if (count++ < 5) process.nextTick(recurse);
  else console.log('done recursing, nextTick queue now empty');
}
setTimeout(() => console.log('this timer waits for nextTick queue to drain'), 0);
recurse();
```

**Output:** `done recursing, nextTick queue now empty`, then `this timer waits for nextTick queue to drain`.

Even though the `setTimeout` was scheduled first, its callback can't run until the timers phase, and the timers phase can't start until the entire `nextTick` queue — including all five recursive calls — has fully drained. With a bounded count like 5 this resolves almost instantly and is harmless; the danger is when the recursion has no reliable terminating condition (e.g. polling for a condition that might never become true), which can starve the event loop of I/O indefinitely. See `../theory/03-microtasks-nexttick-promises.md` and `../scenarios/03-nexttick-polling-starves-connections.md` for the production incident this pattern causes.
