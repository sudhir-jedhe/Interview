# 05 — Generics

Generics let you write functions, interfaces, and classes that work across many types while keeping full type safety, instead of choosing between duplicated per-type code and the "give up and use `any`" escape hatch. This topic covers how generic type parameters are inferred and constrained, how `keyof` combines with generics for type-safe property access, and why generics preserve type information through a function call in a way `any` fundamentally cannot. It closes with hands-on problems — a generic `Stack`, a type-safe `groupBy`, and a `Result<T, E>` wrapper — that show these ideas applied to code you'd actually write in production.

## What's covered

- Generic functions and how type argument inference works
- Generic constraints (`T extends SomeShape`) and the `object` constraint gotcha
- Generic interfaces, type aliases, and classes
- Default generic parameters and multiple type parameters
- `keyof` combined with generics for type-safe property access (`get<T, K extends keyof T>`)
- Why generics preserve type information that `any` throws away

## Index

### theory/
- [01-generic-functions.md](theory/01-generic-functions.md) — type parameter basics, inference vs explicit type arguments
- [02-generic-constraints.md](theory/02-generic-constraints.md) — `extends`, `keyof` constraints, the `object` gotcha
- [03-generic-interfaces-types-classes.md](theory/03-generic-interfaces-types-classes.md) — parameterizing interfaces, type aliases, and classes
- [04-default-and-multiple-type-parameters.md](theory/04-default-and-multiple-type-parameters.md) — `<T = Default>`, ordering rules, multi-parameter design
- [05-keyof-with-generics.md](theory/05-keyof-with-generics.md) — `get<T, K extends keyof T>(obj: T, key: K): T[K]` in depth
- [06-why-generics-beat-any.md](theory/06-why-generics-beat-any.md) — before/after comparison, why `any` is contagious and generics aren't

### snippets/
- [01-identity-function.md](snippets/01-identity-function.md)
- [02-swap-tuple.md](snippets/02-swap-tuple.md)
- [03-filter-by-predicate.md](snippets/03-filter-by-predicate.md)
- [04-generic-key-lookup.md](snippets/04-generic-key-lookup.md)
- [05-generic-box-class.md](snippets/05-generic-box-class.md)
- [06-merge-two-objects.md](snippets/06-merge-two-objects.md)
- [07-default-type-parameter.md](snippets/07-default-type-parameter.md)

### output-based/
- [01-inferred-union-widening.md](output-based/01-inferred-union-widening.md)
- [02-keyof-rejects-dynamic-string.md](output-based/02-keyof-rejects-dynamic-string.md)
- [03-generic-class-field-reassignment.md](output-based/03-generic-class-field-reassignment.md)
- [04-extends-object-allows-arrays.md](output-based/04-extends-object-allows-arrays.md)
- [05-covariance-array-push.md](output-based/05-covariance-array-push.md)
- [06-default-param-with-inference-conflict.md](output-based/06-default-param-with-inference-conflict.md)
- [07-method-generic-vs-class-generic.md](output-based/07-method-generic-vs-class-generic.md)

### scenarios/
- [01-generic-api-client.md](scenarios/01-generic-api-client.md) — a reusable, fully-typed `fetch` wrapper
- [02-generic-repository-pattern.md](scenarios/02-generic-repository-pattern.md) — one `Repository<T>` shared across entity types
- [03-generic-form-state-hook.md](scenarios/03-generic-form-state-hook.md) — type-safe `setField` for any form shape

### interview-qa/
- [01-fundamentals.md](interview-qa/01-fundamentals.md)
- [02-constraints-and-keyof.md](interview-qa/02-constraints-and-keyof.md)
- [03-generics-vs-any.md](interview-qa/03-generics-vs-any.md)

### problems/
- [01-generic-stack.md](problems/01-generic-stack.md) — implement `Stack<T>` with push/pop/peek
- [02-type-safe-groupby.md](problems/02-type-safe-groupby.md) — implement `groupBy<T, K extends keyof T>`
- [03-result-type.md](problems/03-result-type.md) — implement `Result<T, E>` and a safe unwrap

### assets/
- [README.md](assets/README.md)
