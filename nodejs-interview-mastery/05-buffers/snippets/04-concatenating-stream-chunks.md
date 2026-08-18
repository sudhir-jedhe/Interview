# Concatenating Buffers from a Stream

Collects every chunk emitted by a readable stream into an array, then joins them into a single Buffer with `Buffer.concat` (never with string `+=`, which risks corrupting multi-byte characters split across chunk boundaries).

```js
const { Readable } = require('stream');

async function collectChunks(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

collectChunks(Readable.from(['a', 'b', 'c'])).then((buf) =>
  console.log(buf.toString()) // "abc"
);
```

`for await...of` consumes the stream as an async iterator, and each `chunk` arrives already as a `Buffer` (unless the stream has an encoding set). See the `problems/` folder for a hardened version of this pattern with size limits and error handling.
