# Classes & OOP

JavaScript's `class` syntax is syntactic sugar over the same prototype-based inheritance covered in the previous topic — it doesn't introduce a new object model, just a cleaner surface for one. This topic covers how classes desugar to prototypes and constructor functions, how instance and static members differ, how `extends`/`super` wire up inheritance, and the newer features (private fields with `#`, getters/setters) that make encapsulation practical in real code. It also compares the three common ways to build reusable object structures in JS — classes, raw prototypes, and factory functions — since interviewers frequently ask you to justify picking one over another.

What's covered:
- Class syntax as sugar over prototypes (constructor, methods, statics, fields)
- Instance vs static methods and fields
- `extends` / `super` and method overriding
- Private fields and methods with `#`
- Getters and setters
- The four OOP pillars (encapsulation, abstraction, inheritance, polymorphism) as they map to JS
- Class-based vs prototype-based inheritance vs factory functions — trade-offs
- `instanceof` and how it actually works

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
