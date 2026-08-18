# Truthy and Falsy Values

Every value in JS is truthy except a specific, complete list of falsy values: `false`, `0`, `-0`, `0n` (BigInt zero), `""` (empty string), `null`, `undefined`, and `NaN`. Everything else — including `"0"`, `"false"`, `[]`, and `{}` — is truthy, which surprises people coming from languages where empty collections are falsy.

```js
if ([]) console.log("arrays are truthy, even empty ones");   // runs
if ("0") console.log("non-empty strings are truthy");         // runs
if (0) console.log("never runs");                             // does not run
```

## Relying on truthy/falsy vs explicit checks

| Aspect | Relying on truthy/falsy (`if (value)`) | Explicit checks (`value === 0`, `Array.isArray(value)`, etc.) |
|---|---|---|
| Readability | Concise | More verbose but unambiguous |
| Risk with edge-case values | High — `0`, `""`, `[]` (truthy!), `NaN` all behave differently than intuition suggests | None — behavior is explicit |
| Best for | Simple existence checks (`if (user)`) | Anywhere the exact value matters, not just presence |

Truthy checks are fine and idiomatic for "does this exist at all" checks on objects/references. They become a liability the moment the value could legitimately be `0`, `""`, or an empty-but-valid array/object — in those cases use explicit comparisons or `??`. The most common mistake is writing `if (array.length)` intending "array is non-empty," which is actually correct, versus `if (count)` intending "count was provided," which incorrectly excludes a valid `count = 0`.
