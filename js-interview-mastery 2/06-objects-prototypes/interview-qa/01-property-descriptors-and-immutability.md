# Interview Q&A: property descriptors and immutability

**Q: What is a property descriptor and what are its attributes?**
A property descriptor is the internal metadata record JavaScript keeps for every object property. For data properties it has four attributes: `value` (the actual data), `writable` (can it be reassigned), `enumerable` (does it show up in `for...in`/`Object.keys`/spread), and `configurable` (can it be deleted or have its descriptor changed). Accessor properties (getter/setter) replace `value`/`writable` with `get`/`set`. You inspect descriptors with `Object.getOwnPropertyDescriptor(obj, key)` and set them with `Object.defineProperty`.

**Q: What's the difference between `Object.freeze`, `Object.seal`, and `Object.preventExtensions`?**
`preventExtensions` only blocks adding new properties. `seal` does that plus makes existing properties non-configurable (no delete, no descriptor changes), but values stay writable. `freeze` does everything `seal` does plus makes existing data properties non-writable, making the object fully immutable at the top level. None of the three are recursive — nested objects remain fully mutable.

**Q: What happens if you try to add a property to a sealed object?**
It fails silently in non-strict mode (the property simply isn't added, no error) and throws a `TypeError` in strict mode or ES modules (which are strict by default). This is the same non-extensible behavior you'd get on any object where `Object.preventExtensions` has been applied, since `seal` implies `preventExtensions`.

**Q: Can you change a non-configurable property's `writable` attribute from `true` to `false`?**
Yes — that's the one exception the spec allows: even on a non-configurable property, you're permitted to flip `writable` from `true` to `false` (making it read-only), but never back from `false` to `true`, and you can't change `value`, `get`/`set`, `enumerable`, or `configurable` at all once `configurable` is `false`.
