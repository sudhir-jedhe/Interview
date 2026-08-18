**A junior engineer wrote code expecting a `console.log` inside a `.then()` to run "right after" a synchronous function call, but it's actually interleaved unexpectedly with other logs elsewhere in the app that use `setTimeout`. Walk through how you'd explain — and predict the order of — the following code they're confused about:**

```js
function fetchUserSimulated() {
  return new Promise(resolve => {
    console.log('fetching...');
    setTimeout(() => resolve({ name: 'Kai' }), 0);
  });
}
console.log('app start');
fetchUserSimulated().then(user => console.log('got user:', user.name));
console.log('app continuing');
```

**Approach:**
Trace it step by step: `'app start'` logs synchronously. Calling `fetchUserSimulated()` immediately runs the Promise executor synchronously (executors always run inline, not deferred), so `'fetching...'` logs next, and a `setTimeout` is scheduled as a macrotask — the promise stays pending, returned immediately. `.then()` is attached but has nothing to run yet. `'app continuing'` logs synchronously after. Only once the synchronous script finishes and the event loop reaches the queued macrotask does the timer fire, calling `resolve(...)`, which schedules the `.then()` callback as a microtask that runs immediately after, logging `'got user: Kai'`.

Full order: `app start`, `fetching...`, `app continuing`, `got user: Kai`. The key teaching point for the junior engineer: "right after" a synchronous call only applies to code that's *actually synchronous* — the Promise executor is synchronous, but anything gated behind `resolve()` (which here is itself gated behind a macrotask timer) can never run until the current script and the intervening macrotask both complete.
