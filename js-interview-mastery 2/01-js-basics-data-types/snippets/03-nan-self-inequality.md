# `NaN` Is the Only Value Not Equal to Itself

```js
console.log(NaN === NaN);         // false
console.log(Object.is(NaN, NaN)); // true — Object.is does NOT special-case NaN away
console.log([NaN].includes(NaN)); // true — Array#includes uses SameValueZero
console.log([NaN].indexOf(NaN));  // -1  — indexOf uses strict equality (===)
```
