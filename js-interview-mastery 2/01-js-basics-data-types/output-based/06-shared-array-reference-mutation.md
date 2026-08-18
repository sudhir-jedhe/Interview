# Mutating a Shared Array Reference

```js
const a = [1, 2, 3];
const b = a;
b.length = 0;
console.log(a);
```

**Answer:** `[]`

**Why:** `b` is not a copy of `a` — it's another reference to the exact same array in memory. Setting `b.length = 0` truncates that shared array, so `a` reflects the change too.
