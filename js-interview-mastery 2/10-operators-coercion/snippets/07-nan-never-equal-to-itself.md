# NaN is never equal to anything, even itself

```js
console.log(NaN == NaN);              // false
console.log(NaN === NaN);             // false
console.log(Number.isNaN(NaN));       // true — the only reliable direct check
console.log([NaN].includes(NaN));     // true — includes uses SameValueZero, not ===
```
