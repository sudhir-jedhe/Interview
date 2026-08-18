# 08 — Type Narrowing & Guards

Narrowing is how TypeScript turns a broad union type into a precise one within a specific branch of code, based on a runtime check — it's the mechanism that makes union types (topic 04) and discriminated unions practically usable without constant casting. This topic covers the built-in narrowing operators (`typeof`, `instanceof`, `in`, truthiness), how to write your own type guards and assertion functions when built-in narrowing isn't enough, the `never`-based exhaustiveness-check pattern for discriminated unions, and a genuinely common production gotcha: narrowing that silently doesn't survive across a closure boundary. The problems apply all of it directly — a real `isValidEmail` guard, an exhaustive switch that breaks the build when a variant is added, and a live demonstration (with fix) of the closure-narrowing pitfall.

## What's covered

- Control-flow narrowing: `typeof`, `instanceof`, `in`, and truthiness checks
- User-defined type guards with `x is Foo` return type predicates
- Discriminated union narrowing with `switch`/`if` on a literal discriminant
- The `never` type as an exhaustiveness-check tool in a switch's default case
- Narrowing pitfalls: lost narrowing across closures and after method calls
- Assertion functions (`asserts x is Foo`, and plain `asserts condition`)

## Index

### theory/
- [01-control-flow-narrowing.md](theory/01-control-flow-narrowing.md)
- [02-user-defined-type-guards.md](theory/02-user-defined-type-guards.md)
- [03-discriminated-union-narrowing.md](theory/03-discriminated-union-narrowing.md)
- [04-never-and-exhaustiveness-checks.md](theory/04-never-and-exhaustiveness-checks.md)
- [05-narrowing-lost-across-closures.md](theory/05-narrowing-lost-across-closures.md)
- [06-assertion-functions.md](theory/06-assertion-functions.md)

### snippets/
- [01-typeof-narrowing.md](snippets/01-typeof-narrowing.md)
- [02-instanceof-narrowing.md](snippets/02-instanceof-narrowing.md)
- [03-in-operator-narrowing.md](snippets/03-in-operator-narrowing.md)
- [04-custom-type-guard.md](snippets/04-custom-type-guard.md)
- [05-discriminated-union-switch.md](snippets/05-discriminated-union-switch.md)
- [06-assertion-function-basic.md](snippets/06-assertion-function-basic.md)
- [07-const-copy-preserves-narrowing.md](snippets/07-const-copy-preserves-narrowing.md)

### output-based/
- [01-narrowing-lost-in-settimeout.md](output-based/01-narrowing-lost-in-settimeout.md)
- [02-truthiness-narrowing-excludes-zero.md](output-based/02-truthiness-narrowing-excludes-zero.md)
- [03-missing-exhaustive-case.md](output-based/03-missing-exhaustive-case.md)
- [04-bad-type-guard-implementation.md](output-based/04-bad-type-guard-implementation.md)
- [05-in-narrowing-optional-property.md](output-based/05-in-narrowing-optional-property.md)
- [06-array-filter-without-predicate-type.md](output-based/06-array-filter-without-predicate-type.md)
- [07-narrowing-reset-by-function-call.md](output-based/07-narrowing-reset-by-function-call.md)

### scenarios/
- [01-validating-webhook-payloads.md](scenarios/01-validating-webhook-payloads.md) — type guard + exhaustive switch for untrusted input
- [02-async-retry-with-narrowing.md](scenarios/02-async-retry-with-narrowing.md) — keeping narrowing sound across `await`
- [03-permission-check-middleware.md](scenarios/03-permission-check-middleware.md) — assertion functions vs type guards in auth middleware

### interview-qa/
- [01-narrowing-basics.md](interview-qa/01-narrowing-basics.md)
- [02-type-guards-and-discriminated-unions.md](interview-qa/02-type-guards-and-discriminated-unions.md)
- [03-closures-and-assertion-functions.md](interview-qa/03-closures-and-assertion-functions.md)

### problems/
- [01-is-valid-email-type-guard.md](problems/01-is-valid-email-type-guard.md) — `isValidEmail(x: unknown): x is string`
- [02-exhaustive-switch-with-never.md](problems/02-exhaustive-switch-with-never.md) — exhaustive switch with a `never`-typed default
- [03-narrowing-lost-in-closure-fix.md](problems/03-narrowing-lost-in-closure-fix.md) — demonstrate and fix the closure pitfall

### assets/
- [README.md](assets/README.md)
