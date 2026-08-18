# `var` Hoists as `undefined`; `let`/`const` Hoist Into the TDZ

```js
console.log(hoistedVar); // undefined
var hoistedVar = 'value';

try {
  console.log(hoistedLet); // ReferenceError: Cannot access 'hoistedLet' before initialization
} catch (e) {
  console.log(e.constructor.name); // 'ReferenceError'
}
let hoistedLet = 'value';
```
