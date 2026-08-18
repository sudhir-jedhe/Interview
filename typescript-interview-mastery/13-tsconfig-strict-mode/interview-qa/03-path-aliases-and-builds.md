# Interview Q&A: Path Aliases and Build Configuration

**Q: Does `paths` in tsconfig.json do anything at runtime?**
A: No. `paths` (combined with `baseUrl`) only affects TypeScript's type checker and editor tooling — it lets `import { x } from "@utils/format"` resolve to `src/utils/format.ts` for type-checking purposes. The compiled JavaScript still contains the literal specifier `@utils/format`, which Node.js or a bundler has no built-in knowledge of. You must configure the same alias separately in your bundler (Webpack `resolve.alias`, Vite `resolve.alias`) or via a runtime resolver like `tsconfig-paths` for plain Node execution, or the import fails to resolve at runtime even though it compiled cleanly.

**Q: What specifically breaks if a path alias is added to tsconfig but not the bundler config?**
A: Compilation succeeds (TypeScript is satisfied), but the app fails at runtime with a module-not-found error from the bundler or Node — `Cannot find module '@utils/format'` — because the alias was never taught to whatever actually resolves imports when the code runs. This is a very common "works in the editor, breaks in the build" report.

**Q: What does `incremental: true` do, and is it related to type safety?**
A: It's a build-performance feature, unrelated to strictness. It saves compilation state (dependency graph, previous diagnostics) to a `.tsbuildinfo` file so subsequent builds can skip re-checking unchanged files, speeding up repeated `tsc` runs (e.g., in CI or watch mode).

**Q: What's the difference between a regular multi-package tsconfig setup and one using `composite: true` with project references?**
A: A regular setup either has one shared `tsconfig.json` for the whole repo, or independent configs per package with no formal relationship. `composite: true` plus `references` establishes an explicit, incrementally-buildable dependency graph between packages (e.g., `packages/web` references `packages/shared`), requiring each referenced project to emit declaration files (`declaration: true`) so dependents type-check against compiled `.d.ts` output instead of re-parsing source — this is what enables `tsc --build` to only rebuild packages that actually changed, which matters once a monorepo is large enough for full rebuilds to be slow.
