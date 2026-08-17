# Interview Questions: Classes & OOP

**Q: Is `class` in JavaScript a new object model, or sugar over something else?**
It's syntactic sugar over JavaScript's existing prototype-based inheritance. A class declaration creates a function (the constructor), and instance methods are attached to that function's `.prototype`, exactly as with pre-ES6 constructor functions. It adds real new capabilities on top though — strict mode by default, private `#` fields, and a hard requirement to use `new` — so it's not purely cosmetic.

**Q: What's the difference between instance fields and static fields?**
Instance fields are initialized per-object, typically in or alongside the constructor, and are only accessible via an instance (`this.field` or `obj.field`). Static fields live on the class itself, are shared across all instances, and are accessed via `Class.field` — they're conceptually class-level state, like a counter of how many instances were created.

**Q: How does `extends` set up inheritance under the hood?**
`extends` does two things: it sets `Subclass.prototype`'s internal `[[Prototype]]` to `Superclass.prototype` (so instance method lookup falls through correctly), and it sets `Subclass`'s own `[[Prototype]]` to `Superclass` itself (so static members are inherited too). This is why both instance methods and static methods are inherited when you extend a class.

**Q: Why must you call `super()` before using `this` in a subclass constructor?**
In a derived class, `this` isn't initialized until the parent constructor runs — calling `super()` is what actually creates and binds `this`. Referencing `this` before that call throws a `ReferenceError` because there's nothing there yet to reference. Base (non-derived) classes don't have this restriction since they create `this` themselves.

**Q: How do private `#` fields differ from a `_prefix` naming convention?**
`#` fields are enforced by the language itself — accessing `obj.#field` from outside the class body is a `SyntaxError`, and the field doesn't appear in `Object.keys`, `JSON.stringify`, or `for...in`. A `_field` convention is purely a social contract; it's fully public, readable, and writable from anywhere, and shows up in normal enumeration — it signals "don't touch this" without actually preventing it.

**Q: How do the four OOP pillars map onto JavaScript?**
Encapsulation is `#` private fields/methods (or closures in factory functions) hiding internal state. Abstraction is exposing a minimal public API (methods, getters) while hiding implementation details behind it. Inheritance is `extends` and the prototype chain. Polymorphism is method overriding combined with JS's dynamic, prototype-based method resolution — calling the same method name on different subclass instances runs each one's own implementation automatically.

**Q: What's the difference between overriding a method and shadowing a property?**
Overriding a method means a subclass defines a method with the same name, and since instance method lookup goes through the prototype chain at call time, the subclass version is found first and "wins" — but `super.method()` can still reach the parent's version explicitly. Shadowing a property is similar for plain data properties (own property found before inherited), but there's no equivalent to `super` for reading a shadowed data field — you'd need to store it separately or use accessor properties.

**Q: When would you choose a factory function over a class?**
When you want closure-based private state without dealing with `this`-binding footguns (methods detached from their object and called standalone lose `this` with classes, but closures capture variables directly with no binding issues). Factory functions are also handy for cheap, throwaway objects that don't need `instanceof` support or a formal type hierarchy.

**Q: How does `instanceof` actually work?**
`obj instanceof Ctor` walks `obj`'s prototype chain (`[[Prototype]]` links) and checks whether `Ctor.prototype` appears anywhere in it, returning `true` on the first match and `false` if it reaches `null` without finding it. It's purely a chain-membership test — it doesn't check which function literally constructed the object, which is why manually reassigning an object's prototype with `Object.setPrototypeOf` can change what it's an `instanceof`.

**Q: Can you have multiple inheritance in JavaScript classes?**
No — `extends` only accepts a single superclass. The common workaround is mixins: functions that take a base class and return a new class extending it with additional methods, which you can chain (`class Foo extends MixinA(MixinB(Base))`) to compose multiple independent behaviors without a true multiple-inheritance diamond problem.

**Q: What happens if a subclass doesn't define a constructor?**
JavaScript implicitly provides a default constructor that just calls `super(...args)` and forwards all arguments to the parent constructor. This is only a shorthand for the common case — if you need to do anything extra (initialize new fields, validate arguments) you must write an explicit constructor and call `super()` yourself.

**Q: What's the difference between a getter and a regular field for exposing computed data?**
A getter (`get value() {...}`) runs a function every time it's accessed but is used with plain property syntax (`obj.value`, no parentheses) — perfect for values derived from other state that should always stay in sync. A regular field stores a static value that must be manually kept up to date whenever underlying data changes, risking staleness if you forget to update it everywhere it's set.
