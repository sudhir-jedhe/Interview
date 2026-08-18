# 12. Type Inference & Assertions

TypeScript infers types through two complementary mechanisms — contextual typing (pulling types in from usage) and best-common-type inference (deriving types from literal values) — and understanding both is essential for predicting what type a given expression will have without an explicit annotation. This topic covers how that inference engine works, how `let` vs `const` widening changes what gets inferred, and the tools available to override or refine inference: type assertions (`as`), the `as const` assertion for deep-readonly literal types, the non-null assertion operator (`!`) and its real production risks, and the modern `satisfies` operator for validating a value against a type without losing its inferred precision. Every concept here shows up constantly in real code review — knowing when to reach for `satisfies` instead of `as`, or an assertion function instead of `!`, is a strong signal of production TypeScript experience, not just textbook familiarity.

## What's covered

- How contextual typing and best-common-type inference work, including array literal and function return-type inference
- Type widening: why `let x = "a"` becomes `string` but `const x = "a"` stays `"a"`, and why object literal properties widen independently of the containing binding
- Type assertions (`as Type`), the legacy `<Type>` syntax, and why `.tsx` files can't use the latter
- `as const` for deep-readonly objects/arrays and literal-type narrowing, including the `as const` + `keyof typeof` enum-like pattern
- The non-null assertion operator (`!`), why it provides zero runtime protection, and safer alternatives
- The `satisfies` operator: validating against a type without widening the inferred type
- Hands-on problems: fixing an `as`-abuse bug, using `satisfies` correctly, and building a reusable `assertIsDefined` helper

## Index

### theory/
- [01-how-inference-works.md](theory/01-how-inference-works.md) — contextual typing vs. best-common-type inference
- [02-type-widening.md](theory/02-type-widening.md) — `let` vs `const` widening, object literal property widening
- [03-type-assertions.md](theory/03-type-assertions.md) — `as Type`, the `<Type>` syntax, and JSX ambiguity
- [04-as-const.md](theory/04-as-const.md) — deep readonly + literal narrowing
- [05-non-null-assertion.md](theory/05-non-null-assertion.md) — `!` operator, its risks, and safer patterns
- [06-satisfies-operator.md](theory/06-satisfies-operator.md) — validation without widening

### snippets/
- [01-best-common-type.md](snippets/01-best-common-type.md)
- [02-widening-let-vs-const.md](snippets/02-widening-let-vs-const.md)
- [03-as-type-assertion.md](snippets/03-as-type-assertion.md)
- [04-as-const-tuple.md](snippets/04-as-const-tuple.md)
- [05-non-null-assertion-usage.md](snippets/05-non-null-assertion-usage.md)
- [06-satisfies-basic.md](snippets/06-satisfies-basic.md)
- [07-return-type-inference.md](snippets/07-return-type-inference.md)

### output-based/
- [01-widened-array-push.md](output-based/01-widened-array-push.md)
- [02-object-literal-widening.md](output-based/02-object-literal-widening.md)
- [03-double-assertion-runtime-crash.md](output-based/03-double-assertion-runtime-crash.md)
- [04-satisfies-vs-annotation.md](output-based/04-satisfies-vs-annotation.md)
- [05-non-null-chain-crash.md](output-based/05-non-null-chain-crash.md)
- [06-as-const-enum-like.md](output-based/06-as-const-enum-like.md)
- [07-generic-inference-context.md](output-based/07-generic-inference-context.md)

### scenarios/
- [01-api-response-parsing.md](scenarios/01-api-response-parsing.md) — validating untyped fetch responses instead of asserting
- [02-config-object-drift.md](scenarios/02-config-object-drift.md) — why exhaustiveness checks matter more than annotation style
- [03-third-party-typings-mismatch.md](scenarios/03-third-party-typings-mismatch.md) — fixing wrong library types at the boundary instead of asserting per call site

### interview-qa/
- [01-inference-and-widening.md](interview-qa/01-inference-and-widening.md)
- [02-assertions-and-const.md](interview-qa/02-assertions-and-const.md)
- [03-non-null-and-satisfies.md](interview-qa/03-non-null-and-satisfies.md)

### problems/
- [01-as-abuse-bug.md](problems/01-as-abuse-bug.md) — find and fix a bug caused by an unsafe double assertion
- [02-satisfies-config-validation.md](problems/02-satisfies-config-validation.md) — validate a config with `satisfies` while preserving literal types
- [03-assert-is-defined.md](problems/03-assert-is-defined.md) — implement a safe `assertIsDefined<T>` helper to replace `!`

### assets/
- [README.md](assets/README.md)
