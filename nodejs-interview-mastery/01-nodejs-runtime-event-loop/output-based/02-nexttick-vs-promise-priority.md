# nextTick vs Promise Priority

```js
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));
```

**Answer:** `nextTick`, `promise`

**Why:** Node drains the `process.nextTick` queue completely before processing the Promise microtask queue, every single time the call stack empties — `nextTick` always wins regardless of registration order.
