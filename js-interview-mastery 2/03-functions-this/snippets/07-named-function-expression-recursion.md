# Named Function Expression Can Recurse Without Leaking Its Name

```js
const countdown = function run(n) {
  if (n <= 0) return 'done';
  return run(n - 1); // `run` only visible inside this function body
};
console.log(countdown(3));      // 'done'
try {
  console.log(run);
} catch (e) {
  console.log(e.constructor.name); // 'ReferenceError' — `run` never leaked to the outer scope
}
```
