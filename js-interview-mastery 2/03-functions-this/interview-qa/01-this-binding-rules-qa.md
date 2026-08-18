# Interview Q&A — `this` Binding Rules

**Q: What are the four rules for determining `this` in JavaScript?**
In order of precedence, highest to lowest: (1) `new` binding — calling a function with `new` sets `this` to the newly created object; (2) explicit binding — `call`, `apply`, or `bind` set `this` directly; (3) implicit binding — calling a function as a method (`obj.method()`) sets `this` to the object before the dot; (4) default binding — a plain, unqualified function call sets `this` to the global object in non-strict mode, or `undefined` in strict mode.

**Q: What's the difference between `call`, `apply`, and how do they relate to `this`?**
Both `call` and `apply` invoke a function immediately with an explicitly specified `this`. `call` takes subsequent arguments individually (`fn.call(thisArg, a, b, c)`), while `apply` takes them as a single array (`fn.apply(thisArg, [a, b, c])`). Both are ways of implementing rule 3 (explicit binding) for `this`.

**Q: If you extract a method from an object and call it standalone, why does `this` break?**
`this` for a regular function is determined at call time by the call site, not by where the function was originally defined or attached. Extracting `const fn = obj.method` and calling `fn()` invokes it as a plain function call with no object before the dot, so implicit binding never applies — it falls through to default binding, giving `this` as the global object or `undefined`.

**Q: What's the difference between `this` in a regular function and `this` in a class method?**
Both use the same four `this`-binding rules, since class methods are just functions attached to the prototype (or instance, for class fields). The key practical difference is that class bodies are always implicitly in strict mode, so calling a class method as a detached, unbound function results in `this` being `undefined` rather than falling back to the global object.

**Q: Once you call `.bind()` on a function, can you re-bind it to a different `this` later?**
No — `bind()` produces a new function with a permanently fixed `this` (a "hard-bound" function). Calling `.bind()` again on that already-bound function creates yet another wrapper, but the original bound `this` still wins; you cannot override it with a later `bind`, `call`, or `apply`.
