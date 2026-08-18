# Snippet: Measuring execution time with `process.hrtime.bigint`

```js
const start = process.hrtime.bigint();
let sum = 0;
for (let i = 0; i < 1e7; i++) sum += i;
const end = process.hrtime.bigint();
console.log(`Took ${(end - start) / 1_000_000n}ms`);
```

**Explanation:** `process.hrtime.bigint()` returns a monotonic nanosecond-precision timestamp as a `BigInt`, unaffected by system clock adjustments — the right tool for measuring how long a block of code actually took, as opposed to `Date.now()`, which is wall-clock time and can jump. Dividing the nanosecond difference by `1_000_000n` converts to milliseconds.
