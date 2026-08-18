# == vs === on mixed types

```js
console.log(1 == "1");    // true — string coerced to number
console.log(1 === "1");   // false — different types, no coercion
console.log(null == undefined); // true — special-cased pair
console.log(null === undefined); // false
```
