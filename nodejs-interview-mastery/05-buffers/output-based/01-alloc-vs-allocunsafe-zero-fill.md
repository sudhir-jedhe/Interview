# alloc vs allocUnsafe: Zero-Fill Guarantee

```js
const a = Buffer.alloc(3);
const b = Buffer.allocUnsafe(3);
console.log(a[0] === 0);
console.log(typeof b[0]);
```

**Answer:** `true`, then `"number"`.

**Why:** `Buffer.alloc` always zero-fills memory, so every byte is guaranteed `0`. `Buffer.allocUnsafe` does not initialize memory, but whatever garbage byte occupies that slot is still a `number` (0-255) — it's unpredictable in value, not in type.
