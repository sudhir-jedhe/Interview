# Security Basics — Dependency and Supply-Chain Risk

## `npm audit` and lockfiles

`npm audit` scans your dependency tree against known vulnerability databases and reports affected packages with severity. Lockfiles (`package-lock.json`) pin exact resolved versions (including transitive deps) so `npm install` is reproducible — without one, a transitive dependency could be silently swapped for a compromised version between installs (a real supply-chain attack vector). Run `npm audit` in CI, and treat `npm audit fix --force` with caution since it can bump major versions unexpectedly.

## Lockfile vs `npm audit` — different guarantees

| Aspect | Lockfile (`package-lock.json`) | `npm audit` |
|---|---|---|
| Guarantees | Reproducible installs — exact resolved versions, including transitive deps | Flags *known* vulnerabilities in whatever versions are currently resolved |
| What it doesn't catch | Doesn't know if a pinned version has a vulnerability | Doesn't stop a first-time install from ever picking up a compromised version if there's no lockfile |
| Update mechanism | Manual (`npm update`) or automated tooling (Dependabot/Renovate) | `npm audit fix`, with review |

A lockfile alone doesn't tell you a pinned version is vulnerable — you still need `npm audit` (or Dependabot/Snyk) to actually surface known CVEs against what's locked. Conversely, running `npm audit` without a committed lockfile means your "reproducible" install isn't actually reproducible, so the audit result for one install may not match the next. The common mistake is committing `node_modules` changes without committing the updated lockfile, or ignoring `npm audit` output because "it's just dev dependencies" without checking severity/reachability first.
