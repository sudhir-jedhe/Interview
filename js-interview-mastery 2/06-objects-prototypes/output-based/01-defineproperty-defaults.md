# Output: defineProperty default attributes

```js
const obj = {};
Object.defineProperty(obj, "x", { value: 10 });
obj.x = 20;
console.log(obj.x);
console.log(Object.keys(obj));
```

**Answer:** `10` then `[]`

**Why:** `Object.defineProperty` with only `value` set leaves `writable`, `enumerable`, and `configurable` all defaulting to `false`. The reassignment `obj.x = 20` silently fails in sloppy mode (no error, no effect), and since `enumerable` is `false`, `Object.keys` doesn't list `x` even though it exists on the object.
