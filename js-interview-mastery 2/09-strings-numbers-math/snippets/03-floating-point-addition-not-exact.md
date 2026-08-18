# Floating point addition is not exact

```js
console.log(0.1 + 0.2);                 // 0.30000000000000004
console.log((0.1 + 0.2).toFixed(2));    // "0.30" (string!)
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON); // true
```
