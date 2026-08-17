# Notes: Operators & Coercion

## == vs === and the coercion algorithm

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

## Truthy and falsy values

Every value in JS is truthy except a specific, complete list of falsy values: `false`, `0`, `-0`, `0n` (BigInt zero), `""` (empty string), `null`, `undefined`, and `NaN`. Everything else — including `"0"`, `"false"`, `[]`, and `{}` — is truthy, which surprises people coming from languages where empty collections are falsy.

```js
if ([]) console.log("arrays are truthy, even empty ones");   // runs
if ("0") console.log("non-empty strings are truthy");         // runs
if (0) console.log("never runs");                             // does not run
```

## + is special; other arithmetic operators are not

`+` is overloaded: if either operand is a string (after `ToPrimitive` conversion for objects), it performs string concatenation. Every other arithmetic operator (`-`, `*`, `/`, `%`, `**`) always coerces both operands to numbers first — there's no "string subtraction."

```js
console.log("5" + 3);   // "53" — string concatenation
console.log("5" - 3);   // 2   — both coerced to numbers
console.log("5" * "2"); // 10  — both coerced to numbers
console.log(1 + "2" + 3); // "123" — left to right; "1"+"2" first, then + "3"
console.log(1 + 2 + "3"); // "33"  — 1+2 is numeric first (both numbers), then + "3" concatenates
```

## Ternary operator

`condition ? exprIfTrue : exprIfFalse` is a single expression, useful for concise conditional assignment, but nesting it deeply hurts readability fast — most style guides cap it at one level.

```js
const status = age >= 18 ? "adult" : "minor";
```

## Nullish coalescing (??) vs logical OR (||)

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

## Optional chaining (?.) and short-circuiting

`?.` short-circuits to `undefined` immediately if the left side is `null`/`undefined`, without throwing, and skips evaluating the rest of the chain (including any function calls further along).

```js
const user = { profile: null };
console.log(user.profile?.name);          // undefined, no throw
console.log(user.profile?.getName());     // undefined — getName() is never called
console.log(user.missing?.deeply?.nested?.value); // undefined, safe at every level
```

`?.` combines naturally with `??` for concise defaulting: `user.profile?.name ?? "Anonymous"`.
