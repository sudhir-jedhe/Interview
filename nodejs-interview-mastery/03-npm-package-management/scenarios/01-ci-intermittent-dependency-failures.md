# Your CI Pipeline Occasionally Fails with Dependency Errors That Don't Reproduce Locally

The CI build fails intermittently with errors from a transitive dependency, but running `npm install` locally always works fine, and the team can't figure out why the environments diverge.

**Approach:** Check whether CI is using `npm install` instead of `npm ci`. `npm install` re-resolves semver ranges and can pick up newly published versions within those ranges (e.g., a transitive dependency bumped its own dependency) that differ from what's captured in the committed `package-lock.json` — meaning CI's `node_modules` can silently diverge from what any developer tested locally with the same lock file present. Fix:

```yaml
# CI pipeline step
- run: npm ci   # not npm install -- exact, lock-file-driven, reproducible
```

Also verify `package-lock.json` is actually committed to version control (check `.gitignore` didn't accidentally exclude it) and that CI isn't caching a stale `node_modules` across builds without invalidating on `package-lock.json` changes. See `../theory/03-package-lock-and-reproducibility.md` for the full `npm install` vs `npm ci` comparison.
