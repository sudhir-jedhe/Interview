# Interview Q&A: inheritance and super

**Q: How does `extends` set up inheritance under the hood?**
`extends` does two things: it sets `Subclass.prototype`'s internal `[[Prototype]]` to `Superclass.prototype` (so instance method lookup falls through correctly), and it sets `Subclass`'s own `[[Prototype]]` to `Superclass` itself (so static members are inherited too). This is why both instance methods and static methods are inherited when you extend a class.

**Q: Why must you call `super()` before using `this` in a subclass constructor?**
In a derived class, `this` isn't initialized until the parent constructor runs — calling `super()` is what actually creates and binds `this`. Referencing `this` before that call throws a `ReferenceError` because there's nothing there yet to reference. Base (non-derived) classes don't have this restriction since they create `this` themselves.

**Q: What's the difference between overriding a method and shadowing a property?**
Overriding a method means a subclass defines a method with the same name, and since instance method lookup goes through the prototype chain at call time, the subclass version is found first and "wins" — but `super.method()` can still reach the parent's version explicitly. Shadowing a property is similar for plain data properties (own property found before inherited), but there's no equivalent to `super` for reading a shadowed data field — you'd need to store it separately or use accessor properties.

**Q: Can you have multiple inheritance in JavaScript classes?**
No — `extends` only accepts a single superclass. The common workaround is mixins: functions that take a base class and return a new class extending it with additional methods, which you can chain (`class Foo extends MixinA(MixinB(Base))`) to compose multiple independent behaviors without a true multiple-inheritance diamond problem.
