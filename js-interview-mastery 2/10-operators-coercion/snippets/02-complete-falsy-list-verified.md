# The complete falsy list, verified

```js
const falsyValues = [false, 0, -0, 0n, "", null, undefined, NaN];
console.log(falsyValues.every((v) => !v)); // true — all eight are falsy
console.log(!!"0", !!"false", !![], !!{}); // true true true true — all truthy!
```
