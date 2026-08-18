# Reading and Validating package.json Dependency Fields Programmatically

```js
const fs = require('node:fs');
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
console.log('runtime deps:', Object.keys(pkg.dependencies || {}));
console.log('dev-only deps:', Object.keys(pkg.devDependencies || {}));
```

Since `package.json` is just JSON, any Node script can read and inspect it directly with `fs.readFileSync` + `JSON.parse` — no special API needed. This is the basic building block used by tooling (linters, dependency-audit scripts, custom CI checks) that needs to reason about a project's declared dependencies. See `../theory/01-package-json-dependency-fields.md` for what each field means.
