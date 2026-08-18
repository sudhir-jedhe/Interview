```js
function main() {
  console.log('1');
  setTimeout(() => console.log('2'), 0);
  new Promise((resolve) => {
    console.log('3');
    resolve();
  }).then(() => console.log('4'));
  console.log('5');
}
main();
```
**Answer:** `1 3 5 4 2`
**Why:** The `Promise` **executor function** (the code inside `new Promise((resolve) => {...})`) runs **synchronously**, immediately, at the moment the promise is constructed — not deferred. So `'3'` logs inline with the rest of the synchronous code, right between `'1'` and `'5'`. Only the `.then()` callback (`'4'`) is deferred as a microtask, running after all synchronous code finishes but before the `setTimeout` macrotask (`'2'`).
