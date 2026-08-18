# Output: Relational operators don't chain like in Python

```js
console.log(1 < 2 < 3);
console.log(3 > 2 > 1);
```

**Answer:** `true` then `false`

**Why:** Relational operators are left-associative and don't chain mathematically like in some other languages. `1 < 2 < 3` evaluates `1 < 2` first (`true`), then `true < 3`, where `true` coerces to `1`, giving `1 < 3` which is `true`. `3 > 2 > 1` evaluates `3 > 2` first (`true`), then `true > 1`, where `true` coerces to `1`, giving `1 > 1` which is `false` — a classic trap for anyone assuming Python-style operator chaining.
