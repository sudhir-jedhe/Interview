# Semantic Versioning Ranges

Given a declared version `1.2.3` (major.minor.patch):

```
^1.2.3   -> >=1.2.3 <2.0.0   (allows minor + patch upgrades, not major)
~1.2.3   -> >=1.2.3 <1.3.0   (allows only patch upgrades)
1.2.3    -> exactly 1.2.3    (no upgrades at all)
*        -> any version
>=1.2.3  -> 1.2.3 or newer, unbounded
```

## ^ vs ~ vs exact

| Aspect | ^1.2.3 | ~1.2.3 | 1.2.3 (exact) |
|---|---|---|---|
| Allows | Minor + patch upgrades (`<2.0.0`) | Patch upgrades only (`<1.3.0`) | Nothing — exact match only |
| Risk of breaking changes | Higher (trusts semver-compliant minor bumps) | Lower | None from version drift |
| Typical use | Default npm behavior for most libraries | When you want tighter control but still patch fixes | Pinning a known-fragile or security-sensitive dependency |

Use `^` (npm's default when you `npm install <pkg>`) for most dependencies to get bug fixes and backward-compatible features automatically; use exact pins sparingly, for packages where even patch releases have historically caused issues. The common mistake is assuming `^` is always safe — a misbehaving package that doesn't follow semver strictly can still introduce breaking changes in a "minor" release.

## Special case: pre-1.0 versions

For `0.x.y` versions, `^` treats the *minor* version as the effectively-locked digit (since pre-1.0 packages can break compatibility on minor bumps by convention) — `^0.2.3` allows `>=0.2.3 <0.3.0`, not up to `1.0.0`. This surprises people who assume `^` always means "same major only."

```json
{ "dependencies": { "lodash": "^0.9.0" } }
// resolves to >=0.9.0 <0.10.0, NOT up to 1.0.0
```

## No-range-operator pins never move on npm update

A version string with no `^` or `~` prefix is an **exact pin** — `npm update` will never install a different version, even a patch release, unless the range in `package.json` itself is edited or a specific version is installed explicitly (e.g. `npm install moment@latest`).
