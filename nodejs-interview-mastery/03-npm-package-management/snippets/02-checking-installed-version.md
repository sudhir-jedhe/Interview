# Checking the Installed Version of a Dependency at Runtime

```js
const { version } = require('express/package.json');
console.log(`express resolved to version ${version}`);
```

Every installed package ships its own `package.json`, and `require()` can load JSON files directly (Node parses `.json` extensions automatically) — so `require('express/package.json')` gives you the *actual installed* version, not the range declared in your own `package.json`. This is useful for runtime diagnostics/logging (e.g., printing dependency versions in a `/health` or `/version` endpoint) or for feature-detecting behavior that changed between major versions of a dependency.
