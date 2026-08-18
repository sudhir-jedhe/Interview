# Scenario: A CLI tool your team built needs to accept both flags and a config file, with flags overriding the file

You're building an internal CLI (`mytool --env production --verbose`) that should also read a `mytool.config.json` for defaults, with command-line flags taking precedence over the file.

**Approach:** Establish a clear precedence order — CLI args > environment variables > config file > hardcoded defaults — and merge them explicitly rather than letting later code silently clobber earlier settings:

```js
const fs = require('fs');
const path = require('path');

function loadConfig() {
  const defaults = { env: 'development', verbose: false };

  let fileConfig = {};
  const configPath = path.join(process.cwd(), 'mytool.config.json');
  if (fs.existsSync(configPath)) {
    fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }

  const args = process.argv.slice(2);
  const cliConfig = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--env') cliConfig.env = args[++i];
    if (args[i] === '--verbose') cliConfig.verbose = true;
  }

  return { ...defaults, ...fileConfig, ...cliConfig }; // later spreads win
}

console.log(loadConfig());
```

This precedence order matches how most real CLI tools behave and avoids surprising users who expect an explicit flag to always win over a config file default.
