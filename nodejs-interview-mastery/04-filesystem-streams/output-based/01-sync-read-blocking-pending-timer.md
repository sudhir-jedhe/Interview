# Sync Read Blocking a Pending Timer

```js
const fs = require('node:fs');

console.log('start');
setTimeout(() => console.log('timer'), 0);
const data = fs.readFileSync(__filename, 'utf8'); // blocking, but fast for a small file
console.log('read', data.length, 'bytes');
console.log('end');
```

**Answer:** `start`, `read <N> bytes`, `end`, `timer`

**Why:** `readFileSync` executes entirely synchronously on the main thread — the timer callback, tied to the timers phase, cannot run until the current synchronous script finishes completely, regardless of how small the delay was. Even a "fast" sync read still fully blocks until it returns.
