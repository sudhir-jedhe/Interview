# npm & Package Management

npm is Node's default package manager and the `package.json` file is the manifest that drives it — declaring dependencies, scripts, and metadata for a project. This topic covers the anatomy of `package.json` (the different dependency types and when each applies), how semantic versioning ranges (`^`, `~`, exact) actually constrain what gets installed, why `package-lock.json` exists and what breaks without it, how Node resolves `require()`/`import` specifiers by walking up `node_modules` directories, and the practical differences between `npm install` and `npm ci` that trip people up in CI pipelines. Interviewers use this topic to check whether you understand reproducibility and dependency resolution, not just "how to run npm install."

> Looking for your original flat notes on this? See `../SOURCE-MAP.md`.

## Folder structure

- **`theory/`** — core concepts, split by subject:
  - `01-package-json-dependency-fields.md` — `dependencies`/`devDependencies`/`peerDependencies`/`optionalDependencies`
  - `02-semantic-versioning-ranges.md` — `^`, `~`, exact pins, the pre-1.0 special case
  - `03-package-lock-and-reproducibility.md` — why `package-lock.json` exists, `npm install` vs `npm ci`
  - `04-node-modules-resolution.md` — the upward directory-walk algorithm, nested version overrides
  - `05-scripts-npx-and-install-scope.md` — npm scripts/lifecycle hooks, `npx`, local vs global installs
- **`snippets/`** — 7 runnable code snippets, one per file (reading dependency fields, checking installed versions, a simplified semver check, an `npm ci`-style drift check, simulating module resolution, script hooks, programmatic `npx`)
- **`output-based/`** — 8 "predict the output" questions with full traces (script hook order, pre-1.0 `^`, nested override resolution, stale-lockfile `npm ci`, `--omit=dev`, exact-pin `npm update`, peer dependency conflicts, optional dependency failures)
- **`scenarios/`** — 5 real-world scenarios (intermittent CI dependency failures, a semver-violating "safe" patch, a monorepo with incompatible major versions, a slow/unreliable install on a restricted network, using `npx` for a one-off tool)
- **`interview-qa/`** — 12 Q&A pairs grouped into 4 themed files: dependency types & semver, lockfiles & reproducible installs, module resolution, and scripts/npx/install scope
- **`problems/`** — 3 hands-on coding challenges: a semver range validator against installed versions, a tiny dependency-resolver simulation with backtracking, and a full build+test npm script pipeline with pre/post hooks
- **`assets/`** — placeholder for original images/PDFs (see `assets/README.md`)

## What's covered

- `package.json` fields: `dependencies`, `devDependencies`, `peerDependencies`, `optionalDependencies`
- Semantic versioning: what `^1.2.3`, `~1.2.3`, and exact `1.2.3` each actually allow
- `package-lock.json` and why it's essential for reproducible builds
- The `node_modules` resolution algorithm (walking up parent directories)
- npm scripts (`pre`/`post` hooks, `npm run`) and `npx`
- Global vs local installs and when each is appropriate
- `npm ci` vs `npm install` — behavior differences and correct CI usage
