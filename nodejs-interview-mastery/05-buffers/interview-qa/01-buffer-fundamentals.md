# Interview Q&A — Buffer Fundamentals

**Q: What is a Buffer in Node.js, and why does Node need it separate from JavaScript strings?**
A Buffer is a fixed-size, raw binary data structure allocated outside the V8 JavaScript heap, representing a sequence of bytes. Node needs it because JS strings are UTF-16 text and cannot safely or efficiently represent arbitrary binary data (file contents, network packets, images) that isn't valid text. `Buffer` is a subclass of `Uint8Array` with Node-specific convenience methods added on top.

**Q: When would you prefer working with Buffers over strings in a Node application?**
When handling binary or unknown-encoding data — file I/O, network protocols, image/video processing, cryptography — or in performance-sensitive paths where avoiding encode/decode overhead matters (e.g., proxying bytes from a socket to a file). Once you need to parse, search, or display the data as text, converting to a string is appropriate.

**Q: Is a Buffer mutable?**
Yes. Unlike JS strings, Buffer contents can be modified in place via index assignment (`buf[0] = 65`) or methods like `.write()` and `.fill()`. This makes buffers useful for reusable scratch memory in hot paths, but also means you must be careful about shared references (e.g., from `slice`/`subarray`) causing unintended mutation.

**Q: What does `Buffer.byteLength(string, encoding)` give you that `string.length` doesn't?**
`string.length` counts UTF-16 code units, not bytes — it's wrong for measuring how many bytes a string will occupy once encoded (e.g., UTF-8 multi-byte characters). `Buffer.byteLength(str, 'utf8')` returns the actual byte count after encoding, which is what you need for things like setting a correct `Content-Length` header.
