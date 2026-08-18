# 09 — Utility Types

TypeScript's built-in utility types let you derive new types from existing ones instead of hand-writing (and maintaining) duplicate shapes. This topic covers the twelve most commonly used utilities — object-shape transformers (`Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`), union filters (`Exclude`, `Extract`, `NonNullable`), and function/promise extractors (`ReturnType`, `Parameters`, `Awaited`) — along with the mapped-type and conditional-type mechanics that make them work. Every utility is demonstrated with a realistic use case, and several are reimplemented from scratch to prove the mechanism isn't magic. This is one of the highest-yield interview topics: expect at least one "implement `Pick` yourself" or "derive a DTO from a full model" question in any mid-to-senior TypeScript interview.

## What's covered

- What each of the 12 utility types does and when to reach for it
- How `Partial`, `Pick`, `Omit`, and friends are implemented under the hood using mapped types and conditional types
- The `Pick` (allowlist) vs. `Omit` (blocklist) trade-off for security- and API-boundary-sensitive types
- `Record` for exhaustive lookup tables vs. loose index signatures
- `Exclude`/`Extract` for filtering unions vs. `Omit` for filtering object keys — a common source of bugs
- `ReturnType`/`Parameters`/`Awaited` for deriving types from function and promise signatures without redeclaring them
- Common gotchas: shallow vs. deep transformations, `Omit` misused on unions, `ReturnType` on overloaded functions, nested `Awaited` unwrapping

## Index

### theory/
- [01-object-shape-utilities.md](theory/01-object-shape-utilities.md) — `Partial`, `Required`, `Readonly`
- [02-pick-omit-record.md](theory/02-pick-omit-record.md) — `Pick`, `Omit`, `Record`
- [03-union-filtering-utilities.md](theory/03-union-filtering-utilities.md) — `Exclude`, `Extract`, `NonNullable`
- [04-function-type-utilities.md](theory/04-function-type-utilities.md) — `ReturnType`, `Parameters`, `Awaited`
- [05-how-utility-types-work-under-the-hood.md](theory/05-how-utility-types-work-under-the-hood.md) — the mapped-type/conditional-type mechanism behind all of them

### snippets/
- [01-partial-required-readonly.md](snippets/01-partial-required-readonly.md)
- [02-pick-omit.md](snippets/02-pick-omit.md)
- [03-record.md](snippets/03-record.md)
- [04-exclude-extract-nonnullable.md](snippets/04-exclude-extract-nonnullable.md)
- [05-returntype-parameters.md](snippets/05-returntype-parameters.md)
- [06-awaited.md](snippets/06-awaited.md)

### output-based/
- [01-partial-nested-objects.md](output-based/01-partial-nested-objects.md)
- [02-readonly-array-mutation.md](output-based/02-readonly-array-mutation.md)
- [03-pick-with-union-keys.md](output-based/03-pick-with-union-keys.md)
- [04-omit-with-generic-constraint.md](output-based/04-omit-with-generic-constraint.md)
- [05-record-missing-keys.md](output-based/05-record-missing-keys.md)
- [06-exclude-vs-omit.md](output-based/06-exclude-vs-omit.md)
- [07-returntype-of-overloaded-function.md](output-based/07-returntype-of-overloaded-function.md)
- [08-awaited-nested-promises.md](output-based/08-awaited-nested-promises.md)

### scenarios/
- [01-public-profile-from-user.md](scenarios/01-public-profile-from-user.md)
- [02-api-response-dto-with-pick-omit.md](scenarios/02-api-response-dto-with-pick-omit.md)
- [03-config-object-with-partial-record.md](scenarios/03-config-object-with-partial-record.md)
- [04-form-state-with-readonly-partial.md](scenarios/04-form-state-with-readonly-partial.md)

### interview-qa/
- [01-partial-required-readonly-qa.md](interview-qa/01-partial-required-readonly-qa.md)
- [02-pick-omit-record-qa.md](interview-qa/02-pick-omit-record-qa.md)
- [03-exclude-extract-nonnullable-qa.md](interview-qa/03-exclude-extract-nonnullable-qa.md)
- [04-returntype-parameters-awaited-qa.md](interview-qa/04-returntype-parameters-awaited-qa.md)

### problems/
- [01-derive-public-profile-type.md](problems/01-derive-public-profile-type.md) — derive a public profile type with `Pick`/`Omit`
- [02-type-a-function-wrapper.md](problems/02-type-a-function-wrapper.md) — type a wrapper with `ReturnType`/`Parameters`
- [03-implement-custom-partial-and-pick.md](problems/03-implement-custom-partial-and-pick.md) — implement `Partial` and `Pick` from scratch

### assets/
- [README.md](assets/README.md) — placeholder for original notes
