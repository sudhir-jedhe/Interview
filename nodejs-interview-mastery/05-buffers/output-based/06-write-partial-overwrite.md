# write() Only Overwrites the Bytes It Touches

```js
let buf = Buffer.alloc(5, 'a');
buf.write('XY');
console.log(buf.toString());
```

**Answer:** `"XYaaa"`.

**Why:** `Buffer.alloc(5, 'a')` fills all 5 bytes with the char `'a'`. `buf.write('XY')` writes starting at offset 0 (default), overwriting only the first 2 bytes — it does not clear or resize the rest, so the trailing 3 `'a'` bytes remain.
