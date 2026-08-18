# Snippet: Manual Promise-Wrapping for a Callback API That Doesn't Fit (err, data)

```js
function readLineFromStream(stream) {
  return new Promise((resolve, reject) => {
    stream.once('data', (chunk) => resolve(chunk.toString()));
    stream.once('error', reject);
    stream.once('end', () => reject(new Error('stream ended with no data')));
  });
}
```

**Explanation:** `util.promisify` only works on functions that follow the error-first `(err, result)` single-callback convention. A stream doesn't fit that shape at all — it emits multiple different events (`data`, `error`, `end`), so you construct the `Promise` by hand: `resolve` on the success event, `reject` on the error event, and — the detail that's easy to miss — also `reject` on `end` if no data ever arrived, so the promise doesn't hang forever waiting for a `data` event that's never coming.
