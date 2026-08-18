# Snippet: `execFile()` — no shell, safe from injection

```js
const { execFile } = require('child_process');
execFile('node', ['-e', 'console.log(1 + 1)'], (err, stdout) => {
  console.log(stdout.trim()); // "2"
});
```

**Explanation:** `execFile` has the same buffered-callback style as `exec`, but runs the executable directly with an argument array instead of passing a string through a shell. This makes it safe from shell-injection: arguments are never parsed as shell syntax, so metacharacters like `;` or `&&` in an argument are treated as literal data, not command separators.
