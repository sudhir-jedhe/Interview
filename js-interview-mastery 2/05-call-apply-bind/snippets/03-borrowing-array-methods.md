# Snippet: borrowing array methods for array-like objects via call

```js
function listArgs() {
  return Array.prototype.join.call(arguments, ', ');
}
console.log(listArgs('a', 'b', 'c')); // 'a, b, c'

// Modern equivalent, no borrowing needed:
function listArgsModern(...args) { return args.join(', '); }
console.log(listArgsModern('a', 'b', 'c')); // 'a, b, c'
```

`arguments` is array-like (indexed + `.length`) but has no `.join` of its own, so `Array.prototype.join` is borrowed by explicitly setting `this` to `arguments` via `call`. Rest parameters make the borrowing pattern unnecessary in new code, but it still appears constantly in older code and interview questions.
