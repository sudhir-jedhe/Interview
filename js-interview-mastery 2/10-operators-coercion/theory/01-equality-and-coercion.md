# == vs === and the Coercion Algorithm

`===` (strict equality) never coerces — if the operand types differ, the result is immediately `false`. `==` (loose equality) allows type coercion following a specific, spec-defined algorithm (Abstract Equality Comparison), and once you know the actual rules it stops feeling random:

- `null == undefined` is `true` — but `null`/`undefined` are only ever loosely equal to each other and nothing else (not `0`, not `false`, not `""`).
- If one operand is a number and the other a string, the string is converted to a number.
- If one operand is a boolean, it's converted to a number first (`true` → `1`, `false` → `0`), then the comparison re-runs.
- If one operand is an object and the other is a primitive, the object is converted to a primitive via `ToPrimitive` (roughly: try `valueOf`, then `toString`).

```js
console.log(null == undefined);   // true
console.log(null == 0);           // false — the special-case rule above blocks it
console.log("" == 0);             // true — "" -> 0, then 0 == 0
console.log([] == false);         // true — [] -> "" -> 0, false -> 0, then 0 == 0
console.log(NaN == NaN);          // false — NaN is never equal to anything, including itself
```

The practical rule: use `===` by default. Reach for `==` only in the one well-known idiom `x == null` (which correctly matches both `null` and `undefined` in a single check).

## == vs === at a glance

| Aspect | `==` (loose equality) | `===` (strict equality) |
|---|---|---|
| Type coercion | Yes, follows Abstract Equality Comparison algorithm | Never — different types are always unequal |
| Predictability | Requires memorizing coercion rules | Fully predictable, no hidden conversion |
| Common safe idiom | `x == null` (matches both `null` and `undefined`) | Default choice for everything else |
| `NaN` comparisons | `NaN == NaN` is `false` either way | Same, `NaN === NaN` is `false` |

Default to `===` everywhere except the one idiomatic case of checking for "no value" with `x == null`, which conveniently matches both `null` and `undefined` in one comparison. The most common mistake is relying on `==` out of habit for general comparisons, producing hard-to-predict results with mixed-type data (booleans, arrays, objects) that would be immediately obvious type errors with `===`.
