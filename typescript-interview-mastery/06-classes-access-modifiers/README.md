# 06 — Classes & Access Modifiers

TypeScript classes extend JavaScript's class syntax with compile-time visibility (`public`/`private`/`protected`), `readonly` fields, abstract classes, and typed accessors — all of which are checked by `tsc` but mostly erased from the compiled output, which is the single most important nuance in this topic. This section walks through parameter property shorthand, the real difference between TypeScript's `private` and JavaScript's runtime-enforced `#field`, abstract classes as a middle ground between interfaces and full implementations, and what happens when a class implements two interfaces with colliding members. The problems apply all of this directly: an abstract `Shape` hierarchy, a working demonstration of `private` vs `#private`, and a genuine interface-conflict scenario with its fix.

## What's covered

- Constructor parameter properties (`constructor(private name: string)`) as sugar for field + assignment
- `public`/`private`/`protected` and why they're compile-time only (bracket-notation escape hatch)
- JavaScript's native `#field` as true runtime-private, contrasted directly with TS `private`
- `readonly` class fields and the difference from `const` and from `ReadonlyArray<T>`
- Abstract classes and abstract methods, and when to prefer them over interfaces
- Implementing interfaces with classes, structural typing, and multi-interface member conflicts
- Static members and getters/setters, including their type implications

## Index

### theory/
- [01-class-syntax-and-parameter-properties.md](theory/01-class-syntax-and-parameter-properties.md)
- [02-public-private-protected.md](theory/02-public-private-protected.md)
- [03-js-private-fields-vs-ts-private.md](theory/03-js-private-fields-vs-ts-private.md)
- [04-readonly-and-abstract.md](theory/04-readonly-and-abstract.md)
- [05-implementing-interfaces.md](theory/05-implementing-interfaces.md)
- [06-static-members-getters-setters.md](theory/06-static-members-getters-setters.md)

### snippets/
- [01-parameter-properties.md](snippets/01-parameter-properties.md)
- [02-static-counter.md](snippets/02-static-counter.md)
- [03-getter-setter-validation.md](snippets/03-getter-setter-validation.md)
- [04-js-hash-private.md](snippets/04-js-hash-private.md)
- [05-abstract-method-dispatch.md](snippets/05-abstract-method-dispatch.md)
- [06-protected-inheritance.md](snippets/06-protected-inheritance.md)

### output-based/
- [01-private-bracket-access.md](output-based/01-private-bracket-access.md)
- [02-readonly-array-mutation.md](output-based/02-readonly-array-mutation.md)
- [03-abstract-instantiation.md](output-based/03-abstract-instantiation.md)
- [04-static-vs-instance-this.md](output-based/04-static-vs-instance-this.md)
- [05-protected-constructor-subclass.md](output-based/05-protected-constructor-subclass.md)
- [06-interface-implements-structural.md](output-based/06-interface-implements-structural.md)
- [07-getter-only-assignment.md](output-based/07-getter-only-assignment.md)

### scenarios/
- [01-shape-hierarchy.md](scenarios/01-shape-hierarchy.md) — abstract base class for a diagramming tool
- [02-secure-credential-store.md](scenarios/02-secure-credential-store.md) — why `#field` beats `private` for real secrets
- [03-plugin-system-interfaces.md](scenarios/03-plugin-system-interfaces.md) — multi-interface capability contracts

### interview-qa/
- [01-access-modifiers.md](interview-qa/01-access-modifiers.md)
- [02-abstract-classes-and-interfaces.md](interview-qa/02-abstract-classes-and-interfaces.md)
- [03-static-and-accessors.md](interview-qa/03-static-and-accessors.md)

### problems/
- [01-abstract-shape-class.md](problems/01-abstract-shape-class.md) — abstract `Shape` with two concrete subclasses
- [02-ts-private-vs-js-hash-private.md](problems/02-ts-private-vs-js-hash-private.md) — working demonstration of the runtime difference
- [03-two-interfaces-member-conflict.md](problems/03-two-interfaces-member-conflict.md) — a real conflict and its fix

### assets/
- [README.md](assets/README.md)
