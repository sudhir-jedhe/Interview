# Allocation: alloc vs allocUnsafe vs from

- `Buffer.from(data)` — creates a buffer from existing data (string, array, another buffer). Always safe and initialized.
- `Buffer.alloc(size)` — allocates `size` bytes and **zero-fills** them. Safe, slightly slower due to the zeroing.
- `Buffer.allocUnsafe(size)` — allocates `size` bytes from a shared, pre-allocated internal memory pool **without zeroing them**. Faster, but the memory may contain leftover data from a previous, unrelated allocation.

```js
const safe = Buffer.alloc(10);         // <Buffer 00 00 00 00 00 00 00 00 00 00>
const unsafe = Buffer.allocUnsafe(10); // <Buffer contains garbage until you write to it>
```

**This is a real security bug class.** If you `allocUnsafe` a buffer and then only partially fill it before sending it over the network or writing it to disk, you can leak fragments of previously-freed memory — potentially other users' request bodies, session tokens, or private keys that happened to occupy that memory earlier. Only use `allocUnsafe` when you are about to immediately overwrite the *entire* buffer yourself (e.g., a hot-path parser that fills every byte before use). When in doubt, use `Buffer.alloc`.

## Buffer.alloc vs Buffer.allocUnsafe at a glance

| Aspect | Buffer.alloc | Buffer.allocUnsafe |
|---|---|---|
| Memory initialization | Zero-filled | Uninitialized (may contain old data) |
| Speed | Slightly slower (zeroing cost) | Faster (no zeroing) |
| Security risk | None | Can leak previously-freed memory if not fully overwritten |

Use `Buffer.alloc` by default; reach for `allocUnsafe` only in hot paths where you immediately overwrite every byte (e.g., a custom binary parser). The most common mistake is using `allocUnsafe` and then only partially filling the buffer before sending it out — leaking stale heap data over the network. The standard safe pattern for reusing `allocUnsafe`'s speed is to immediately call `.fill()` (or otherwise guarantee full overwrite) before the buffer is ever read or transmitted.
