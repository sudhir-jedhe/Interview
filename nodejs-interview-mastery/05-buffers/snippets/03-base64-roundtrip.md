# Round-Tripping Through Base64

A common pattern for tokens and image payloads embedded in JSON: encode to base64 for transport, decode back to bytes on the other side.

```js
const original = Buffer.from('super secret payload');
const encoded = original.toString('base64');
const decoded = Buffer.from(encoded, 'base64');
console.log(encoded);              // c3VwZXIgc2VjcmV0IHBheWxvYWQ=
console.log(decoded.toString());   // super secret payload
console.log(original.equals(decoded)); // true
```

`.equals()` confirms the round trip is lossless — base64 is a reversible text encoding of the exact same bytes, not a compression or hashing scheme.
