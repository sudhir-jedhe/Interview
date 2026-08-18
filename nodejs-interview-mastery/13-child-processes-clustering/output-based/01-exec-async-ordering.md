# Output-Based: `exec()` async ordering

```js
const { exec } = require('child_process');
console.log('A');
exec('echo hello', (err, stdout) => {
  console.log('B:', stdout.trim());
});
console.log('C');
```

**Answer:** `A`, `C`, `B: hello`

**Why:** `exec` spawns the shell command asynchronously and returns immediately; the callback only fires once the subprocess exits and its output has been buffered. Synchronous code (`A`, `C`) always runs before the callback, regardless of how fast the external command finishes.
