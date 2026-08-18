# Interview Q&A: pipe/pipeline & Backpressure

**Q: What's wrong with chaining .pipe() calls in production code, and what should you use instead?**
`.pipe()` automatically manages backpressure but has a well-known flaw: if any stream in the chain emits an `'error'` event, `.pipe()` does not automatically destroy or clean up the other streams — you'd have to manually attach `'error'` listeners and call `.destroy()` on every stream yourself, or risk memory leaks and dangling file descriptors. `pipeline()` (from `node:stream/promises` or the callback form in `node:stream`) fixes this: it forwards errors from any stream in the chain and guarantees every stream is properly destroyed when the pipeline finishes or fails. Always prefer `pipeline()` over raw chained `.pipe()` in production.

**Q: What is backpressure, and how is it signaled in Node streams?**
Backpressure occurs when a writable destination can't consume data as fast as a readable source produces it. Every writable stream has an internal buffer governed by `highWaterMark`; when `.write(chunk)` is called and the buffer exceeds that threshold, `.write()` returns `false` to signal "stop pushing data until I drain." The writable later emits `'drain'` once its buffer empties enough to accept more. Ignoring the `false` return value and continuing to write anyway causes the internal buffer to grow unbounded — a memory leak under sustained load.

```js
readable.on('data', (chunk) => {
  if (!writable.write(chunk)) {
    readable.pause();
    writable.once('drain', () => readable.resume());
  }
});
```

**Q: Do .pipe() and pipeline() handle backpressure automatically?**
Yes — both pause the source stream when the destination's `.write()` returns `false` and resume it once `'drain'` fires, without you writing any manual pause/resume logic. This is the strongest practical argument for using `.pipe()`/`pipeline()` over a manual `'data'`-event loop: manual backpressure handling is easy to get wrong (or forget entirely), while the built-in mechanisms get it right by default.
