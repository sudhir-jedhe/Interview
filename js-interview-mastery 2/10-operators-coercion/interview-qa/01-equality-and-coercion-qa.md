# Interview Q&A: Equality & Coercion

**Q: What's the difference between `==` and `===`?**
`===` (strict equality) never performs type coercion — if the operands are different types, it immediately returns `false`. `==` (loose equality) applies the Abstract Equality Comparison algorithm, which can coerce one or both operands (string-to-number, boolean-to-number, object-to-primitive) before comparing. The general best practice is to always use `===`, with the one common exception of `x == null` as a concise way to check for both `null` and `undefined` at once.

**Q: Why is `null == undefined` true but `null === undefined` false?**
The spec special-cases `null` and `undefined` in the `==` algorithm: they're defined to be loosely equal to each other and to nothing else — not `0`, not `false`, not `""`. `===` requires identical types, and `null` and `undefined` are distinct types (`"object"` and `"undefined"` respectively via `typeof`), so strict equality is always `false` between them.

**Q: Why is `[] == false` true?**
Comparing an object (`[]`) to a boolean (`false`) triggers coercion on both sides: `[]` is converted via `ToPrimitive` to `""` (an array's default string conversion joins its elements, and an empty array joins to an empty string), and `false` is converted to the number `0`. The comparison then re-runs as `"" == 0`, which coerces `""` to `0` as well, landing on `0 == 0`, which is `true`.

**Q: Why is `NaN === NaN` false, and how do you correctly check for `NaN`?**
By IEEE-754 definition, `NaN` (Not-a-Number) is defined to be unequal to every value, including itself — this is a hardware-level floating-point spec rule, not a JavaScript-specific quirk. The correct check is `Number.isNaN(value)`, which tests specifically for the `NaN` value without coercion (unlike the legacy global `isNaN`, which coerces its argument first and can give false positives for non-numeric strings).

**Q: What does `typeof null` return, and why is that considered a bug?**
`typeof null` returns `"object"`, which is famously wrong — `null` is a primitive, not an object. It's a bug baked into the very first JavaScript implementation (an artifact of how values were internally tagged) that can never be fixed now without breaking the web, since so much existing code implicitly depends on the current behavior.
