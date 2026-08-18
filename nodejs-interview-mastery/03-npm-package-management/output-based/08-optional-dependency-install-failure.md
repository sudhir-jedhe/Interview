# Optional Dependency Install Failure

```json
{ "optionalDependencies": { "fsevents": "^2.3.0" } }
```

Running `npm install` on a Linux CI machine, where `fsevents` (a macOS-only native binding) cannot be built.

**Answer:** `npm install` completes successfully; `fsevents` is simply skipped, and it's absent from `node_modules`.

**Why:** Packages under `optionalDependencies` are allowed to fail to install (due to platform incompatibility, native build failure, etc.) without failing the overall install — code that depends on it must handle its absence gracefully (typically via a `try { require('fsevents') } catch {}` pattern).
