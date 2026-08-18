# allocUnsafe Followed by fill() Is Safe

```js
const buf = Buffer.allocUnsafe(4);
buf.fill(0);
console.log(buf.toString('hex'));
```

**Answer:** `"00000000"`.

**Why:** `allocUnsafe` leaves memory uninitialized, but `.fill(0)` immediately overwrites every byte with `0` before it's ever read. The hex representation of 4 zero bytes is 8 hex characters, all zeros — this is the standard "safe" pattern for reusing `allocUnsafe`'s speed without the leak risk.
