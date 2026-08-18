# Destructuring Map entries with for-of

```js
const scores = new Map([['a', 10], ['b', 20]]);
for (const [name, score] of scores) {
  console.log(name, score);
}
// a 10
// b 20
```
