# Await Ordering Across Multiple Async Functions

```js
async function a() {
  console.log('a start');
  await b();
  console.log('a end');
}
async function b() {
  console.log('b');
}
console.log('script start');
a();
console.log('script end');
```

**Answer:** `script start`, `a start`, `b`, `script end`, `a end`

**Why:** `a()` runs synchronously until the `await`. `b()` runs fully synchronously (logging `b`) since it has no `await` inside, and its returned resolved promise causes the rest of `a` to be scheduled as a microtask. Control returns to the caller, `script end` logs synchronously, then the microtask queue runs `a end`.
