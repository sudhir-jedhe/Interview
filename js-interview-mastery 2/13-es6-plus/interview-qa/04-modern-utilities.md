# Interview Q&A: Modern Utility Additions

**Q: What's the difference between `Object.hasOwn(obj, key)` and `obj.hasOwnProperty(key)`?**
Both check for an own (non-inherited) property, but `Object.hasOwn` is a static method that works correctly even on objects with no prototype (created via `Object.create(null)`, which lack `hasOwnProperty` entirely) and avoids the rare edge case where an object defines its own property literally named `hasOwnProperty`, shadowing the inherited method.

**Q: What does `structuredClone` do that `JSON.parse(JSON.stringify(x))` doesn't?**
`structuredClone` correctly deep-clones `Date` objects, `Map`, `Set`, typed arrays, and even objects with circular references, using the structured clone algorithm. The `JSON` round-trip approach converts `Date` to a string, turns `Map`/`Set` into empty objects, silently drops `undefined` values and functions, and throws on circular references.

**Q: What's the difference between `Array.prototype.at(-1)` and `array[array.length - 1]`?**
Functionally equivalent for reading the last element, but `.at(-1)` is more concise and less error-prone (no risk of miscalculating the index), and it works uniformly whether the index is positive or negative — `array[-1]` does not work at all with bracket notation since arrays don't support negative index access that way.
