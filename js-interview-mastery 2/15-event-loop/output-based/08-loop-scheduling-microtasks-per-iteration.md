```js
for (let i = 0; i < 3; i++) {
  Promise.resolve().then(() => console.log('micro', i));
}
setTimeout(() => console.log('macro'), 0);
console.log('sync loop done');
```
**Answer:** `sync loop done micro 0 micro 1 micro 2 macro`
**Why:** The `for` loop runs entirely synchronously, scheduling three microtasks (capturing `i` correctly per iteration because `let` creates a new binding each time) before any of them run. Once the synchronous script finishes (`sync loop done`), all three microtasks drain in the order they were queued, and only then does the single macrotask run.
