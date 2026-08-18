# Path Aliases and Incremental/Composite Builds

## `baseUrl` and `paths`

`paths` lets you define import aliases so deeply nested relative imports (`../../../../components/Button`) can be written as short, stable specifiers (`@components/Button`) that don't break when files move.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

`baseUrl` establishes the root that non-relative imports (and `paths` patterns) are resolved against; `paths` maps specifier patterns to actual locations relative to `baseUrl`.

**Critical caveat: `paths` only affects the TypeScript type checker, not the emitted JavaScript.** If you compile with `tsc` alone, the emitted `.js` files still contain the literal `@components/Button` import specifier — Node.js has no idea what that means and will throw `Cannot find module '@components/Button'` at runtime, because `paths` was never a runtime resolution mechanism, only a compile-time convenience for the checker. Your bundler (Webpack `resolve.alias`, Vite `resolve.alias`, esbuild `alias`) or a runtime tool (`tsconfig-paths` for plain Node) has to be configured with the *same* aliases separately, or the build either fails to resolve the import or (worse) silently resolves it to the wrong thing if a stale alias with the same name exists elsewhere. This mismatch — TS accepts the import, the bundler doesn't know about it — is covered concretely in `problems/02-path-alias-bundler-mismatch.md`.

## Incremental builds

```json
{ "compilerOptions": { "incremental": true, "tsBuildInfoFile": "./.tsbuildinfo" } }
```

`incremental: true` makes `tsc` save information about the previous compilation (which files, their dependency graph, and diagnostics) to a `.tsbuildinfo` file. On the next build, TypeScript reads this file and skips re-checking files that haven't changed and don't depend on anything that changed, significantly speeding up repeated builds (e.g., in CI or watch mode) at the cost of a small cache file that should typically be gitignored.

## Composite projects

```json
{ "compilerOptions": { "composite": true, "declaration": true } }
```

`composite: true` is used for **project references** — splitting a large codebase into multiple `tsconfig.json` projects (e.g., a `packages/shared`, `packages/api`, `packages/web` monorepo) that reference each other via a `references` array, each built independently and incrementally. `composite` enforces stricter constraints needed for this to work reliably: it requires `declaration: true` (so referencing projects can consume `.d.ts` output instead of re-parsing source) and requires all files to be explicitly listed via `include`/`files` rather than relying on loose inference. This is primarily a monorepo/build-performance concern rather than a strict-mode concern, but it's frequently grouped with strict-mode `tsconfig` questions because both fall under "tsconfig options you should be able to explain the purpose of."

```json
// packages/web/tsconfig.json
{
  "compilerOptions": { "composite": true },
  "references": [{ "path": "../shared" }]
}
```

## Interview framing

The key distinction to articulate: `paths` is a **compile-time-only** convenience for the type checker and IDE tooling; it does nothing at runtime and must be mirrored in whatever actually resolves modules when the code runs. `incremental`/`composite` are **build-performance** features, unrelated to type safety, that matter most once a codebase is large enough that full rebuilds become a bottleneck.
