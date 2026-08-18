# Interview Q&A — Allocation and Memory Safety

**Q: What's the difference between `Buffer.alloc(size)` and `Buffer.allocUnsafe(size)`?**
`Buffer.alloc(size)` allocates `size` bytes and zero-fills them, guaranteeing predictable, safe contents. `Buffer.allocUnsafe(size)` allocates from a shared internal memory pool without initializing it, so it's faster but may contain leftover data from previous allocations — a potential information-leak vector if not fully overwritten before use.

**Q: Why is `Buffer.allocUnsafe` considered a security risk?**
Because the returned memory isn't zeroed, it can contain fragments of data from earlier, unrelated buffers that were previously freed — potentially other requests' payloads, tokens, or keys. If you allocate an unsafe buffer, only partially fill it, and then send or persist it, you can leak that stale data. It's safe only when you guarantee full overwrite of every byte before the buffer is read or transmitted.

**Q: Does `Buffer#slice()` (or `subarray()`) copy data?**
No. Both return a view over the same underlying memory as the original buffer — no bytes are copied. Mutating the sliced buffer mutates the source buffer at the corresponding offset. To get an independent copy, use `Buffer.from(buf.subarray(...))` or `buf.copy(target)`.
