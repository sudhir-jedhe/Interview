# Interview Q&A: Lockfiles & Reproducible Installs

**Q: Why does package-lock.json matter, and what problem does it solve?**
`package.json` declares acceptable version *ranges*, not exact versions, so two separate `npm install` runs at different times could resolve to different actual versions if anything new was published in the interim — leading to "works on my machine" bugs. `package-lock.json` records the exact resolved version and integrity hash of every package (including transitive dependencies) from the last successful install, so committing it and using `npm ci` guarantees every machine (dev, CI, production) installs the identical dependency tree.

**Q: What's the difference between npm install and npm ci?**
`npm install` resolves dependency versions against the ranges in `package.json`, can update `package-lock.json` if it's out of sync, and modifies `node_modules` incrementally. `npm ci` requires an existing, exactly-matching `package-lock.json` (erroring if absent or stale), always wipes `node_modules` and reinstalls fresh from the lock file's exact versions, and never modifies the lock file. `npm ci` is faster and strictly reproducible, making it the correct choice for CI pipelines and deployment builds, while `npm install` is meant for active local development where you're changing dependencies.

**Q: Why should CI pipelines use npm ci instead of npm install?**
`npm ci` guarantees the exact dependency tree recorded in `package-lock.json` is installed, with no possibility of resolving a newer version within a semver range that wasn't part of what was actually tested. It also fails loudly and immediately if `package.json` and `package-lock.json` are out of sync, rather than silently reconciling them, which surfaces dependency drift issues early instead of letting them slip into a deployed build. It's also generally faster since it skips redundant version-resolution steps.
