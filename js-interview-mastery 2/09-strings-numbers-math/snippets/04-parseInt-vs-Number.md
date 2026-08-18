# parseInt stops at the first invalid character; Number does not

```js
console.log(parseInt("100px"));   // 100
console.log(Number("100px"));     // NaN
console.log(parseInt("  42  ")); // 42 — leading whitespace ignored
console.log(parseInt("0x1F"));    // 31 — auto-detects hex prefix
```
