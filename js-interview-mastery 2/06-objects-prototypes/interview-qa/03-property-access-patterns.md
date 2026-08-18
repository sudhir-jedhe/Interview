# Interview Q&A: property access patterns

**Q: When and why would you use `Object.create(null)`?**
When you want a pure dictionary object with zero inherited properties or methods — no `toString`, no `hasOwnProperty`, no `__proto__` accessor. This avoids two classes of bugs: accidental collisions between user-supplied keys and inherited names (like a key literally named `"toString"` shadowing the real method unexpectedly), and prototype-pollution attacks where a key like `"__proto__"` could otherwise be used to tamper with `Object.prototype`.

**Q: What's the difference between `hasOwnProperty` and the `in` operator?**
`in` checks the entire prototype chain — it returns `true` even for inherited properties like methods on `Object.prototype`. `hasOwnProperty` only checks properties defined directly on the object itself. `Object.hasOwn(obj, key)` (ES2022) is the modern, safer alternative to `hasOwnProperty` since it works correctly even on objects with no prototype (`Object.create(null)`), where calling `.hasOwnProperty` directly would throw.

**Q: Why does `for...in` iterate over more properties than `Object.keys`?**
`Object.keys` returns only an object's own enumerable string-keyed properties. `for...in` additionally walks up the prototype chain and includes inherited enumerable properties. In practice this rarely matters with plain objects because built-in prototype methods are non-enumerable, but it becomes a footgun with custom prototypes that add enumerable properties, which is why many style guides recommend guarding `for...in` bodies with a `hasOwnProperty` check or just avoiding `for...in` in favor of `Object.keys`/`entries`.
