# Reproducing "npm ci"'s Reproducibility Check Manually

```js
const fs = require('node:fs');
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const lock = JSON.parse(fs.readFileSync('./package-lock.json', 'utf8'));

for (const [name, range] of Object.entries(pkg.dependencies || {})) {
  const lockedEntry = lock.packages?.[`node_modules/${name}`];
  if (!lockedEntry) console.warn(`${name} declared but missing from lock file!`);
}
```

This is a simplified illustration of the kind of drift check `npm ci` performs internally before it will proceed — verifying every dependency declared in `package.json` actually has a corresponding entry in `package-lock.json`'s `packages` map (the modern lockfile v2/v3 format). Real `npm ci` does a much more thorough check (exact version/range compatibility, integrity hashes, transitive dependencies too) and simply refuses to install at all if anything is out of sync, rather than warning and continuing like this snippet does. See `../theory/03-package-lock-and-reproducibility.md` for why this matters, and `../scenarios/01-ci-intermittent-dependency-failures.md` for the production incident this class of check prevents.
