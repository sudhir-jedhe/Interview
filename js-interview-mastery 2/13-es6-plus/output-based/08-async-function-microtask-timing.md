```js
async function main() {
  console.log('before');
  const result = await Promise.resolve(42);
  console.log(result);
}
main();
console.log('after');
```
**Answer:**
```
before
after
42
```
**Why:** `main()` runs synchronously up to the first `await`, logging `"before"`. The `await` then suspends `main`, returning control to the caller, so the synchronous `console.log('after')` runs next. Only after the current synchronous code finishes does the microtask queue resume `main`, logging the resolved value `42`. (See the async-js and event-loop topics for the full microtask/macrotask model behind this.)
