# Problem: Implement a Tiny Dependency-Resolver Simulation

## Problem statement

Given a small graph of packages, their available versions, and each version's own dependency requirements (semver ranges on other packages), implement a resolver that picks one compatible version for every package in the graph — or reports that no compatible set exists.

## Requirements

- Input: a registry describing, for each package, which versions exist and what each version depends on (as `{ package: range }` pairs).
- Given a root set of top-level requirements, pick exactly one version per package such that every picked version's own dependency ranges are satisfied by the other picked versions.
- Prefer the highest satisfying version when multiple options work (mirroring real resolvers' typical "newest compatible" preference).
- Detect and report an unsatisfiable graph (no combination works) rather than crashing or picking an invalid combination.

## Solution

```js
// Simplified semver-satisfies check (see ../problems/01-semver-range-validator.md for a fuller version)
function satisfies(range, version) {
  const [rMajor, rMinor = 0] = range.replace(/^[\^~]/, '').split('.').map(Number);
  const [vMajor, vMinor = 0, vPatch = 0] = version.split('.').map(Number);
  if (range.startsWith('^')) {
    return rMajor === 0
      ? vMajor === 0 && vMinor === rMinor
      : vMajor === rMajor && (vMinor > rMinor || (vMinor === rMinor));
  }
  if (range.startsWith('~')) {
    return vMajor === rMajor && vMinor === rMinor;
  }
  return version === range; // exact
}

// registry: { pkgName: { version: { deps: { pkgName: range } } } }
const registry = {
  'left-pad': {
    '1.0.0': { deps: {} },
    '2.0.0': { deps: {} },
  },
  'string-utils': {
    '1.0.0': { deps: { 'left-pad': '^1.0.0' } },
    '2.0.0': { deps: { 'left-pad': '^2.0.0' } },
  },
  app: {
    '1.0.0': { deps: { 'string-utils': '^2.0.0', 'left-pad': '^1.0.0' } }, // deliberately conflicting
  },
};

function versionsFor(pkg) {
  return Object.keys(registry[pkg] || {}).sort((a, b) => {
    // descending sort so "prefer highest" is just "try first"
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pb[i] - pa[i];
    return 0;
  });
}

function resolve(rootDeps) {
  const chosen = {}; // pkg -> version

  function tryResolve(pkg, range) {
    // Already chosen a version for this package -- must be compatible with this new constraint too
    if (chosen[pkg]) {
      return satisfies(range, chosen[pkg]);
    }

    for (const version of versionsFor(pkg)) {
      if (!satisfies(range, version)) continue;

      chosen[pkg] = version; // tentatively pick this version
      const subDeps = registry[pkg][version].deps;
      const subDepsOk = Object.entries(subDeps).every(([depPkg, depRange]) =>
        tryResolve(depPkg, depRange)
      );

      if (subDepsOk) return true;

      delete chosen[pkg]; // backtrack -- this version didn't work out, try the next
    }

    return false; // no version of `pkg` satisfies `range` given everything already chosen
  }

  const allRootsOk = Object.entries(rootDeps).every(([pkg, range]) =>
    tryResolve(pkg, range)
  );

  return allRootsOk ? chosen : null;
}

// --- usage ---
const result = resolve({ 'string-utils': '^2.0.0', 'left-pad': '^1.0.0' });
console.log(result === null ? 'UNSATISFIABLE' : result);
// UNSATISFIABLE -- string-utils@2.0.0 needs left-pad@^2.0.0, but the root also demands left-pad@^1.0.0,
// and this simplified resolver assumes a single shared version per package (no nested node_modules
// duplication), so no combination satisfies both constraints simultaneously.

const result2 = resolve({ 'string-utils': '^1.0.0', 'left-pad': '^1.0.0' });
console.log(result2);
// { 'string-utils': '1.0.0', 'left-pad': '1.0.0' }
```

**Key design points:**

- **Backtracking search:** `tryResolve` tentatively picks the highest satisfying version for a package, recursively tries to resolve its dependencies, and backtracks (`delete chosen[pkg]`) to try the next-lower version if the recursive resolution fails — a simplified constraint-satisfaction algorithm.
- **Single version per package:** this simulation deliberately assumes npm's "flat, single shared version" ideal (like a truly flat `node_modules` with no nesting) to keep the algorithm tractable — real npm resolves the `string-utils`/`left-pad` conflict from the example by *nesting* a private `left-pad@2.0.0` inside `string-utils`'s own `node_modules` (see `../theory/04-node-modules-resolution.md`), which is why real npm rarely reports true "unsatisfiable" errors for ordinary dependency conflicts — nesting sidesteps most of them. This simulation intentionally models the stricter "everyone must share one version" constraint to make the resolver logic itself interesting to implement.
- **"Prefer highest" via sort order:** `versionsFor` returns versions sorted descending, so the greedy "try each version in order" loop naturally prefers the newest compatible version first, matching typical real-world resolver behavior.
