# Buffer.compare Sort-Comparator Result

```js
const a = Buffer.from([1, 2, 3]);
const b = Buffer.from([1, 2, 4]);
console.log(Buffer.compare(a, b));
console.log(Buffer.compare(b, a));
```

**Answer:** `-1`, then `1`.

**Why:** `Buffer.compare` returns a sort-comparator-style result: negative if `a` sorts before `b`, positive if after, 0 if equal. It compares byte by byte; at index 2, `3 < 4`, so `a` sorts first.
