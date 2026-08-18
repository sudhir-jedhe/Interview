# Output: Chained ?? and optional chaining

```js
let a;
console.log(a ?? "default" ?? "fallback");
const obj = null;
console.log(obj?.prop?.deep ?? "safe");
```

**Answer:** `"default"` then `"safe"`

**Why:** `a` is `undefined`, so the first `??` immediately substitutes `"default"`; `??` chains left to right just like `||`, only ever moving to the next fallback if the current value is nullish, and `"default"` (a truthy, non-nullish string) stops the chain there. `obj` is `null`, so `obj?.prop` short-circuits the entire remaining chain to `undefined` without erroring, and `??` then substitutes `"safe"`.
