# Snippet: `spawn()` — streaming stdout for large/continuous output

```js
const { spawn } = require('child_process');
const proc = spawn('node', ['-e', 'for (let i = 0; i < 3; i++) console.log(i)']);
proc.stdout.on('data', (data) => process.stdout.write(`chunk: ${data}`));
proc.on('close', (code) => console.log(`child exited with code ${code}`));
```

**Explanation:** `spawn` returns a `ChildProcess` whose `stdout`/`stderr` are `Readable` streams, so output is consumed incrementally as it's produced rather than buffered entirely in memory. This makes it the right tool for long-running processes or commands that can emit large volumes of output — memory usage stays flat regardless of how much the child prints.
