# Currying via Nested Closures

```js
const add = (a) => (b) => (c) => a + b + c;
console.log(add(1)(2)(3)); // 6
const addFive = add(5);      // partially applied, closes over a=5
console.log(addFive(2)(3));  // 10
```
