# 02 — Interfaces & Type Aliases

`interface` and `type` are the two ways TypeScript lets you name a shape, and while they overlap heavily for plain object types, they diverge in important, frequently-interviewed ways: interfaces support declaration merging and eager conflict-checking on `extends`, while type aliases are the only way to express unions, tuples, and other non-object types. This module covers both syntaxes, the optional/readonly property modifiers, index signatures for dynamic-key dictionaries (and their well-known soundness gap), and multi-interface extension for composing domain models from smaller mixin shapes. Every topic here is grounded in structural typing — TypeScript compares shapes, not declared names, so understanding when the *declaration mechanism* actually matters (versus when it's purely stylistic) is the core skill being tested.

## What's covered

- `interface` vs `type` syntax for object shapes, and what only `type` can express (unions, tuples, primitives)
- Declaration merging (interfaces only) and how it powers third-party type augmentation
- `interface extends` vs type-alias `&` intersection, including the eager-vs-lazy conflict-detection difference
- Optional (`?`) and `readonly` property modifiers, and their non-recursive nature
- Index signatures for dynamic-key dictionaries and their arbitrary-key-access limitation
- Extending multiple interfaces at once to compose mixin-style shapes

## Index

### theory/
- [01-interface-vs-type-alias-syntax.md](theory/01-interface-vs-type-alias-syntax.md) — basic syntax and what each can/can't express
- [02-declaration-merging-and-extension.md](theory/02-declaration-merging-and-extension.md) — merging, extends vs &, conflict detection
- [03-optional-and-readonly-properties.md](theory/03-optional-and-readonly-properties.md) — ?, readonly, and their limits
- [04-index-signatures.md](theory/04-index-signatures.md) — dynamic-key dictionaries and their limitation
- [05-extending-multiple-interfaces.md](theory/05-extending-multiple-interfaces.md) — composing mixin shapes via multi-extends

### snippets/
- [01-basic-interface.md](snippets/01-basic-interface.md) — Product interface with optional/readonly fields
- [02-basic-type-alias.md](snippets/02-basic-type-alias.md) — literal union plus object shape alias
- [03-declaration-merging.md](snippets/03-declaration-merging.md) — two AppEvents declarations merging
- [04-index-signature-dictionary.md](snippets/04-index-signature-dictionary.md) — dynamic page-view count dictionary
- [05-extending-interfaces.md](snippets/05-extending-interfaces.md) — Admin extends User
- [06-intersection-type-alias.md](snippets/06-intersection-type-alias.md) — Timestamped & Comment

### output-based/
- [01-excess-property-check.md](output-based/01-excess-property-check.md) — fresh object literal excess property error
- [02-interface-merging-conflict.md](output-based/02-interface-merging-conflict.md) — conflicting merged interface property
- [03-type-alias-intersection-never.md](output-based/03-type-alias-intersection-never.md) — & conflict resolving to never
- [04-readonly-array-vs-readonly-property.md](output-based/04-readonly-array-vs-readonly-property.md) — readonly binding vs readonly contents
- [05-index-signature-arbitrary-access.md](output-based/05-index-signature-arbitrary-access.md) — unchecked index access at runtime
- [06-structural-assignability-across-declarations.md](output-based/06-structural-assignability-across-declarations.md) — interface/type structural compatibility

### scenarios/
- [01-modeling-user-and-admin.md](scenarios/01-modeling-user-and-admin.md) — layered domain plus third-party augmentation
- [02-dynamic-translation-dictionary.md](scenarios/02-dynamic-translation-dictionary.md) — i18n dictionary with defensive lookup
- [03-composing-mixin-shapes.md](scenarios/03-composing-mixin-shapes.md) — Timestamped/SoftDeletable composed into entities
- [04-api-response-shape-choice.md](scenarios/04-api-response-shape-choice.md) — choosing interface vs type per API client type

### interview-qa/
- [01-interface-vs-type-qa.md](interview-qa/01-interface-vs-type-qa.md) — 4 Q&A pairs on core differences
- [02-modifiers-and-index-signatures-qa.md](interview-qa/02-modifiers-and-index-signatures-qa.md) — 4 Q&A pairs on ?, readonly, index signatures
- [03-extension-composition-qa.md](interview-qa/03-extension-composition-qa.md) — 4 Q&A pairs on extends/& composition

### problems/
- [01-user-admin-declaration-merging.md](problems/01-user-admin-declaration-merging.md) — model User/Admin, demonstrate declaration merging
- [02-index-signature-dictionary-limitation.md](problems/02-index-signature-dictionary-limitation.md) — dictionary type and its arbitrary-key-access limitation
- [03-union-to-interfaces-conversion.md](problems/03-union-to-interfaces-conversion.md) — convert a union to interfaces, explain what's impossible

### assets/
- [README.md](assets/README.md) — placeholder for original notes
