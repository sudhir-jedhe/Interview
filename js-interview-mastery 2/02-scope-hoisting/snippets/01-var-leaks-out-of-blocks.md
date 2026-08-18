# `var` Leaks Out of Blocks, `let`/`const` Don't

```js
function scopeDemo() {
  if (true) {
    var leaked = 'I am function-scoped';
    let contained = 'I am block-scoped';
  }
  console.log(leaked); // 'I am function-scoped'
  // console.log(contained); // ReferenceError: contained is not defined
}
scopeDemo();
```
