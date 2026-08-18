# Output: Unary + and ToNumber coercion

```js
console.log(+"" );
console.log(+"  ");
console.log(+"abc");
console.log(+true);
console.log(+null);
console.log(+undefined);
```

**Answer:** `0`, `0`, `NaN`, `1`, `0`, `NaN`

**Why:** Unary `+` coerces via `ToNumber`. Empty or whitespace-only strings convert to `0`. Any string with genuinely non-numeric content becomes `NaN`. Booleans convert numerically (`true`→`1`). `null` converts to `0` by spec (it's treated as having no value, mapped to zero), while `undefined` converts to `NaN` — this asymmetry between `null` and `undefined` under numeric coercion is a frequently-tested distinction, in contrast to `==` where they're treated as equal to each other.
