# Encoding and Decoding

Buffers are just bytes; encodings are how you interpret those bytes as text (or vice versa).

```js
const buf = Buffer.from('héllo', 'utf8');
buf.toString('utf8');   // 'héllo'
buf.toString('hex');    // '68c3a96c6c6f'
buf.toString('base64'); // 'aMOpbGxv'
```

Gotcha: multi-byte UTF-8 characters can be split across buffer chunks when streaming (e.g., reading a file in 64KB pieces). Calling `.toString('utf8')` on a chunk that ends mid-character produces a corrupted `�` replacement character. This is exactly why `Readable` streams use a `StringDecoder` internally when you set an encoding on the stream — it buffers incomplete byte sequences until the next chunk arrives, rather than naively decoding each chunk independently.

## toString('hex') vs toString('base64')

| Aspect | hex | base64 |
|---|---|---|
| Output size vs input bytes | 2x (2 chars per byte) | ~1.33x |
| Human readability | Very easy to eyeball/debug | Harder to read raw |
| Common use | Hashes, checksums, debugging | Tokens, encoding binary in JSON/URLs |

Use hex for things people need to visually compare (hashes, IDs); use base64 when you need compact text representation of binary data for transport (JWT segments, file uploads in JSON). A common mistake is using base64 output directly in URLs without switching to `'base64url'` encoding, since standard base64's `+`, `/`, and `=` characters need escaping in URLs.
