# 07 — Enums & Literal Types

TypeScript offers two overlapping ways to model "a value from a fixed set of options": enums (numeric, string, or const) and plain literal-type unions, and the two behave differently enough — at both the type-checking level and the compiled-output level — that picking the right one is a real design decision, not a stylistic preference. This topic covers each enum variant's tradeoffs (especially the numeric-enum reverse-mapping bug), the `as const` technique for deriving literal unions from ordinary arrays and objects, and why modern TypeScript guidance generally favors literal unions for application code. The problems put this into practice: fixing a real reverse-mapping bug, deriving a union from a config object, and building a compile-checked exhaustive label map.

## What's covered

- Numeric enums: auto-increment, explicit values, and reverse mapping
- String enums: no reverse mapping, nominal typing, more predictable behavior
- `const enum`: compile-time inlining, zero runtime footprint, and the `isolatedModules` caveat
- `as const` and literal type inference from array/object literals
- Why literal-type unions are often preferred over enums in modern TypeScript
- Exhaustive `Record<T, V>` maps as a compile-time safety net for enums/unions

## Index

### theory/
- [01-numeric-enums.md](theory/01-numeric-enums.md)
- [02-string-enums.md](theory/02-string-enums.md)
- [03-const-enums.md](theory/03-const-enums.md)
- [04-as-const-and-literal-inference.md](theory/04-as-const-and-literal-inference.md)
- [05-literal-unions-vs-enums.md](theory/05-literal-unions-vs-enums.md)

### snippets/
- [01-numeric-enum-basic.md](snippets/01-numeric-enum-basic.md)
- [02-string-enum-basic.md](snippets/02-string-enum-basic.md)
- [03-const-enum-inlined.md](snippets/03-const-enum-inlined.md)
- [04-literal-union-type.md](snippets/04-literal-union-type.md)
- [05-as-const-array-to-union.md](snippets/05-as-const-array-to-union.md)
- [06-as-const-object-to-union.md](snippets/06-as-const-object-to-union.md)
- [07-exhaustive-label-map.md](snippets/07-exhaustive-label-map.md)

### output-based/
- [01-numeric-enum-accepts-any-number.md](output-based/01-numeric-enum-accepts-any-number.md)
- [02-string-enum-rejects-raw-string.md](output-based/02-string-enum-rejects-raw-string.md)
- [03-inserting-member-shifts-values.md](output-based/03-inserting-member-shifts-values.md)
- [04-as-const-missing-widens.md](output-based/04-as-const-missing-widens.md)
- [05-readonly-tuple-mutation-rejected.md](output-based/05-readonly-tuple-mutation-rejected.md)
- [06-record-forces-exhaustive-labels.md](output-based/06-record-forces-exhaustive-labels.md)
- [07-const-enum-isolated-modules.md](output-based/07-const-enum-isolated-modules.md)

### scenarios/
- [01-order-status-state-machine.md](scenarios/01-order-status-state-machine.md) — literal-union state machine with valid transitions
- [02-feature-flag-config.md](scenarios/02-feature-flag-config.md) — `as const` array as single source of truth
- [03-migrating-legacy-numeric-enum.md](scenarios/03-migrating-legacy-numeric-enum.md) — safe migration off a numeric enum with existing stored data

### interview-qa/
- [01-numeric-vs-string-enums.md](interview-qa/01-numeric-vs-string-enums.md)
- [02-const-enums-and-as-const.md](interview-qa/02-const-enums-and-as-const.md)
- [03-choosing-enums-vs-unions.md](interview-qa/03-choosing-enums-vs-unions.md)

### problems/
- [01-fix-numeric-enum-reverse-mapping-bug.md](problems/01-fix-numeric-enum-reverse-mapping-bug.md) — convert a buggy numeric enum to a literal union
- [02-derive-union-from-as-const-config.md](problems/02-derive-union-from-as-const-config.md) — `as const` config object to literal union
- [03-exhaustive-label-map-string-enum.md](problems/03-exhaustive-label-map-string-enum.md) — compile-checked `Record<EnumType, string>` label map

### assets/
- [README.md](assets/README.md)
