# Resolving ^ Against a Pre-1.0 Package

```json
{ "dependencies": { "some-lib": "^0.4.2" } }
```

If `some-lib` publishes `0.4.9`, `0.5.0`, and `1.0.0`, which version does `npm install` resolve to?

**Answer:** `0.4.9`

**Why:** For versions with major version `0`, npm's `^` treats the **minor** digit as the effective "locked" boundary (since the semver spec allows breaking changes on minor bumps before 1.0.0 by convention) — `^0.4.2` resolves to `>=0.4.2 <0.5.0`. `0.5.0` and `1.0.0` are both excluded even though `1.0.0` looks like "the same or newer" intuitively.
