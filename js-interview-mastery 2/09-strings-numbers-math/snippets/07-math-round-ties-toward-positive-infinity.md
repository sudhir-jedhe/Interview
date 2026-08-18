# Math.round ties always go toward positive infinity

```js
console.log(Math.round(2.5));   // 3
console.log(Math.round(-2.5));  // -2, not -3
console.log(Math.round(-2.6));  // -3
```
