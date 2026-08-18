# Problem: Parse a Fixed Binary Protocol Frame (4-Byte Length Prefix + Payload)

## Problem Statement

Implement a `FrameParser` that extracts complete messages from a stream of arbitrarily-chunked `Buffer` data, where each message is framed as:

```
[ 4-byte big-endian length prefix (N) ][ N bytes of payload ]
```

Chunks arriving via `.push(chunk)` may contain zero, one, partial, or multiple frames — the parser must correctly reassemble frames regardless of how the input is chunked, and hand back complete payload buffers via a callback.

## Requirements

- `push(chunk: Buffer)` — feed in raw bytes as they arrive (e.g., from a `socket.on('data', ...)`).
- `onMessage(payload: Buffer)` callback — fired once per complete, correctly-framed message.
- Must handle a length prefix split across chunk boundaries (e.g., 2 bytes of the length arrive in one chunk, 2 more in the next).
- Must handle a payload split across many small chunks.
- Must handle multiple complete messages arriving in a single chunk.
- Should not copy data more than necessary — use `Buffer.concat` only when actually needed.

## Approach

Keep an internal buffer of unprocessed bytes. Every time new data arrives, append it, then loop: while there are at least 4 bytes buffered, peek the length prefix; if the full frame (4 + length bytes) isn't buffered yet, stop and wait for more data; otherwise slice out the payload, emit it, and advance past the consumed frame. This is the standard length-prefix framing pattern used by real protocols (Redis RESP-adjacent framing, gRPC-over-TCP, custom binary RPC, etc.).

## Solution

```js
const LENGTH_PREFIX_SIZE = 4;

class FrameParser {
  #pending = Buffer.alloc(0);

  constructor(onMessage) {
    this.onMessage = onMessage;
  }

  push(chunk) {
    this.#pending =
      this.#pending.length === 0 ? chunk : Buffer.concat([this.#pending, chunk]);

    while (true) {
      if (this.#pending.length < LENGTH_PREFIX_SIZE) break; // not enough for even the length prefix

      const msgLength = this.#pending.readUInt32BE(0);
      const frameLength = LENGTH_PREFIX_SIZE + msgLength;

      if (this.#pending.length < frameLength) break; // full frame hasn't arrived yet

      const payload = this.#pending.subarray(LENGTH_PREFIX_SIZE, frameLength);
      this.onMessage(payload);

      // Advance past the consumed frame. subarray is O(1) (a view), so this loop
      // stays cheap even with many small frames in a single chunk.
      this.#pending = this.#pending.subarray(frameLength);
    }
  }
}

module.exports = { FrameParser };

// --- verification ---
function encodeFrame(payloadStr) {
  const payload = Buffer.from(payloadStr, 'utf8');
  const header = Buffer.alloc(4);
  header.writeUInt32BE(payload.length, 0);
  return Buffer.concat([header, payload]);
}

const received = [];
const parser = new FrameParser((buf) => received.push(buf.toString()));

const full = Buffer.concat([encodeFrame('hello'), encodeFrame('world!')]);

// Simulate a TCP socket delivering this in awkward, arbitrary chunk sizes.
parser.push(full.subarray(0, 3));   // partial length prefix
parser.push(full.subarray(3, 10));  // rest of length prefix + partial payload
parser.push(full.subarray(10));     // rest of first payload + entire second frame

console.log(received); // [ 'hello', 'world!' ]
```

**Why this works:** because `subarray` is a zero-copy view, repeatedly slicing `#pending` forward as frames are consumed is cheap. The only real copy happens in `Buffer.concat` when new data is appended to leftover bytes from a previous chunk — and even that's skipped on the fast path where `#pending` is already empty. The `while (true)` loop guarantees multiple fully-buffered frames in one chunk are all drained before waiting for more data.
