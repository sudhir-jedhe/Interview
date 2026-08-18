# What a Buffer Actually Is

A `Buffer` is a fixed-length chunk of raw binary memory, allocated **outside** the V8 JavaScript heap. `Buffer` is a subclass of `Uint8Array`, so every element is a single byte (0-255). Node needed this because JavaScript strings are UTF-16 sequences of "characters," but real-world I/O — TCP packets, file contents, images, protobuf payloads — is just a sequence of bytes that may not be valid text at all. Trying to represent binary data as a JS string would either corrupt it (invalid UTF-16 surrogate pairs) or be wildly inefficient.

Because `Buffer` predates `Uint8Array` being widely available in JS engines, Node built it as a specialized, V8-external-memory-backed typed array with a lot of convenience methods (`toString`, `write`, `compare`, etc.) bolted on.

```js
const buf = Buffer.from('hello');
console.log(buf); // <Buffer 68 65 6c 6c 6f>
console.log(buf instanceof Uint8Array); // true
```

## Buffer vs String

| Aspect | Buffer | String |
|---|---|---|
| Represents | Raw bytes | UTF-16 encoded text |
| Mutable | Yes (in place) | No (immutable) |
| Best for | Binary I/O: files, sockets, images, crypto | Text processing, parsing, display |

Use Buffers when proxying or manipulating binary data without needing to interpret it as text; use strings once you need to reason about characters/content. The common mistake is decoding to a string too early in a streaming pipeline, which both costs performance and risks corrupting multi-byte characters split across chunks (see the encoding/decoding theory file for the exact failure mode).
