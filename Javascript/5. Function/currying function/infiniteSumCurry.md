```js
function sum(a) {
  let currentSum = a;

  function next(b) {
    currentSum += b;
    return next;
  }

  next.toString = () => currentSum;
  next.valueOf = () => currentSum;

  return next;
}

console.log(+sum(1)(2)(3)); // 6 (using + operator)
console.log(Number(sum(4)(5))); // 9
```
