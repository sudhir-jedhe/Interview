# `==` (Loose Equality) vs `===` (Strict Equality)

`==` (loose equality) coerces its operands to a common type before comparing. `===` (strict equality) requires the types to already match, with no coercion.

```js
1 == '1';   // true  — '1' is coerced to the number 1
1 === '1';  // false — different types, no coercion

null == undefined;  // true  — special-cased
null === undefined; // false — different types
```

| Aspect | `==` | `===` |
|---|---|---|
| Type coercion | Yes — converts operands to a common type before comparing | No — types must already match |
| `1 == '1'` | `true` | `false` |
| `null == undefined` | `true` | `false` |
| Predictability | Lower — coercion rules are complex and easy to misremember | Higher — no hidden conversions |

Default to `===` everywhere; it removes an entire class of coercion bugs. The one accepted exception is `value == null`, a common idiom for checking "is this null or undefined" in one comparison, since `==` with `null` is special-cased to only loosely equal `undefined` (and itself) — never any number, string, or boolean:

```js
function getOrDefault(value, fallback) {
  return value == null ? fallback : value;
}
getOrDefault(0, 10);         // 0   — 0 is not "missing"
getOrDefault(null, 10);      // 10
getOrDefault(undefined, 10); // 10
```

The most common mistake with `==` is relying on it out of habit and getting surprised by rules like `'' == 0` being `true` or `[] == false` being `true`. Many linters support an `eqeqeq: ["error", "always", { null: "ignore" }]` config, which bans `==` everywhere except specifically for `== null` — a reasonable middle ground rather than a blanket ban that forces awkward double checks.
