# slice() Returns a View, Not a Copy

```js
const buf = Buffer.from('hello');
const sliced = buf.slice(0, 2);
sliced[0] = 90;
console.log(buf.toString());
```

**Answer:** `"Zello"`.

**Why:** `Buffer#slice` returns a view over the same underlying memory, not a copy (unlike `Array.prototype.slice`). Writing to `sliced[0]` writes through to `buf` at the same offset. `90` is the char code for `'Z'`.
