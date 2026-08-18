```js
async function main() {
  console.log('A');
  await null;
  console.log('B');
}
console.log('start');
main();
console.log('end');
```
**Answer:** `start A end B`
**Why:** Calling `main()` runs synchronously up to the first `await`, so `'A'` logs immediately during that synchronous call. `await null` still yields control back to the caller (even awaiting a non-promise schedules a microtask), so `'end'` (the remaining synchronous code after `main()`) logs before execution resumes inside `main` to log `'B'`.
