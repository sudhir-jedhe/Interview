# Interview Q&A: instanceof and alternatives

**Q: How does `instanceof` actually work?**
`obj instanceof Ctor` walks `obj`'s prototype chain (`[[Prototype]]` links) and checks whether `Ctor.prototype` appears anywhere in it, returning `true` on the first match and `false` if it reaches `null` without finding it. It's purely a chain-membership test — it doesn't check which function literally constructed the object, which is why manually reassigning an object's prototype with `Object.setPrototypeOf` can change what it's an `instanceof`.

**Q: When would you choose a factory function over a class?**
When you want closure-based private state without dealing with `this`-binding footguns (methods detached from their object and called standalone lose `this` with classes, but closures capture variables directly with no binding issues). Factory functions are also handy for cheap, throwaway objects that don't need `instanceof` support or a formal type hierarchy.
