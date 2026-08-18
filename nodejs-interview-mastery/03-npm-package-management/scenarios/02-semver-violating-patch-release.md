# A "Safe" Patch Release Breaks Consumers Unexpectedly

Your team publishes `@company/ui-kit` and bumped `2.4.1` → `2.4.2` (a patch, per semver) but multiple consuming apps broke in production after their next `npm install`.

**Approach:** Investigate what actually changed in the patch — if it altered any public API behavior, removed an export, or changed default behavior, that's a semver violation regardless of intent (patch releases must be 100% backward compatible per semver convention). Immediately deprecate the broken version and publish a corrected patch:

```bash
npm deprecate @company/ui-kit@2.4.2 "Contains a breaking change, upgrade to 2.4.3"
npm version patch  # after fixing
npm publish
```

Going forward, add a changeset/semver-check step to the publish pipeline (e.g. `npm-check-updates` combined with API-diffing tools, or simply stricter PR review for anything touching public exports) and document that if a change could break any consumer, it must ship as a **major** version bump, not a patch — since most consumers use `^` ranges and will pull it in automatically. See `../theory/02-semantic-versioning-ranges.md` for why `^` trusts semver-compliant minor/patch bumps by default.
