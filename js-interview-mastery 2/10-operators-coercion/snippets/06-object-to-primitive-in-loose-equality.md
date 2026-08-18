# Object-to-primitive coercion in == comparisons

```js
console.log([1, 2] == "1,2");           // true — array's toString() joins with commas
console.log([] == "");                   // true — [] -> "" via toString
console.log({} == "[object Object]");    // true — default Object toString
```
