# setImmediate vs setTimeout Ordering Inside an I/O Callback

Unlike at the top level, the relative order of `setImmediate` and `setTimeout(fn, 0)` becomes deterministic once you're already inside an I/O callback (the poll phase), because the loop always proceeds from poll straight to check before looping back to timers.

```js
const fs = require('fs');
fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate')); // fires first here
});
```

**Output:** `immediate`, then `timeout` — every time, deterministically.

Because `fs.readFile`'s callback runs during the **poll** phase, and the loop always visits **check** (where `setImmediate` callbacks live) immediately after poll in the same iteration, `immediate` is guaranteed to run before the loop cycles back around to the **timers** phase for the `setTimeout` callback. This is the one case where `setImmediate` vs `setTimeout(fn, 0)` ordering is not a coin flip. See `../theory/02-event-loop-phases.md` for the full phase list.
