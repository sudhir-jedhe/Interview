# Output-Based: command injection via `exec()`

```js
const userInput = '8.8.8.8; cat /etc/passwd';
const { exec } = require('child_process');
exec(`ping -c 1 ${userInput}`, (err, stdout) => {
  console.log(stdout);
});
```

**Answer:** Ping output for `8.8.8.8`, followed by the contents of `/etc/passwd` printed to `stdout`.

**Why:** `exec` runs the whole string through a shell, and `;` is a shell command separator — the shell happily executes `cat /etc/passwd` as a second, independent command after the ping. This is command injection; using `execFile('ping', ['-c', '1', userInput])` instead would pass the entire string as a single literal argument to `ping`, which would just fail to resolve a bogus hostname rather than executing it as shell syntax.
