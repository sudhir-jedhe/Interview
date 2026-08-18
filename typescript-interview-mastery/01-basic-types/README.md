# 01 — Basic Types

TypeScript's foundational type system starts with primitives (`string`, `number`, `boolean`, `null`, `undefined`, `bigint`, `symbol`), extends into collection types (arrays and tuples), and includes four special-purpose types — `any`, `unknown`, `never`, and `void` — that are among the most heavily tested topics in TypeScript interviews. This module also covers how object shapes are described inline and the practical rules for when to let TypeScript infer a type versus when to annotate explicitly. Mastering this section means understanding not just the syntax but the *reasoning*: why `unknown` is safer than `any`, why tuples exist separately from arrays, and when inference silently produces a wider (less useful) type than you actually want.

## What's covered

- All seven JavaScript primitives and their TypeScript type-checking implications under `strict` mode
- `T[]` vs `Array<T>` (identical), `readonly` arrays, and tuple types with optional/rest elements
- The precise differences between `any`, `unknown`, `never`, and `void`, and when each is the *correct* choice
- Inline object type shorthand and TypeScript's structural typing model
- When to rely on type inference vs when an explicit annotation is required or advisable
- Literal widening, `as const`, and contextual typing

## Index

### theory/
- [01-primitive-types.md](theory/01-primitive-types.md) — string, number, boolean, null, undefined, bigint, symbol
- [02-array-vs-tuple-types.md](theory/02-array-vs-tuple-types.md) — T[] vs Array<T>, readonly arrays, tuples with optional/rest elements
- [03-any-unknown-never-void.md](theory/03-any-unknown-never-void.md) — precise differences and correct usage of each
- [04-object-type-shorthand.md](theory/04-object-type-shorthand.md) — inline object types and structural typing
- [05-type-annotations-vs-inference.md](theory/05-type-annotations-vs-inference.md) — when to annotate, when to trust inference

### snippets/
- [01-primitive-basics.md](snippets/01-primitive-basics.md) — all seven primitives declared
- [02-array-declarations.md](snippets/02-array-declarations.md) — T[], Array<T>, readonly arrays
- [03-tuple-basics.md](snippets/03-tuple-basics.md) — labeled tuple as a `[value, error]` result pair
- [04-unknown-narrowing.md](snippets/04-unknown-narrowing.md) — safely narrowing `unknown` before use
- [05-never-exhaustiveness.md](snippets/05-never-exhaustiveness.md) — `never` in an exhaustive switch
- [06-void-callback.md](snippets/06-void-callback.md) — `void` callback accepting a function with a real return value

### output-based/
- [01-array-literal-widening.md](output-based/01-array-literal-widening.md) — let vs const literal widening
- [02-tuple-vs-array-assignment.md](output-based/02-tuple-vs-array-assignment.md) — array literal return vs tuple target
- [03-any-swallows-errors.md](output-based/03-any-swallows-errors.md) — `any` hides a type mismatch until runtime
- [04-unknown-vs-any-assignment.md](output-based/04-unknown-vs-any-assignment.md) — assignability asymmetry between any/unknown
- [05-never-return-type.md](output-based/05-never-return-type.md) — syntactic vs value-based reachability for `never`
- [06-void-return-still-value.md](output-based/06-void-return-still-value.md) — void callbacks can return a value
- [07-const-vs-let-inference.md](output-based/07-const-vs-let-inference.md) — object property widening despite `const`

### scenarios/
- [01-typing-fetch-response.md](scenarios/01-typing-fetch-response.md) — safely typing a `fetch().json()` response
- [02-csv-row-tuple.md](scenarios/02-csv-row-tuple.md) — modeling a parsed CSV row with a tuple
- [03-form-field-values.md](scenarios/03-form-field-values.md) — typing dynamic form values from the DOM
- [04-config-object-inference.md](scenarios/04-config-object-inference.md) — locking in literal types with `as const`

### interview-qa/
- [01-any-unknown-never-void-qa.md](interview-qa/01-any-unknown-never-void-qa.md) — 4 Q&A pairs on the special types
- [02-arrays-tuples-qa.md](interview-qa/02-arrays-tuples-qa.md) — 4 Q&A pairs on arrays and tuples
- [03-inference-annotation-qa.md](interview-qa/03-inference-annotation-qa.md) — 4 Q&A pairs on inference vs annotation

### problems/
- [01-safe-narrow-unknown.md](problems/01-safe-narrow-unknown.md) — type a function's parameters/return using `unknown` and narrow safely
- [02-csv-row-tuple-type.md](problems/02-csv-row-tuple-type.md) — tuple type for a fixed CSV-row shape plus a destructuring function
- [03-assert-never-helper.md](problems/03-assert-never-helper.md) — type-safe `assertNever` exhaustiveness-check helper

### assets/
- [README.md](assets/README.md) — placeholder for original notes
