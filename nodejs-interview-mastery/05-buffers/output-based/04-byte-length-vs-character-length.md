# Byte Length vs Character Length

```js
const buf = Buffer.from('€'); // multi-byte UTF-8 character
console.log(buf.length);
console.log([...buf.toString()].length);
```

**Answer:** `3`, then `1`.

**Why:** `buf.length` is the number of **bytes** — '€' encodes to 3 bytes in UTF-8 (`e2 82 ac`). `buf.toString()` decodes those bytes back into a single JS string character, so spreading the string yields 1 code point. This distinction (byte length vs character length) is a classic gotcha when truncating strings by buffer length.
