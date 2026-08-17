# Comparisons: Operators & Coercion

## == vs ===

| Aspect | `==` (loose equality) | `===` (strict equality) |
|---|---|---|
| Type coercion | Yes, follows Abstract Equality Comparison algorithm | Never — different types are always unequal |
| Predictability | Requires memorizing coercion rules | Fully predictable, no hidden conversion |
| Common safe idiom | `x == null` (matches both `null` and `undefined`) | Default choice for everything else |
| `NaN` comparisons | `NaN == NaN` is `false` either way | Same, `NaN === NaN` is `false` |

Default to `===` everywhere except the one idiomatic case of checking for "no value" with `x == null`, which conveniently matches both `null` and `undefined` in one comparison. The most common mistake is relying on `==` out of habit for general comparisons, producing hard-to-predict results with mixed-type data (booleans, arrays, objects) that would be immediately obvious type errors with `===`.

## Nullish coalescing (??) vs logical OR (||)

| Aspect | `??` | `\|\|` |
|---|---|---|
| Triggers fallback when left is | `null` or `undefined` only | Any falsy value (`false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`) |
| Safe with `0`/`""`/`false` as valid values | Yes | No — treats them as "missing" |
| Mixing directly with `&&`/`\|\|` without parens | `SyntaxError` | Fine |

Use `??` whenever `0`, `""`, or `false` could be legitimate, intentional values that shouldn't trigger a default (form fields, counts, flags). Use `||` when any falsy value genuinely should be treated as "not set" (e.g., defaulting a possibly-empty string label). The most common mistake is using `||` for numeric defaults and getting silently wrong behavior the first time a valid `0` is passed in.

## Truthy/falsy coercion vs explicit type checks

| Aspect | Relying on truthy/falsy (`if (value)`) | Explicit checks (`value === 0`, `Array.isArray(value)`, etc.) |
|---|---|---|
| Readability | Concise | More verbose but unambiguous |
| Risk with edge-case values | High — `0`, `""`, `[]`(truthy!), `NaN` all behave differently than intuition suggests | None — behavior is explicit |
| Best for | Simple existence checks (`if (user)`) | Anywhere the exact value matters, not just presence |

Truthy checks are fine and idiomatic for "does this exist at all" checks on objects/references. They become a liability the moment the value could legitimately be `0`, `""`, or an empty-but-valid array/object — in those cases use explicit comparisons or `??`. The most common mistake is writing `if (array.length)` intending "array is non-empty," which is actually correct, versus `if (count)` intending "count was provided," which incorrectly excludes a valid `count = 0`.

## Optional chaining (?.) vs manual guard checks

| Aspect | `?.` | Manual `&&` chains (`a && a.b && a.b.c`) |
|---|---|---|
| Concision | Short, single expression | Verbose, repeats each intermediate reference |
| Short-circuits function calls | Yes (`obj.fn?.()`) | Only if written explicitly at every step |
| Rejects on falsy-but-defined intermediate values (like `0`) | No — only short-circuits on `null`/`undefined` | Yes — `&&` stops on any falsy value, which can be wrong if `0` is a valid intermediate object... though objects are never falsy, so this mostly matters for primitives in the chain |

Use `?.` for any deep property/method access where intermediate values might legitimately be absent — it's shorter and semantically precise (only nullish stops it, not general falsiness). Manual `&&` guards are mostly legacy pre-ES2020 code at this point; the common mistake in old code is using `&&` chains that accidentally short-circuit on a valid falsy intermediate value that isn't actually `null`/`undefined`.
