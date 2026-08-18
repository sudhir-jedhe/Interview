# 10 — Advanced Types: Mapped and Conditional Types

This topic covers the two most powerful type-level mechanisms in TypeScript: mapped types (transforming every property of an object type, including renaming or filtering keys with `as`) and conditional types (branching on type relationships, extracting nested types with `infer`, and understanding how conditionals distribute over unions). It also covers template literal types, which build string-literal unions from other unions and are frequently combined with key remapping. Together these mechanisms are what all the utility types in topic 09 are built from — this topic goes one level deeper, showing you how to build your own. Expect interviewers to ask you to write a `DeepReadonly`, an `UnwrapPromise`, or a template-literal-based type live on a whiteboard or shared editor.

## What's covered

- Mapped type basics: `{ [K in keyof T]: ... }` and the `?`/`-?`, `readonly`/`-readonly` modifiers
- Key remapping with `as`: renaming keys and filtering keys out via `never`
- Conditional types: `T extends U ? X : Y`, chaining, and using them in generic constraints
- `infer`: capturing array element types, promise payloads, function return types and parameter tuples, and multiple captures in one pattern
- Distributive conditional types: why `Exclude`/`Extract`/`NonNullable` work member-by-member over unions, and how to opt out with `[T] extends [U]`
- Template literal types: building string unions from other unions, `Capitalize`/`Uppercase`/etc., combining with key remapping, and pattern-matching strings with `infer`
- Failure modes: shallow-only transformations, distribution surprises, template literal combinatorial explosion, incomplete `infer` function patterns

## Index

### theory/
- [01-mapped-types-basics-and-modifiers.md](theory/01-mapped-types-basics-and-modifiers.md)
- [02-key-remapping-with-as.md](theory/02-key-remapping-with-as.md)
- [03-conditional-types-fundamentals.md](theory/03-conditional-types-fundamentals.md)
- [04-infer-keyword.md](theory/04-infer-keyword.md)
- [05-distributive-conditional-types.md](theory/05-distributive-conditional-types.md)
- [06-template-literal-types.md](theory/06-template-literal-types.md)

### snippets/
- [01-mapped-type-basics.md](snippets/01-mapped-type-basics.md)
- [02-modifiers-plus-minus.md](snippets/02-modifiers-plus-minus.md)
- [03-key-remapping-as.md](snippets/03-key-remapping-as.md)
- [04-conditional-type-basic.md](snippets/04-conditional-type-basic.md)
- [05-infer-unwrap.md](snippets/05-infer-unwrap.md)
- [06-distributive-vs-non-distributive.md](snippets/06-distributive-vs-non-distributive.md)
- [07-template-literal-basic.md](snippets/07-template-literal-basic.md)

### output-based/
- [01-mapped-type-with-optional-modifier.md](output-based/01-mapped-type-with-optional-modifier.md)
- [02-key-remapping-filter-keys.md](output-based/02-key-remapping-filter-keys.md)
- [03-conditional-type-infer-array.md](output-based/03-conditional-type-infer-array.md)
- [04-infer-function-return.md](output-based/04-infer-function-return.md)
- [05-distributive-conditional-surprise.md](output-based/05-distributive-conditional-surprise.md)
- [06-non-distributive-tuple-trick.md](output-based/06-non-distributive-tuple-trick.md)
- [07-template-literal-union-explosion.md](output-based/07-template-literal-union-explosion.md)
- [08-nested-infer-promise.md](output-based/08-nested-infer-promise.md)

### scenarios/
- [01-deep-readonly-config.md](scenarios/01-deep-readonly-config.md)
- [02-event-handler-typing-with-template-literals.md](scenarios/02-event-handler-typing-with-template-literals.md)
- [03-api-response-unwrap-promise.md](scenarios/03-api-response-unwrap-promise.md)

### interview-qa/
- [01-mapped-types-qa.md](interview-qa/01-mapped-types-qa.md)
- [02-conditional-types-infer-qa.md](interview-qa/02-conditional-types-infer-qa.md)
- [03-distributive-and-template-literal-qa.md](interview-qa/03-distributive-and-template-literal-qa.md)

### problems/
- [01-deep-readonly.md](problems/01-deep-readonly.md) — implement `DeepReadonly<T>`
- [02-unwrap-promise.md](problems/02-unwrap-promise.md) — implement `UnwrapPromise<T>` with `infer`
- [03-css-property-template-literals.md](problems/03-css-property-template-literals.md) — generate CSS-like property names with template literal types

### assets/
- [README.md](assets/README.md) — placeholder for original notes
