# `NaN` and How to Test For It

`NaN` ("Not a Number") is the result of an invalid numeric operation (`0/0`, `parseInt('abc')`). Its defining oddity: it's the only value in JS that is not equal to itself.

```js
NaN === NaN; // false
```

`typeof NaN` is, perhaps confusingly, `'number'` — `NaN` represents "an invalid number result," not "not a number type."

## `Number.isNaN` vs global `isNaN`

Use `Number.isNaN(value)` to test for it — it only returns `true` for the actual `NaN` value. The global `isNaN(value)` first coerces its argument to a number, which causes false positives:

```js
isNaN('hello');        // true  — coerces 'hello' to NaN, then checks
Number.isNaN('hello'); // false — 'hello' is not the NaN value, no coercion
Number.isNaN(NaN);     // true
```

| Aspect | `Number.isNaN(x)` | `isNaN(x)` |
|---|---|---|
| Coercion | None — checks the value as-is | Coerces `x` to a number first via `ToNumber` |
| `isNaN('abc')` equivalent | `false` | `true` |
| Use case | Safe, precise NaN detection | Legacy; rarely what you actually want |

Always prefer `Number.isNaN` in modern code — it answers "is this literally the NaN value?" rather than "does this become NaN after coercion?" The common mistake is using global `isNaN` to validate user input (e.g. checking if a string is "not a number"), which produces false positives for any non-numeric string.

## Testing equality involving `NaN`

Since `NaN === NaN` is `false`, several built-ins special-case it differently:

```js
Object.is(NaN, NaN);   // true — Object.is uses SameValue, which does NOT treat NaN as unequal to itself
[NaN].includes(NaN);   // true — Array#includes uses SameValueZero
[NaN].indexOf(NaN);    // -1  — indexOf uses strict equality (===), so it never finds NaN
```

`Object.is` and `Array#includes` are the two standard tools when you specifically need "is this the NaN value" semantics inside a broader equality check.
