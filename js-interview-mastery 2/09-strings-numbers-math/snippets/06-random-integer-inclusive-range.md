# Random integer in an inclusive range

```js
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const value = randomInt(1, 6); // simulates a die roll, always an integer 1-6
console.log(Number.isInteger(value)); // true
```
