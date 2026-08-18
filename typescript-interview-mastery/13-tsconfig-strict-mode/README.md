# 13. tsconfig.json & Strict Mode

`tsconfig.json` isn't just build configuration — many of its options directly determine what class of bugs TypeScript can and can't catch, which is why interviewers frequently probe how well you understand the actual behavior behind flags like `strict`, `target`/`lib`, `module`/`moduleResolution`, and `esModuleInterop` rather than just whether you've seen them before. This topic walks through what the `strict` umbrella flag actually enables sub-flag by sub-flag, why `strictNullChecks` alone eliminates the single largest class of "cannot read property of undefined" runtime crashes, and the practical trade-offs behind `skipLibCheck`, path aliases, and incremental/composite builds. It closes with three hands-on problems: diagnosing real bugs a stricter config would have caught, correctly wiring path aliases across `tsconfig.json` and a bundler, and handling a class property that genuinely can't be synchronously initialized under `strictPropertyInitialization`.

## What's covered

- The `strict` flag family: `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `useUnknownInCatchVariables`
- `target` (emitted syntax) vs. `lib` (assumed global APIs) and how mismatches between them cause confusing compile errors
- `module` and `moduleResolution`, including why `"node"` resolution breaks on modern `"exports"`-only packages and when to use `"bundler"`/`"nodenext"` instead
- `esModuleInterop` (why almost every project needs it) and `skipLibCheck` (speed/safety trade-off)
- Path aliases (`baseUrl`/`paths`) as a compile-time-only convenience that must be mirrored in your bundler
- `incremental`/`composite` builds and project references for monorepos
- A deep dive into why `strictNullChecks` alone is the highest-leverage single flag, with a concrete NaN-producing production bug
- Hands-on problems: fixing 3 real bugs a stricter config catches, configuring path aliases correctly across tsconfig + bundler, and handling async class initialization under `strictPropertyInitialization`

## Index

### theory/
- [01-strict-flag-family.md](theory/01-strict-flag-family.md)
- [02-target-and-lib.md](theory/02-target-and-lib.md)
- [03-module-and-resolution.md](theory/03-module-and-resolution.md)
- [04-esmoduleinterop-and-skiplibcheck.md](theory/04-esmoduleinterop-and-skiplibcheck.md)
- [05-path-aliases-and-builds.md](theory/05-path-aliases-and-builds.md)
- [06-strictnullchecks-deep-dive.md](theory/06-strictnullchecks-deep-dive.md)

### snippets/
- [01-minimal-strict-tsconfig.md](snippets/01-minimal-strict-tsconfig.md)
- [02-noImplicitAny-example.md](snippets/02-noImplicitAny-example.md)
- [03-strictNullChecks-optional-chaining.md](snippets/03-strictNullChecks-optional-chaining.md)
- [04-path-alias-config.md](snippets/04-path-alias-config.md)
- [05-strictPropertyInitialization-fix.md](snippets/05-strictPropertyInitialization-fix.md)
- [06-catch-variable-unknown.md](snippets/06-catch-variable-unknown.md)
- [07-esModuleInterop-default-import.md](snippets/07-esModuleInterop-default-import.md)

### output-based/
- [01-null-return-without-strict.md](output-based/01-null-return-without-strict.md)
- [02-implicit-any-parameter.md](output-based/02-implicit-any-parameter.md)
- [03-strictPropertyInitialization-error.md](output-based/03-strictPropertyInitialization-error.md)
- [04-strictFunctionTypes-callback.md](output-based/04-strictFunctionTypes-callback.md)
- [05-target-lib-mismatch.md](output-based/05-target-lib-mismatch.md)
- [06-catch-variable-any-vs-unknown.md](output-based/06-catch-variable-any-vs-unknown.md)
- [07-moduleResolution-node-vs-bundler.md](output-based/07-moduleResolution-node-vs-bundler.md)

### scenarios/
- [01-migrating-legacy-codebase-to-strict.md](scenarios/01-migrating-legacy-codebase-to-strict.md)
- [02-monorepo-shared-tsconfig.md](scenarios/02-monorepo-shared-tsconfig.md)
- [03-ci-build-passes-runtime-fails.md](scenarios/03-ci-build-passes-runtime-fails.md)

### interview-qa/
- [01-strict-family-and-null-checks.md](interview-qa/01-strict-family-and-null-checks.md)
- [02-target-lib-module-resolution.md](interview-qa/02-target-lib-module-resolution.md)
- [03-path-aliases-and-builds.md](interview-qa/03-path-aliases-and-builds.md)

### problems/
- [01-find-bugs-strict-would-catch.md](problems/01-find-bugs-strict-would-catch.md) — find and fix 3 real bugs strict mode catches
- [02-path-alias-bundler-mismatch.md](problems/02-path-alias-bundler-mismatch.md) — configure path aliases and explain the bundler-sync risk
- [03-async-init-property.md](problems/03-async-init-property.md) — strictPropertyInitialization-compliant async init patterns

### assets/
- [README.md](assets/README.md)
