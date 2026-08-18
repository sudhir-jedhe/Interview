# Classes & OOP

JavaScript's `class` syntax is syntactic sugar over the same prototype-based inheritance covered in the previous topic — it doesn't introduce a new object model, just a cleaner surface for one. This topic covers how classes desugar to prototypes and constructor functions, how instance and static members differ, how `extends`/`super` wire up inheritance, and the newer features (private fields with `#`, getters/setters) that make encapsulation practical in real code. It also compares the three common ways to build reusable object structures in JS — classes, raw prototypes, and factory functions — since interviewers frequently ask you to justify picking one over another.

### Structure

- `from-your-notes/` — original standalone notes (OOP Concepts, SOLID in JavaScript) — untouched, kept as-is.
- `theory/` — concept write-ups: class syntax as prototype sugar, instance vs static members, `extends`/`super`/overriding, private fields & getters/setters, the four OOP pillars, and class vs prototype vs factory functions.
- `snippets/` — one short runnable example per file.
- `output-based/` — "what does this log?" questions with full explanations.
- `scenarios/` — realistic problems (a bank account with enforced invariants, a shape hierarchy, mixins for a game engine, duck-typed plugin validation) with worked solutions.
- `interview-qa/` — Q&A grouped into class fundamentals, inheritance & super, privacy & encapsulation, and instanceof & alternatives.
- `problems/` — hands-on implementation challenges with full solutions: classical prototype inheritance vs ES6 classes side by side, a mixin composition pattern, and an ORM-ish base class with a static factory and validation.
- `assets/` — placeholder for supporting images/PDFs from original notes.

**What's covered:**
- Class syntax as sugar over prototypes (constructor, methods, statics, fields)
- Instance vs static methods and fields
- `extends` / `super` and method overriding
- Private fields and methods with `#`
- Getters and setters
- The four OOP pillars (encapsulation, abstraction, inheritance, polymorphism) as they map to JS
- Class-based vs prototype-based inheritance vs factory functions — trade-offs
- `instanceof` and how it actually works
- Building classical prototype-based inheritance by hand, a mixin pattern, and a static-factory base class

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
