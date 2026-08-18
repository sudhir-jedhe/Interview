# Skipping elements and defaults in array destructuring

```js
const [first, , third = 'fallback'] = ['a', 'b'];
console.log(first, third);
// a fallback
```
