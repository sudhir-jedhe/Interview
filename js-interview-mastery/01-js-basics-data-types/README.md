## JS Basics & Data Types

JavaScript has two categories of types: primitives (string, number, boolean, null, undefined, symbol, bigint), which are copied by value, and reference types (object, array, function), which are copied by reference. Understanding this split explains a huge amount of "weird" JS behavior — why mutating an object inside a function affects the caller, why `typeof null` lies, and why `NaN !== NaN`. This topic is foundational: almost every later topic (closures, `this`, async) assumes you're fluent in how values are stored, compared, and passed around. Interviewers use this area to check for precision, not memorization — they want to see you reason about *why* something behaves the way it does, not just recite a rule.

**What's covered:**
- Primitive types vs reference types and how each is stored/copied
- `typeof` operator and its well-known quirks
- `null` vs `undefined` — semantic and practical differences
- `NaN`, `Number.isNaN` vs global `isNaN`
- Template literals
- Value semantics vs reference semantics (copying primitives vs objects)

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
