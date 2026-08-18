# Problem: Implement Base64 Encode/Decode Using Only Buffer Byte Access

## Problem Statement

Implement your own `base64Encode(buf)` and `base64Decode(str)` functions that convert between a `Buffer` and a base64 string, **without** using the `Buffer.from(str, 'base64')` / `buf.toString('base64')` shortcuts. You must do the bit manipulation yourself, working only with raw byte access (`buf[i]`, `Buffer.alloc`, etc.).

## Requirements

- `base64Encode(buf: Buffer): string` — returns a standard base64-encoded string, including `=` padding.
- `base64Decode(str: string): Buffer` — returns the original bytes, correctly handling `=` padding.
- Must handle input lengths that aren't multiples of 3 bytes (the padding cases).
- Round-tripping `base64Decode(base64Encode(buf))` must reproduce `buf` exactly (verified with `.equals()`).

## Approach

Base64 works in 3-byte (24-bit) groups, split into four 6-bit chunks, each mapped to one of 64 characters. When the input isn't a multiple of 3 bytes, the last group is padded with zero bits and the output is padded with `=` characters (one `=` if 2 bytes remain, two `=` if 1 byte remains).

## Solution

```js
const ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function base64Encode(buf) {
  let result = '';

  for (let i = 0; i < buf.length; i += 3) {
    const byte1 = buf[i];
    const byte2 = i + 1 < buf.length ? buf[i + 1] : undefined;
    const byte3 = i + 2 < buf.length ? buf[i + 2] : undefined;

    // Combine up to 3 bytes (24 bits) into one number, using 0 for missing bytes.
    const chunk = (byte1 << 16) | ((byte2 ?? 0) << 8) | (byte3 ?? 0);

    // Split into four 6-bit groups (0-63 each) via shifting and masking.
    const c1 = (chunk >> 18) & 0x3f;
    const c2 = (chunk >> 12) & 0x3f;
    const c3 = (chunk >> 6) & 0x3f;
    const c4 = chunk & 0x3f;

    result += ALPHABET[c1];
    result += ALPHABET[c2];
    // Only emit real characters for bytes that existed; pad with '=' otherwise.
    result += byte2 !== undefined ? ALPHABET[c3] : '=';
    result += byte3 !== undefined ? ALPHABET[c4] : '=';
  }

  return result;
}

function base64Decode(str) {
  // Strip padding to know the real character count, but still need it for length math.
  const clean = str.replace(/=+$/, '');
  const padding = str.length - clean.length;

  const outLength = Math.floor((clean.length * 6) / 8);
  const out = Buffer.alloc(outLength);

  let outIndex = 0;
  let buffer = 0;
  let bitsCollected = 0;

  for (let i = 0; i < clean.length; i++) {
    const value = ALPHABET.indexOf(clean[i]);
    if (value === -1) throw new Error(`Invalid base64 character: ${clean[i]}`);

    buffer = (buffer << 6) | value;
    bitsCollected += 6;

    // Once we have a full byte (8 bits) buffered, extract and store it.
    if (bitsCollected >= 8) {
      bitsCollected -= 8;
      out[outIndex++] = (buffer >> bitsCollected) & 0xff;
    }
  }

  void padding; // padding was only needed to validate/strip trailing '='; length is derived above
  return out;
}

module.exports = { base64Encode, base64Decode };

// --- verification ---
const original = Buffer.from('Hello, Buffers! 🎉');
const encoded = base64Encode(original);
const decoded = base64Decode(encoded);

console.log(encoded);
console.log(decoded.equals(original)); // true
```

**Why this works:** encoding groups bytes into 24-bit chunks and reads off four 6-bit indices into the base64 alphabet; decoding reverses this by streaming 6 bits at a time into a bit buffer and draining full bytes as they accumulate. The padding logic (`=`) only affects the *encode* side's output characters — on decode, stripping `=` and computing `outLength` from the real character count handles it naturally without special-casing.
