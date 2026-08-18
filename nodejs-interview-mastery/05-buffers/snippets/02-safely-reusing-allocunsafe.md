# Safely Reusing allocUnsafe by Filling Every Byte

The standard pattern for getting `allocUnsafe`'s speed without its security risk: immediately overwrite every byte before the buffer is ever read.

```js
function makeFilledBuffer(size, fillByte) {
  const buf = Buffer.allocUnsafe(size);
  buf.fill(fillByte); // overwrites entire buffer, closing the leak risk
  return buf;
}
console.log(makeFilledBuffer(5, 0x41).toString()); // "AAAAA"
```

Because `.fill()` writes to every index before the function returns, no caller can ever observe the uninitialized memory `allocUnsafe` started with.
