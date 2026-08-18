# slice vs substring on out-of-order arguments

```js
console.log("hello world".slice(6, 2));      // "" — start after end = empty
console.log("hello world".substring(6, 2));  // "wo" — args silently swapped
```
