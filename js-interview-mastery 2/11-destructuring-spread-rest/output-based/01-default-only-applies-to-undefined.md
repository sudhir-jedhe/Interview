# Output: Defaults only apply to `undefined`, not `null`

```js
const [a = 1, b = 2] = [undefined, null];
console.log(a, b);
```

**Answer:** `1 null`

**Why:** Default values only apply when the destructured value is exactly `undefined`. Position 0 is `undefined`, so `a` gets its default `1`. Position 1 is `null`, which is a real value (not `undefined`), so `b` stays `null` and the default `2` is never used.
