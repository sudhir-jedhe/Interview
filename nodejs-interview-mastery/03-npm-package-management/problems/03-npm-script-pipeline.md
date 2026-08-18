# Problem: Write an npm Script Combo (pre/post Hooks) for a Build+Test Pipeline

## Problem statement

Design a `package.json` `"scripts"` section for a project that needs to: clean the previous build output, type-check, build, run unit tests against the build output, and finally run a smoke test — using npm's `pre`/`post` lifecycle hook convention rather than one giant chained shell command. Explain the exact execution order when a developer runs `npm run build` and separately when they run `npm test`.

## Requirements

- `npm run build` should clean output, type-check, then build — in that order — without the developer needing to remember to run each step manually.
- `npm test` should ensure a fresh build exists before running unit tests, then run a smoke test afterward.
- If any step fails, the whole chain must stop immediately (no swallowed failures).
- Explain what triggers each hook and why.

## Solution

```json
{
  "scripts": {
    "clean": "rimraf dist",
    "typecheck": "tsc --noEmit",
    "prebuild": "npm run clean && npm run typecheck",
    "build": "tsc -p tsconfig.build.json",

    "pretest": "npm run build",
    "test": "jest --runInBand",
    "posttest": "node scripts/smoke-test.js"
  }
}
```

**Execution order when running `npm run build`:**

1. `prebuild` runs automatically first (npm's naming convention: any `pre<name>` script runs before `<name>`), which itself runs `clean` then `typecheck` in sequence via `&&`.
2. `build` runs next, compiling with `tsc`.
3. There's no `postbuild` here, so the chain ends after `build` succeeds.

**Execution order when running `npm test`:**

1. `pretest` runs automatically first, which itself invokes `npm run build` — meaning the *entire* build chain (`prebuild` → `build`) runs as a nested step before any test code executes, guaranteeing tests never run against a stale build.
2. `test` runs Jest against the freshly built output.
3. `posttest` runs automatically after, executing a smoke test against the built artifact.

**Why failures stop the chain:** npm scripts run via the shell, and each `pre`/main/`post` step is a separate npm-invoked process — if any step exits with a non-zero exit code (e.g., a failing `tsc` type error, or a Jest test failure), npm aborts the remaining chain immediately and propagates the non-zero exit code, rather than continuing to the next hook. Within a single script line, `&&` (as used in `prebuild`) provides the same short-circuit behavior at the shell level — `clean && typecheck` won't run `typecheck` if `clean` fails.

**Why pre/post over one big script:** splitting into named steps (`clean`, `typecheck`, `build`) keeps each individually runnable in isolation during development (`npm run typecheck` alone while iterating on types, without needing a full build), while the `pre`/`post` hooks still guarantee the full pipeline runs automatically for `npm run build` / `npm test` — the best of both granular control and automatic sequencing. See `../theory/05-scripts-npx-and-install-scope.md` for the hook-naming mechanism this relies on.
