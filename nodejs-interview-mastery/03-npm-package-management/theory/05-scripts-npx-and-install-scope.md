# npm Scripts, npx, and Install Scope

## npm scripts and lifecycle hooks

npm scripts are arbitrary shell commands under `"scripts"` in `package.json`, run via `npm run <name>` (with `pre<name>`/`post<name>` lifecycle hooks auto-running before/after):

```json
{ "scripts": { "pretest": "eslint .", "test": "jest", "posttest": "echo done" } }
```

Any script named `pre<name>` or `post<name>` automatically runs immediately before or after `npm run <name>` (or built-in commands like `npm start`/`npm test`), without needing to be referenced explicitly — it's a naming convention npm recognizes, commonly used for cleanup steps, build preparation, or post-build asset copying.

## npx

`npx <package>` executes a package's binary without a permanent global install — if not already present locally or globally, it downloads it to a temp cache, runs it once, useful for one-off tool usage (`npx create-react-app`) or running a locally-installed CLI tool without needing it on `PATH`.

## Local vs global installs

| Aspect | Local install | Global install (`-g`) |
|---|---|---|
| Location | Project's `node_modules` | Shared system-wide directory |
| Version control | Pinned per-project via package.json/lock | One shared version across all projects |
| Appropriate for | Anything the project's code imports | CLI tools you invoke by name across many projects |
| CI-friendliness | Reproducible (installed fresh each time from lock file) | Risky — CI environment may have a different/no global version |

**Global** installs (`npm install -g`) put a package's binaries on your system `PATH`, appropriate for CLI tools you use across many projects (e.g. `npm`, `typescript`'s `tsc`, if you want it system-wide). **Local** installs (default, no `-g`) put the package in the current project's `node_modules`, the correct choice for anything the project's code actually imports, since it pins the version per-project and avoids "works on my machine but not CI" mismatches from a shared global version.

Prefer local installs plus `npx`/`npm run` script invocation for CLI tools tied to a specific project (like a linter or bundler), reserving global installs for truly cross-project developer tooling. The common mistake is relying on a globally-installed CLI tool inside a project's build/test scripts — it works on the original developer's machine but fails in CI or for teammates without that same global install.
