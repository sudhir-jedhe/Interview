# Common Operations: concat, slice/subarray, compare, equals

```js
// Concatenation — always specify totalLength if known, for efficiency
const combined = Buffer.concat([buf1, buf2]);

// slice()/subarray() do NOT copy — they return a view into the same memory
const view = buf.subarray(0, 3);
view[0] = 0; // mutates the original buffer too!

// Comparing buffers — never use == or === on multi-byte buffers for equality
Buffer.compare(bufA, bufB); // -1, 0, 1 (like a sort comparator)
bufA.equals(bufB);          // boolean
```

The `slice`/`subarray` aliasing is the #1 gotcha: unlike `Array.prototype.slice`, `Buffer#slice` (and the standard `subarray`) return a **view**, not a copy. Mutating the sliced buffer mutates the original. If you need an independent copy, use `Buffer.from(buf.subarray(...))` or `buf.copy(target)`.

## slice()/subarray() vs Buffer.from(buf) (copy)

| Aspect | subarray()/slice() | Buffer.from(buf) |
|---|---|---|
| Underlying memory | Shared view, no copy | New, independent memory |
| Mutation | Affects original | Isolated |
| Performance | O(1), cheap | O(n), copies bytes |

Use views when you just need read access or intentionally want shared mutation (e.g., writing into a pre-allocated frame buffer); use a real copy when the slice will outlive or be mutated independently of the source. The most common mistake is assuming `slice` behaves like `Array.prototype.slice` (a copy) — it doesn't, and this causes subtle aliasing bugs.
