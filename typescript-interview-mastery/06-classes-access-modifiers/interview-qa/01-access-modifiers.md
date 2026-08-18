# Access modifiers

**Q: What's the practical difference between `private` and `protected`?**
A: `private` members are visible only inside the declaring class itself — not even subclasses can access them. `protected` members are visible inside the declaring class and any subclass, but still not from outside code. Use `protected` specifically when subclasses genuinely need direct access to that member; otherwise `private` communicates a tighter, safer contract.

**Q: Is `private` in TypeScript enforced at runtime?**
A: No. It's a compile-time-only check performed by `tsc`. The compiled JavaScript output has an ordinary property with no protection at all — it's readable and writable via bracket notation (`instance["fieldName"]`), and completely unprotected if the code is consumed as plain JavaScript, bypassing the TypeScript compiler entirely.

**Q: When would you choose JavaScript's `#field` over TypeScript's `private`?**
A: When the privacy requirement is a genuine correctness or security concern rather than a team-convention concern — data that must never be visible via `Object.keys`, `JSON.stringify`, bracket-notation probing, or by any code that isn't the class itself, even code written carelessly or maliciously. `#field` is enforced by the JavaScript engine itself, with no escape hatch, whereas `private` only stops accidental misuse caught by the type checker.

**Q: Does `readonly` mean the same thing as `const`?**
A: No. `const` applies to variable bindings — you can't reassign the variable, but if it holds an object, the object's properties remain mutable. `readonly` applies to class fields (or object type properties) — you can't reassign that specific property after its initial assignment, but it doesn't automatically make anything the property points to (like an array or nested object) immutable, unless you additionally type it as `ReadonlyArray<T>` or use something like `Object.freeze` at runtime.
