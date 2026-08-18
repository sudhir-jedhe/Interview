# A custom iterable using Symbol.iterator

```js
const evens = {
  [Symbol.iterator]() {
    let n = 0;
    return {
      next: () => (n < 3 ? { value: (n++) * 2, done: false } : { value: undefined, done: true }),
    };
  },
};
console.log([...evens]);
// [ 0, 2, 4 ]
```
