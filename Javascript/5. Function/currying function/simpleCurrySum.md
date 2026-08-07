```js
function sum(a) {
  return function(b) {
    return b !== undefined ? sum(a + b) : a;
  };
}

console.log(sum(1)(2)(3)()); // 6
console.log(sum(5)(-2)(10)()); // 13
```
