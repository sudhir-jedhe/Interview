# Value vs Reference Copying

Primitives copy by value; objects copy by reference — both variables end up pointing at the same underlying object.

```js
let a = 5;
let b = a;
b = 10;
console.log(a, b); // 5 10

const obj = { count: 1 };
const ref = obj;
ref.count = 2;
console.log(obj.count); // 2 — obj and ref point to the same object
```
