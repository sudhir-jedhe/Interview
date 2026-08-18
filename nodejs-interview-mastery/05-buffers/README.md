# Buffers

Buffers are Node.js's mechanism for handling raw binary data — fixed-size chunks of memory allocated outside the V8 JavaScript heap. Anytime Node deals with data that isn't guaranteed to be valid UTF-8 text (files, TCP sockets, process stdio, images, crypto operations), it hands you a `Buffer` instead of a string. Understanding how buffers are allocated, encoded/decoded, and compared is core to writing correct and secure Node code — especially the difference between `Buffer.alloc` and `Buffer.allocUnsafe`, which has real security implications. This topic covers creation, encoding, performance, and the common gotchas that trip up even experienced engineers in interviews.

## Structure

- **theory/** — Concept-by-concept notes: what a Buffer is, allocation strategies, encoding/decoding, performance, and common operations (concat/slice/compare).
- **snippets/** — One focused, runnable code example per file, each with its explanation.
- **output-based/** — "What does this log?" questions with answers and the reasoning behind them.
- **scenarios/** — Real-world engineering scenarios (upload corruption, TCP framing, security audits) with a worked approach.
- **interview-qa/** — Q&A pairs grouped into fundamentals, allocation/memory safety, and encoding/comparison/concatenation themes.
- **problems/** — Hands-on implementation problems (build your own base64 codec, parse a binary protocol frame, safely concatenate a Buffer stream) with full worked solutions.
- **assets/** — Placeholder for original images/PDFs; see `assets/README.md`.

## What's covered

- What a Buffer is and why it exists outside the V8 heap
- Creating buffers: `Buffer.from`, `Buffer.alloc`, `Buffer.allocUnsafe`
- Security implications of `allocUnsafe` (uninitialized memory leaks)
- Encoding/decoding: utf8, base64, hex, and the pitfalls of multi-byte characters
- Buffer vs string performance tradeoffs
- Common operations: `concat`, `slice`/`subarray`, `compare`, `equals`
- Hands-on: writing your own base64 codec, binary frame parsing, and safe stream concatenation

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
