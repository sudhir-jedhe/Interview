# Nested nextTick Inside a Promise Callback

```js
Promise.resolve().then(() => {
  console.log('promise1');
  process.nextTick(() => console.log('nextTick inside promise'));
});
process.nextTick(() => console.log('nextTick1'));
Promise.resolve().then(() => console.log('promise2'));
```

**Answer:** `nextTick1`, `promise1`, `promise2`, `nextTick inside promise`

**Why:** The nextTick queue (`nextTick1`) drains first. Then the Promise queue starts: `promise1` runs and schedules a new nextTick callback, but Node finishes draining the *entire current* Promise queue (`promise2`) before checking the nextTick queue again — nextTick queue is checked after each individual microtask completes, but since promise2 was already queued in the same batch, both promise callbacks run before the newly scheduled nextTick fires next.
