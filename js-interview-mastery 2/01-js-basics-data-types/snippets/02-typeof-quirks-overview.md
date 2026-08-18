# `typeof` Quirks in One Place

```js
console.log(typeof null);         // 'object'
console.log(typeof undefined);    // 'undefined'
console.log(typeof []);           // 'object'
console.log(typeof {});           // 'object'
console.log(typeof function(){}); // 'function'
console.log(typeof Symbol('s'));  // 'symbol'
console.log(typeof 42n);          // 'bigint'
```

Arrays, plain objects, and `null` all report `'object'` — `typeof` alone can't distinguish them. Use `Array.isArray()` for arrays and `=== null` for `null`.
