```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
```
**Answer:** `1 4 3 2`
**Why:** Synchronous code (`'1'`, `'4'`) always runs first, to completion, before any queued async work. The resolved promise's `.then` callback goes into the **microtask queue**, and `setTimeout`'s callback goes into the **macrotask queue**. All microtasks drain before the next macrotask runs, so `'3'` logs before `'2'` even though both were scheduled "immediately." (See the event-loop topic for the full queue model.)
