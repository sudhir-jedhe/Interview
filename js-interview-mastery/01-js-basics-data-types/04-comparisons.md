# JS Basics & Data Types — Comparisons

## Primitive Types vs Reference Types

| Aspect | Primitive (string, number, boolean, null, undefined, symbol, bigint) | Reference (object, array, function) |
|---|---|---|
| Storage | Stored directly, value copied on assignment | Stored in heap memory; variable holds a pointer to it |
| Copying | Independent copy — mutating one doesn't affect the other | Copying the variable copies the reference — both point to the same data |
| Comparison (`===`) | Compares by value | Compares by identity (same memory location), not contents |
| Mutability | Immutable — operations create new values | Mutable — properties/elements can change in place |

Use primitives for simple, self-contained data; use objects/arrays when you need structure or shared mutable state. The most common mistake is expecting `{} === {}` to be `true` because they "look the same" — it's always `false` unless it's literally the same reference. To compare object contents, use a deep-equality check (e.g. `JSON.stringify` for simple cases, or a library like lodash's `isEqual`).

## `null` vs `undefined`

| Aspect | `null` | `undefined` |
|---|---|---|
| Set by | Developer, explicitly | JavaScript engine, by default |
| Meaning | "Intentionally empty" | "Not yet assigned / doesn't exist" |
| `typeof` | `'object'` | `'undefined'` |
| Common source | Explicit assignment, `Object.getPrototypeOf(Object.prototype)` | Uninitialized variables, missing function args, missing object properties |

Use `null` when you want to explicitly signal "this value is empty on purpose" (e.g. resetting a selected user to `null`). Let `undefined` occur naturally rather than assigning it yourself. The common mistake is using them interchangeably in equality checks — prefer `=== null` or `=== undefined` for precision, or `value == null` as a deliberate shorthand for "either."

## `Number.isNaN` vs global `isNaN`

| Aspect | `Number.isNaN(x)` | `isNaN(x)` |
|---|---|---|
| Coercion | None — checks the value as-is | Coerces `x` to a number first via `ToNumber` |
| `isNaN('abc')` equivalent | `false` | `true` |
| Use case | Safe, precise NaN detection | Legacy; rarely what you actually want |

Always prefer `Number.isNaN` in modern code — it answers "is this literally the NaN value?" rather than "does this become NaN after coercion?" The common mistake is using global `isNaN` to validate user input (e.g. checking if a string is "not a number"), which produces false positives for any non-numeric string.

## `==` (loose equality) vs `===` (strict equality)

| Aspect | `==` | `===` |
|---|---|---|
| Type coercion | Yes — converts operands to a common type before comparing | No — types must already match |
| `1 == '1'` | `true` | `false` |
| `null == undefined` | `true` | `false` |
| Predictability | Lower — coercion rules are complex and easy to misremember | Higher — no hidden conversions |

Default to `===` everywhere; it removes an entire class of coercion bugs. The one accepted exception is `value == null`, a common idiom for checking "is this null or undefined" in one comparison. The most common mistake is relying on `==` out of habit and getting surprised by rules like `'' == 0` being `true` or `[] == false` being `true`.
