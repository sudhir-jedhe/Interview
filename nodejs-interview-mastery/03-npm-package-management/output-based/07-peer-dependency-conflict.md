# peerDependency Conflict During Install

Package `ui-lib` declares `"peerDependencies": { "react": "^18.0.0" }`. The consuming app has `"react": "^17.0.0"` in its own `dependencies`.

**Answer:** With npm 7+, `npm install` either fails with an `ERESOLVE` peer dependency conflict error, or (if `--legacy-peer-deps` or `--force` is used) installs anyway while ignoring the mismatch, risking runtime incompatibilities.

**Why:** Since npm 7, peer dependencies are validated and (if missing) auto-installed by default — a version conflict between what's already declared and what the peer range requires triggers a hard resolution error rather than silently installing an incompatible version, unlike npm 3–6 which only printed a warning.
