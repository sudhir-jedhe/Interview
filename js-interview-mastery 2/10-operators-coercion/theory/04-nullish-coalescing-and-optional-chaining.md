# Nullish Coalescing (??) and Optional Chaining (?.)

## ?? vs ||

`||` returns its right operand if the left is *falsy* (any of the eight falsy values). `??` returns its right operand only if the left is *nullish* (`null` or `undefined` specifically) — everything else, including `0`, `""`, and `false`, is treated as a valid, kept value.

```js
function setVolume(v) {
  return v || 50;   // BUG: setVolume(0) returns 50, not 0 — 0 is falsy
}
function setVolumeFixed(v) {
  return v ?? 50;   // setVolumeFixed(0) correctly returns 0
}
```

This is the exact reason `??` was added to the language — `||` was being misused for defaulting in cases where `0`, `""`, or `false` were legitimate values, not "missing" ones. `??` cannot be mixed directly with `&&`/`||` in the same expression without parentheses — `a || b ?? c` is a `SyntaxError`.

| Aspect | `??` | `\|\|` |
|---|---|---|
| Triggers fallback when left is | `null` or `undefined` only | Any falsy value (`false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`) |
| Safe with `0`/`""`/`false` as valid values | Yes | No — treats them as "missing" |
| Mixing directly with `&&`/`\|\|` without parens | `SyntaxError` | Fine |

Use `??` whenever `0`, `""`, or `false` could be legitimate, intentional values that shouldn't trigger a default (form fields, counts, flags). Use `||` when any falsy value genuinely should be treated as "not set" (e.g., defaulting a possibly-empty string label). The most common mistake is using `||` for numeric defaults and getting silently wrong behavior the first time a valid `0` is passed in.

## Optional chaining (?.) and short-circuiting

`?.` short-circuits to `undefined` immediately if the left side is `null`/`undefined`, without throwing, and skips evaluating the rest of the chain (including any function calls further along).

```js
const user = { profile: null };
console.log(user.profile?.name);          // undefined, no throw
console.log(user.profile?.getName());     // undefined — getName() is never called
console.log(user.missing?.deeply?.nested?.value); // undefined, safe at every level
```

`?.` combines naturally with `??` for concise defaulting: `user.profile?.name ?? "Anonymous"`.

| Aspect | `?.` | Manual `&&` chains (`a && a.b && a.b.c`) |
|---|---|---|
| Concision | Short, single expression | Verbose, repeats each intermediate reference |
| Short-circuits function calls | Yes (`obj.fn?.()`) | Only if written explicitly at every step |
| Rejects on falsy-but-defined intermediate values (like `0`) | No — only short-circuits on `null`/`undefined` | Yes — `&&` stops on any falsy value, though objects are never falsy so this mostly matters for primitives in the chain |

Use `?.` for any deep property/method access where intermediate values might legitimately be absent — it's shorter and semantically precise (only nullish stops it, not general falsiness). Manual `&&` guards are mostly legacy pre-ES2020 code at this point; the common mistake in old code is using `&&` chains that accidentally short-circuit on a valid falsy intermediate value that isn't actually `null`/`undefined`.
