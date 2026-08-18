# `null` vs `undefined` Equality

```js
console.log(null == undefined);   // true  — loose equality treats them as equal
console.log(null === undefined);  // false — different types
console.log(typeof null);         // 'object'
console.log(typeof undefined);    // 'undefined'
```
