# Interview Q&A: prototype chain fundamentals

**Q: Explain the prototype chain and how property lookup works.**
Every object has an internal `[[Prototype]]` reference to another object (or `null`). When you access a property, the engine first checks the object's own properties; if not found, it follows `[[Prototype]]` to the next object and checks there, repeating until it finds the property or reaches an object whose prototype is `null`. This is how shared methods (like array methods or `Object.prototype.toString`) work without being duplicated on every instance.

**Q: What's the difference between `__proto__`, `Object.getPrototypeOf`, and `Constructor.prototype`?**
`__proto__` and `Object.getPrototypeOf`/`setPrototypeOf` both get/set an *instance's* internal `[[Prototype]]` — `__proto__` is a legacy accessor (Annex B, web-compat only), while the `Object.*` functions are the standard, recommended API. `Constructor.prototype` is different: it's a plain object property that lives *on a function*, and it's the object that becomes the `[[Prototype]]` of instances created via `new Constructor()`. Instances don't have a `.prototype` property themselves.

**Q: How does `instanceof` relate to the prototype chain?**
`obj instanceof Constructor` checks whether `Constructor.prototype` appears anywhere in `obj`'s prototype chain, by walking `[[Prototype]]` links and comparing each one against `Constructor.prototype`. It's a chain-membership test, not a check of what function originally created the object — which is why reassigning `Constructor.prototype` after instances exist breaks `instanceof` for those older instances.
