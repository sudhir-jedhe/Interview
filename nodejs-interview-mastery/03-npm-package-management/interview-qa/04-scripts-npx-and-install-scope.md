# Interview Q&A: Scripts, npx & Install Scope

**Q: What are npm script pre/post hooks, and how do they work?**
Any script named `pre<name>` or `post<name>` automatically runs immediately before or after `npm run <name>` (or built-in commands like `npm start`/`npm test`), without needing to be referenced explicitly in the main script. It's a naming convention npm recognizes, commonly used for cleanup steps, build preparation, or post-build asset copying.

**Q: What does npx do, and how is it different from a global install?**
`npx` executes a package's CLI binary without a persistent install — if the package (or the requested version) isn't already available locally or globally, it downloads it to a temporary cache, runs it once, and doesn't leave it installed afterward (unless you explicitly install it). This is ideal for one-off tool usage or trying out a scaffolding CLI, avoiding the staleness and system-wide pollution that comes with `npm install -g`.

**Q: When would you use a global install versus a local install?**
Global installs (`npm install -g`) put a package's binary on your system `PATH`, appropriate for developer tooling you invoke by name across many unrelated projects. Local installs (the default) scope the package to the current project's `node_modules` and pin its version via `package.json`/lock file — the correct choice for anything the project's own code imports, or any build/test tool the project's scripts depend on, since it guarantees every contributor and CI run uses the same version.
