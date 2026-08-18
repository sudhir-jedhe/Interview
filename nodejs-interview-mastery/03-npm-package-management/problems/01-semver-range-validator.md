# Problem: Parse package.json and Validate Installed Versions Against Semver Ranges

## Problem statement

Write a script that reads `package.json` and, for each declared dependency, checks whether the *actually installed* version (read from each package's own `node_modules/<pkg>/package.json`) satisfies the declared semver range (`^`, `~`, exact, `*`, `>=`). Report any mismatches.

## Requirements

- Support `^x.y.z`, `~x.y.z`, exact `x.y.z`, `*`, and `>=x.y.z` range forms.
- Correctly handle the pre-1.0 special case for `^` (locks the minor digit, not major, when major is `0`).
- For each dependency, print whether the installed version satisfies its range, or a clear mismatch message.
- Handle a missing `node_modules` entry (declared but not installed) as its own reported case, not a crash.

## Solution

```js
const fs = require('node:fs');
const path = require('node:path');

function parseVersion(v) {
  const [major, minor, patch] = v.split('.').map(Number);
  return { major, minor, patch };
}

function compareVersions(a, b) {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

function satisfies(range, versionStr) {
  const version = parseVersion(versionStr);

  if (range === '*') return true;

  if (range.startsWith('>=')) {
    const min = parseVersion(range.slice(2));
    return compareVersions(version, min) >= 0;
  }

  if (range.startsWith('^')) {
    const base = parseVersion(range.slice(1));
    const lowerOk = compareVersions(version, base) >= 0;
    // pre-1.0: ^0.x.y locks the MINOR digit as the upper bound, not major
    if (base.major === 0) {
      return lowerOk && version.major === 0 && version.minor === base.minor;
    }
    return lowerOk && version.major === base.major;
  }

  if (range.startsWith('~')) {
    const base = parseVersion(range.slice(1));
    return (
      compareVersions(version, base) >= 0 &&
      version.major === base.major &&
      version.minor === base.minor
    );
  }

  // exact pin
  const exact = parseVersion(range);
  return compareVersions(version, exact) === 0;
}

function getInstalledVersion(pkgName) {
  try {
    const pkgJsonPath = require.resolve(`${pkgName}/package.json`, {
      paths: [process.cwd()],
    });
    return JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8')).version;
  } catch {
    return null; // not installed
  }
}

function validateDependencies(packageJsonPath) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

  for (const [name, range] of Object.entries(allDeps)) {
    const installed = getInstalledVersion(name);
    if (installed === null) {
      console.log(`[MISSING]   ${name}@${range} -- not found in node_modules`);
      continue;
    }
    const ok = satisfies(range, installed);
    console.log(
      `[${ok ? 'OK' : 'MISMATCH'}] ${name}: declared "${range}", installed "${installed}"`
    );
  }
}

validateDependencies(path.join(process.cwd(), 'package.json'));
```

**Key design points:**

- **Pre-1.0 `^` handling** is the trickiest correctness detail (see `../theory/02-semantic-versioning-ranges.md`) — `^0.4.2` must resolve to `>=0.4.2 <0.5.0`, not `<1.0.0`, so the code checks `base.major === 0` explicitly and compares the minor digit instead of major in that branch.
- **`require.resolve` with `paths`** is used to locate each dependency's own `package.json`, which correctly follows Node's real module resolution algorithm (walking up `node_modules`, respecting nested/hoisted layouts) rather than naively assuming a flat top-level `node_modules`.
- **Missing packages are a distinct case**, not an error — a dependency declared in `package.json` but not actually installed (e.g., after editing `package.json` by hand without running install) is common enough to warrant its own reported state.
- For production use, always prefer the real `semver` npm package (`semver.satisfies(installedVersion, range)`) — this hand-rolled version is for interview/learning purposes and doesn't handle pre-release tags, build metadata, or complex range syntax like `1.2.3 - 2.3.4` or `1.x || 2.x`.
