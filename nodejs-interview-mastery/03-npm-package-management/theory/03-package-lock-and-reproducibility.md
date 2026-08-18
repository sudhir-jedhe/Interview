# package-lock.json and Reproducible Builds

`package.json` version ranges (see `02-semantic-versioning-ranges.md`) are intentionally loose — they describe *acceptable* versions, not the *exact* version installed. `package-lock.json` records the exact resolved version (and integrity hash) of every package in the dependency tree at the moment `npm install` last updated it.

Without a committed lock file, two developers (or a developer and a CI server) running `npm install` days apart could get different transitive dependency versions if anything in the range was published in between — "works on my machine" bugs and non-reproducible builds. **Always commit `package-lock.json`.**

## npm install vs npm ci

| Aspect | npm install | npm ci |
|---|---|---|
| Requires existing lock file | No — creates/updates one if absent/stale | Yes — errors if missing or out of sync with package.json |
| Can modify package-lock.json | Yes | Never |
| node_modules handling | Incremental (adds/removes as needed) | Always deletes and reinstalls fully |
| Speed | Slower (has to resolve ranges) | Faster (installs exact locked versions directly) |
| Best used for | Local development, adding/removing packages | CI pipelines, Docker builds, deployments |

`npm install` reads `package.json`, resolves versions within the declared ranges, may *update* `package-lock.json` if it's out of sync, and can add/remove packages incrementally without touching unrelated ones. `npm ci` ("clean install") requires an existing `package-lock.json` that must exactly match `package.json` (errors out otherwise), always deletes `node_modules` first, and installs the **exact** versions from the lock file with no range resolution — faster and strictly reproducible, but it will not update the lock file.

Use `npm install` locally when you're actively changing dependencies; use `npm ci` anywhere reproducibility matters and you're not intentionally modifying the dependency set. **CI/CD pipelines and Docker builds should always use `npm ci`** for guaranteed reproducibility and a hard failure (rather than silent drift) if the lock file is stale. The common mistake is using `npm install` in CI, which can silently drift dependency versions between runs if the lock file and manifest fall slightly out of sync, instead of failing loudly like `npm ci` would. See `../scenarios/01-ci-intermittent-dependency-failures.md` for a real incident caused by exactly this mistake.
