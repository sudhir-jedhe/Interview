# Interview Q&A: privacy and encapsulation

**Q: How do private `#` fields differ from a `_prefix` naming convention?**
`#` fields are enforced by the language itself — accessing `obj.#field` from outside the class body is a `SyntaxError`, and the field doesn't appear in `Object.keys`, `JSON.stringify`, or `for...in`. A `_field` convention is purely a social contract; it's fully public, readable, and writable from anywhere, and shows up in normal enumeration — it signals "don't touch this" without actually preventing it.

**Q: How do the four OOP pillars map onto JavaScript?**
Encapsulation is `#` private fields/methods (or closures in factory functions) hiding internal state. Abstraction is exposing a minimal public API (methods, getters) while hiding implementation details behind it. Inheritance is `extends` and the prototype chain. Polymorphism is method overriding combined with JS's dynamic, prototype-based method resolution — calling the same method name on different subclass instances runs each one's own implementation automatically.

**Q: What's the difference between a getter and a regular field for exposing computed data?**
A getter (`get value() {...}`) runs a function every time it's accessed but is used with plain property syntax (`obj.value`, no parentheses) — perfect for values derived from other state that should always stay in sync. A regular field stores a static value that must be manually kept up to date whenever underlying data changes, risking staleness if you forget to update it everywhere it's set.
