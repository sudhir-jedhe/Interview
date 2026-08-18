# Output-Based: `spawn()` non-blocking parent code

```js
const { spawn } = require('child_process');
const child = spawn('node', ['-e', 'console.log("child")']);
console.log('parent start');
child.on('close', () => console.log('child closed'));
console.log('parent end');
```

**Answer:** `parent start`, `parent end`, `child` (order between `child` and `child closed` depends on timing but `child` printed by the subprocess arrives via the stdout stream before `close` fires), `child closed`

**Why:** `spawn` is non-blocking — the parent's synchronous code finishes before any child event fires. The child process runs concurrently in its own OS process; its `close` event only fires after the process has fully exited, which is always after its own internal `console.log` has already executed.
