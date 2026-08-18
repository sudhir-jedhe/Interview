# Comparing and Sorting Buffers

`Buffer.compare` returns a sort-comparator-style result (`-1`, `0`, `1`), which means it can be passed directly to `Array.prototype.sort`.

```js
const bufs = [Buffer.from('banana'), Buffer.from('apple'), Buffer.from('cherry')];
bufs.sort(Buffer.compare);
console.log(bufs.map((b) => b.toString())); // [ 'apple', 'banana', 'cherry' ]
```

The comparison is byte-by-byte (lexicographic), which for ASCII text matches typical string sort order.
