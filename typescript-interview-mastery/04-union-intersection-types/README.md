# 04 — Union & Intersection Types

Union types (`|`) and intersection types (`&`) let you compose new types out of existing ones in two opposite directions: unions describe "one of several alternatives" (with member access restricted to common properties until narrowed), while intersections describe "all of these requirements simultaneously" (with every member always accessible, but the value set they describe is strictly smaller). This module builds up to the single most practically important pattern in the entire curriculum — discriminated unions, where a shared literal "tag" property enables exhaustive, compiler-verified narrowing via `switch`. It also covers how intersections merge object properties (and the `never`-producing conflict case), the set-theoretic relationship between unions and intersections of the same two types, and literal type unions as a lightweight, zero-runtime-cost alternative to `enum`.

## What's covered

- How unions restrict member access to common properties until narrowed, and the standard narrowing techniques
- How intersections merge object properties, including the `never`-producing conflict case for incompatible primitives
- Discriminated unions: shared literal tag properties, switch-based narrowing, and exhaustiveness checking with `never`
- The set-theoretic difference between a union of interfaces and an intersection of the same interfaces
- Literal type unions as a lightweight, zero-runtime `enum` alternative

## Index

### theory/
- [01-union-types-and-narrowing.md](theory/01-union-types-and-narrowing.md) — union member access rules and narrowing techniques
- [02-intersection-types.md](theory/02-intersection-types.md) — object property merging, conflicts, distribution over unions
- [03-discriminated-unions.md](theory/03-discriminated-unions.md) — shared discriminant, switch narrowing, exhaustiveness checking
- [04-union-vs-intersection-of-interfaces.md](theory/04-union-vs-intersection-of-interfaces.md) — set-theoretic framing of | vs &
- [05-literal-unions-as-enums.md](theory/05-literal-unions-as-enums.md) — literal unions vs enum, const-object pattern

### snippets/
- [01-basic-union-narrowing.md](snippets/01-basic-union-narrowing.md) — typeof narrowing on a string | number union
- [02-basic-intersection.md](snippets/02-basic-intersection.md) — HasId & HasName combined
- [03-discriminated-union-switch.md](snippets/03-discriminated-union-switch.md) — Shape discriminated union with area calculation
- [04-in-operator-narrowing.md](snippets/04-in-operator-narrowing.md) — in operator distinguishing contact shapes
- [05-literal-union-status.md](snippets/05-literal-union-status.md) — TaskStatus literal union as a state machine
- [06-intersecting-union-with-shared-field.md](snippets/06-intersecting-union-with-shared-field.md) — & distributing across a union

### output-based/
- [01-union-member-access-error.md](output-based/01-union-member-access-error.md) — accessing a non-common property fails
- [02-intersection-conflict-never.md](output-based/02-intersection-conflict-never.md) — conflicting discriminant literals intersect to never
- [03-exhaustiveness-catches-new-member.md](output-based/03-exhaustiveness-catches-new-member.md) — a new union member breaks the never check
- [04-union-vs-intersection-assignability.md](output-based/04-union-vs-intersection-assignability.md) — asymmetric assignability between | and &
- [05-literal-widening-in-union-context.md](output-based/05-literal-widening-in-union-context.md) — inferred return type widens past a literal union
- [06-in-narrowing-with-optional-property.md](output-based/06-in-narrowing-with-optional-property.md) — in operator vs explicit undefined check
- [07-excess-property-check-with-union.md](output-based/07-excess-property-check-with-union.md) — excess property check against the matched union branch

### scenarios/
- [01-api-response-discriminated-union.md](scenarios/01-api-response-discriminated-union.md) — generic ApiResponse<T> discriminated union
- [02-timestamped-identifiable-mixin.md](scenarios/02-timestamped-identifiable-mixin.md) — reusable mixin shapes via intersection
- [03-form-validation-states.md](scenarios/03-form-validation-states.md) — form field validation state machine
- [04-permission-flags-intersection.md](scenarios/04-permission-flags-intersection.md) — composing route-guard permission requirements

### interview-qa/
- [01-unions-qa.md](interview-qa/01-unions-qa.md) — 4 Q&A pairs on union access and narrowing
- [02-intersections-qa.md](interview-qa/02-intersections-qa.md) — 4 Q&A pairs on intersection merging and conflicts
- [03-discriminated-unions-and-literals-qa.md](interview-qa/03-discriminated-unions-and-literals-qa.md) — 4 Q&A pairs on exhaustiveness and literal unions

### problems/
- [01-api-response-exhaustive-handler.md](problems/01-api-response-exhaustive-handler.md) — ApiResponse<T> discriminated union with exhaustive handler
- [02-timestamped-identifiable-intersection.md](problems/02-timestamped-identifiable-intersection.md) — Timestamped & Identifiable mixin composition
- [03-discriminant-type-guard.md](problems/03-discriminant-type-guard.md) — generic type guard narrowing by discriminant

### assets/
- [README.md](assets/README.md) — placeholder for original notes
