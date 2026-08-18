# npm ci with a Stale Lock File

You run `npm ci` in a repo where `package.json` was just edited to add a new dependency, but `package-lock.json` was not regenerated/committed.

**Answer:** `npm ci` fails with an error (`npm ERR! Invalid: lock file's ... does not satisfy ...`), and does **not** install anything or fall back to resolving fresh versions.

**Why:** `npm ci` is specifically designed to require an exact, in-sync match between `package.json` and `package-lock.json` — unlike `npm install`, it will not attempt to reconcile drift by re-resolving versions. This is intentional: it guarantees CI either installs exactly what was tested, or fails loudly rather than silently installing something different.
