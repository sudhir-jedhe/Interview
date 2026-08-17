# Interview Questions: Objects & Prototypes

**Q: What is a property descriptor and what are its attributes?**
A property descriptor is the internal metadata record JavaScript keeps for every object property. For data properties it has four attributes: `value` (the actual data), `writable` (can it be reassigned), `enumerable` (does it show up in `for...in`/`Object.keys`/spread), and `configurable` (can it be deleted or have its descriptor changed). Accessor properties (getter/setter) replace `value`/`writable` with `get`/`set`. You inspect descriptors with `Object.getOwnPropertyDescriptor(obj, key)` and set them with `Object.defineProperty`.

**Q: What's the difference between `Object.freeze`, `Object.seal`, and `Object.preventExtensions`?**
`preventExtensions` only blocks adding new properties. `seal` does that plus makes existing properties non-configurable (no delete, no descriptor changes), but values stay writable. `freeze` does everything `seal` does plus makes existing data properties non-writable, making the object fully immutable at the top level. None of the three are recursive — nested objects remain fully mutable.

**Q: Explain the prototype chain and how property lookup works.**
Every object has an internal `[[Prototype]]` reference to another object (or `null`). When you access a property, the engine first checks the object's own properties; if not found, it follows `[[Prototype]]` to the next object and checks there, repeating until it finds the property or reaches an object whose prototype is `null`. This is how shared methods (like array methods or `Object.prototype.toString`) work without being duplicated on every instance.

**Q: What's the difference between `__proto__`, `Object.getPrototypeOf`, and `Constructor.prototype`?**
`__proto__` and `Object.getPrototypeOf`/`setPrototypeOf` both get/set an *instance's* internal `[[Prototype]]` — `__proto__` is a legacy accessor (Annex B, web-compat only), while the `Object.*` functions are the standard, recommended API. `Constructor.prototype` is different: it's a plain object property that lives *on a function*, and it's the object that becomes the `[[Prototype]]` of instances created via `new Constructor()`. Instances don't have a `.prototype` property themselves.

**Q: When and why would you use `Object.create(null)`?**
When you want a pure dictionary object with zero inherited properties or methods — no `toString`, no `hasOwnProperty`, no `__proto__` accessor. This avoids two classes of bugs: accidental collisions between user-supplied keys and inherited names (like a key literally named `"toString"` shadowing the real method unexpectedly), and prototype-pollution attacks where a key like `"__proto__"` could otherwise be used to tamper with `Object.prototype`.

**Q: What's the difference between `hasOwnProperty` and the `in` operator?**
`in` checks the entire prototype chain — it returns `true` even for inherited properties like methods on `Object.prototype`. `hasOwnProperty` only checks properties defined directly on the object itself. `Object.hasOwn(obj, key)` (ES2022) is the modern, safer alternative to `hasOwnProperty` since it works correctly even on objects with no prototype (`Object.create(null)`), where calling `.hasOwnProperty` directly would throw.

**Q: Why does `for...in` iterate over more properties than `Object.keys`?**
`Object.keys` returns only an object's own enumerable string-keyed properties. `for...in` additionally walks up the prototype chain and includes inherited enumerable properties. In practice this rarely matters with plain objects because built-in prototype methods are non-enumerable, but it becomes a footgun with custom prototypes that add enumerable properties, which is why many style guides recommend guarding `for...in` bodies with a `hasOwnProperty` check or just avoiding `for...in` in favor of `Object.keys`/`entries`.

**Q: How do you deep clone an object in modern JavaScript, and what are the limitations?**
`structuredClone(obj)` is the built-in, spec-defined way to deep clone — it handles nested objects, arrays, `Map`, `Set`, `Date`, and even circular references correctly. Its limitations: it cannot clone functions, DOM nodes, or anything with prototype chains beyond plain built-ins (it throws a `DataCloneError`). The older `JSON.parse(JSON.stringify(obj))` trick also deep clones but silently drops `undefined` values and functions, converts `Date` objects to ISO strings (losing the `Date` type), can't handle `Map`/`Set`, and throws on circular references.

**Q: Why does `Object.assign({}, a, b)` sometimes surprise people compared to spread?**
Functionally, `Object.assign({}, a, b)` and `{...a, ...b}` behave the same for plain merging — both are shallow, later sources win on key conflicts. The surprise usually comes from forgetting `Object.assign` mutates its *first* argument, so calling `Object.assign(a, b)` (without a fresh `{}` target) mutates `a` in place, whereas spread always produces a new object.

**Q: What happens if you try to add a property to a sealed object?**
It fails silently in non-strict mode (the property simply isn't added, no error) and throws a `TypeError` in strict mode or ES modules (which are strict by default). This is the same non-extensible behavior you'd get on any object where `Object.preventExtensions` has been applied, since `seal` implies `preventExtensions`.

**Q: Can you change a non-configurable property's `writable` attribute from `true` to `false`?**
Yes — that's the one exception the spec allows: even on a non-configurable property, you're permitted to flip `writable` from `true` to `false` (making it read-only), but never back from `false` to `true`, and you can't change `value`, `get`/`set`, `enumerable`, or `configurable` at all once `configurable` is `false`.

**Q: How does `instanceof` relate to the prototype chain?**
`obj instanceof Constructor` checks whether `Constructor.prototype` appears anywhere in `obj`'s prototype chain, by walking `[[Prototype]]` links and comparing each one against `Constructor.prototype`. It's a chain-membership test, not a check of what function originally created the object — which is why reassigning `Constructor.prototype` after instances exist breaks `instanceof` for those older instances.
