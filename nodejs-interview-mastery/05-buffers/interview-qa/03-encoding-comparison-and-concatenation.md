# Interview Q&A — Encoding, Comparison, and Concatenation

**Q: How do you convert a Buffer to a string and back, and what encodings does Node support?**
Use `buf.toString(encoding)` and `Buffer.from(str, encoding)`. Common encodings: `'utf8'` (default, for text), `'hex'` (2 chars per byte, human-readable), `'base64'`/`'base64url'` (compact binary-to-text for transport), `'ascii'`, `'latin1'`.

```js
const buf = Buffer.from('hi', 'utf8');
buf.toString('hex'); // '6869'
```

**Q: How do you correctly compare two buffers for equality?**
Use `buf1.equals(buf2)` for a boolean content comparison, or `Buffer.compare(buf1, buf2)` for a sort-style -1/0/1 result. Never use `==` or `===`, which compares object references and will be `false` even for buffers with identical bytes (unless it's literally the same object).

**Q: What happens if you `console.log` or read a multi-byte UTF-8 character that's been split across two separate Buffer chunks?**
Decoding each chunk independently with `.toString('utf8')` can corrupt the character, producing replacement characters (`�`), because the byte sequence for that character is incomplete in either chunk alone. The fix is to use Node's `StringDecoder` (from the `string_decoder` module), which buffers incomplete multi-byte sequences across `write()` calls until a full character is available.

**Q: How does `Buffer.concat` work, and what's the purpose of its optional second argument?**
`Buffer.concat(list, totalLength)` copies all buffers in `list` into one new buffer. The optional `totalLength` pre-allocates the result buffer to that exact size (more efficient — Node doesn't have to sum lengths itself) and will truncate the copied data if `totalLength` is smaller than the actual combined length of the inputs.
