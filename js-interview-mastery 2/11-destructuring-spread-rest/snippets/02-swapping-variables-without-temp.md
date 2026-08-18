# Swapping variables without a temp

```js
let left = 'L', right = 'R';
[left, right] = [right, left];
console.log(left, right);
// R L
```
