# setTimeout(0) vs setImmediate at Top Level

```js
setImmediate(() => console.log('immediate'));
setTimeout(() => console.log('timeout'), 0);
```

**Answer:** Non-deterministic — either order is possible.

**Why:** At the top level (outside any I/O callback), which fires first depends on process startup overhead and how close the timer's ~1ms minimum threshold is to elapsed time when the loop first checks the timers phase. Inside an I/O callback (e.g., an `fs.readFile` callback) the order becomes deterministic: `immediate` always wins because poll → check precedes the next timers phase. See `../snippets/02-io-callback-immediate-vs-timeout.md` for that deterministic case.
