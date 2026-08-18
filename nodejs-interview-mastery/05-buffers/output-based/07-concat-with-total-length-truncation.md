# Buffer.concat's totalLength Truncates Silently

```js
const chunks = [Buffer.from('foo'), Buffer.from('barbaz')];
const combined = Buffer.concat(chunks, 5);
console.log(combined.toString());
```

**Answer:** `"fooba"`.

**Why:** The second argument to `Buffer.concat` is the **total length** of the result buffer. Node allocates exactly 5 bytes and copies input buffers in order until that length is filled, truncating the last chunk ('barbaz') to just 'ba'. Passing a totalLength smaller than the actual combined size silently truncates data — a common bug source.
