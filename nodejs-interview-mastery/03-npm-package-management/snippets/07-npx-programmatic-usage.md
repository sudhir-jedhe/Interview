# Using npx Programmatically via child_process to Run a One-Off Tool

```js
const { execSync } = require('node:child_process');
const output = execSync('npx --yes cowsay "hello ci"', { encoding: 'utf8' });
console.log(output);
```

`npx` isn't limited to interactive terminal use — it's a regular CLI command, so it can be shelled out to from a Node script via `child_process.execSync` (or the async `exec`/`spawn` variants for non-blocking use). The `--yes` flag skips the interactive "ok to install this package?" confirmation prompt, which is required for any unattended/scripted context like a CI job — without it, `execSync` would hang waiting for input that will never come. See `../theory/05-scripts-npx-and-install-scope.md` for when `npx` is the right tool versus a proper `devDependency`.
