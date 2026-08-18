# `null` in Loose Equality vs Relational Comparison

```js
console.log(null == 0);
console.log(null >= 0);
```

**Answer:** `false` then `true`

**Why:** `==` with `null` is special-cased: `null` only loosely equals `undefined` (and itself), never any number, so `null == 0` is `false`. But relational operators (`>=`, `<=`, `<`, `>`) don't use that special case — they coerce `null` to `0` via `ToNumber`, so `null >= 0` becomes `0 >= 0`, which is `true`. This inconsistency between equality and relational coercion trips up a lot of people.
