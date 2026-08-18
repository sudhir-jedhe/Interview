# Interview Q&A: Dependency Types & Semver Ranges

**Q: What's the difference between dependencies, devDependencies, and peerDependencies in package.json?**
`dependencies` are required at runtime and always installed, including in production. `devDependencies` are only needed for local development, testing, and building (linters, test runners, bundlers) and are skipped when installing with `--omit=dev` or in production-only installs. `peerDependencies` declare that a package expects the *consuming* application to provide a compatible version itself (common for plugins/libraries that shouldn't bundle their own copy of a shared dependency like React) — since npm 7, these are auto-installed if missing, but a version conflict with what's already installed produces a resolution error.

**Q: What does optionalDependencies do differently from regular dependencies?**
If a package listed under `optionalDependencies` fails to install (e.g., a native addon that only builds on a specific OS), npm continues the overall install instead of failing it. Code relying on an optional dependency must handle its potential absence at runtime, typically with a `try/catch` around the `require()` call.

**Q: Explain what `^1.2.3` and `~1.2.3` each allow in semantic versioning.**
`^1.2.3` allows any version greater than or equal to `1.2.3` but less than `2.0.0` — minor and patch upgrades, but never a major version bump, since major bumps signal breaking changes by convention. `~1.2.3` is stricter, allowing only patch-level upgrades: `>=1.2.3 <1.3.0`. Special case: for versions with major `0`, `^` locks at the minor digit instead of major, since pre-1.0 packages are allowed to break on minor releases.
