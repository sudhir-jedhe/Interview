# JS Basics & Data Types

JavaScript has two categories of types: primitives (string, number, boolean, null, undefined, symbol, bigint), which are copied by value, and reference types (object, array, function), which are copied by reference. Understanding this split explains a huge amount of "weird" JS behavior — why mutating an object inside a function affects the caller, why `typeof null` lies, and why `NaN !== NaN`. This topic is foundational: almost every later topic (closures, `this`, async) assumes you're fluent in how values are stored, compared, and passed around. Interviewers use this area to check for precision, not memorization — they want to see you reason about *why* something behaves the way it does, not just recite a rule.

> Looking for your original notes on this? See `../SOURCE-MAP.md`.

## Folder structure

- **`theory/`** — concept-by-concept notes: primitive vs reference types, `typeof` and its quirks, `null` vs `undefined`, `NaN` and numeric checks, loose vs strict equality, and template literals.
- **`snippets/`** — 7 focused, runnable code examples, one per file.
- **`output-based/`** — 9 "predict the output" questions covering coercion, reference mutation, and equality gotchas, each with the answer and reasoning.
- **`scenarios/`** — 4 real-world engineering scenarios (preventing accidental mutation, validating numeric input, deep-equality for config objects, an `== null` linter policy), each with a worked approach.
- **`interview-qa/`** — 11 Q&A pairs grouped into 3 themed files: primitives/reference types/memory, `null`/`undefined`/`typeof`, and `NaN`/numeric checks/template literals.
- **`problems/`** — 3 hands-on coding challenges: a `deepEqual` implementation, a `getType` type-checking utility, and a circular-reference-safe JSON stringifier.
- **`assets/`** — placeholder for original images/PDFs (see `assets/README.md`).

## What's covered

- Primitive types vs reference types and how each is stored/copied
- `typeof` operator and its well-known quirks (`typeof null`, arrays, functions)
- `null` vs `undefined` — semantic and practical differences
- `NaN`, `Number.isNaN` vs global `isNaN`
- `==` vs `===`, and the accepted `value == null` exception
- Template literals
- Value semantics vs reference semantics (copying primitives vs objects)
- Hands-on: deep equality, precise type checking, and safe serialization of circular structures
