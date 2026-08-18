# Rest parameters produce a real array (unlike `arguments`)

```js
function collect(...nums) {
  return nums.filter(n => n % 2 === 0);
}
console.log(collect(1, 2, 3, 4, 5, 6));
// [ 2, 4, 6 ]
```
