# Array.prototype.at with negative indices

```js
const list = [10, 20, 30];
console.log(list.at(-1), list[list.length - 1]);
// 30 30
```

Both expressions get the last element, but `.at(-1)` avoids the manual `length - 1` arithmetic (and the off-by-one bugs that arithmetic invites) and works identically for strings, typed arrays, and any other `.at`-supporting indexable.
