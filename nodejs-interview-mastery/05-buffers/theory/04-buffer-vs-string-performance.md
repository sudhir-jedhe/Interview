# Buffer vs String Performance

Buffers avoid the overhead of encoding/decoding when you don't need to inspect content as text — e.g., proxying bytes from a socket straight to a file. Converting back and forth (`buf.toString()` then `Buffer.from(str)`) costs CPU and, for large payloads, extra memory since you now hold both representations. Rule of thumb: stay in Buffer-land as long as possible in binary-heavy pipelines (file/network proxying), and only decode to string when you actually need to parse or display text.

This matters most in high-throughput services (proxies, file servers, streaming APIs) where every request pays the encode/decode cost. A single JSON API endpoint decoding a small request body is negligible; a service piping large files or video chunks through unnecessary string conversions is not — it adds both CPU overhead and doubles peak memory usage for large payloads (holding both the Buffer and its decoded String representation simultaneously).
