# Should `value == null` Be a Linter Exception to `===`?

**Scenario:** Your team's linter flags every use of `==` and insists on `===`, but a teammate says `value == null` should be allowed as an exception. Do you agree, and how would you explain the tradeoff to the team?

**Approach:** Yes, this is a widely accepted, deliberate exception. `value == null` is `true` for both `null` and `undefined` and `false` for everything else (including `0`, `''`, `false`, `NaN`), because `==` special-cases `null` to only loosely equal `undefined`. It's a concise, well-understood idiom for "value is missing," and it's arguably clearer than `value === null || value === undefined`.

```js
function getOrDefault(value, fallback) {
  return value == null ? fallback : value;
}

getOrDefault(0, 10);         // 0   — 0 is not "missing"
getOrDefault(null, 10);      // 10
getOrDefault(undefined, 10); // 10
```

The tradeoff to communicate: this exception only works safely because `==` with `null` has exactly one special case, unlike `==` between numbers/strings/booleans, which has many coercion pitfalls (`'' == 0`, `[] == false`). Recommend allowing `== null` specifically (many linters support an `eqeqeq: ["error", "always", { null: "ignore" }]` config) while still banning `==` everywhere else, rather than a blanket ban that forces awkward double-equality checks.
