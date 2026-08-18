# Snippet: `exec()` — buffered output through a shell

```js
const { exec } = require('child_process');
exec('node -v', (err, stdout, stderr) => {
  if (err) return console.error(err);
  console.log('Node version:', stdout.trim());
});
```

**Explanation:** `exec` runs the command through `/bin/sh`, buffers all of stdout/stderr in memory, and delivers everything to the callback once the process exits. Good for quick one-off commands with small, predictable output (like checking a tool's version) — not for large output (default `maxBuffer` is 1MB) or anything involving unsanitized user input, since it goes through a shell.
