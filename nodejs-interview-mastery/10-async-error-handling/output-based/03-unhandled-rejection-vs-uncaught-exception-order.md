# Output-Based: Order of unhandledRejection vs uncaughtException

```js
process.on('unhandledRejection', () => console.log('A: unhandledRejection'));
process.on('uncaughtException', () => console.log('B: uncaughtException'));

Promise.reject(new Error('promise fail'));
throw new Error('sync fail');
```

**Answer:** Only `"B: uncaughtException"` prints. The process then exits (well, would exit by default without the handler — with the handler installed, execution continues past this point since there's no `process.exit` here, but "A" is not printed on this tick).

**Why:** The synchronous `throw` on the last line happens immediately and unwinds the entire (single-threaded) call stack before the microtask queue (where the rejected promise's handling would be scheduled) gets a chance to run. The uncaught synchronous exception is thrown *before* Node's event loop reaches the point of flushing microtasks/processing the rejection, so `unhandledRejection` never fires in this run at all — the process would have crashed immediately at the `throw` if the handler weren't there.
