# Reassembling Messages from Arbitrary TCP Chunk Boundaries

**Scenario:** You're writing a TCP server that parses a custom binary protocol where messages arrive in arbitrary-sized chunks that don't align with message boundaries. How do you reassemble complete messages?

**Approach:** Maintain a running buffer of unprocessed bytes per connection, and only extract a message once you have enough bytes for a full frame (commonly length-prefixed):

```js
const net = require('net');

net.createServer((socket) => {
  let pending = Buffer.alloc(0);

  socket.on('data', (chunk) => {
    pending = Buffer.concat([pending, chunk]);

    while (pending.length >= 4) {
      const msgLength = pending.readUInt32BE(0);
      if (pending.length < 4 + msgLength) break; // wait for more data

      const message = pending.subarray(4, 4 + msgLength);
      handleMessage(message);
      pending = pending.subarray(4 + msgLength); // remaining bytes for next iteration
    }
  });
}).listen(9000);

function handleMessage(buf) {
  console.log('Got message:', buf.toString());
}
```

This is the standard length-prefix framing pattern — never assume one `data` event equals one logical message over TCP. See `problems/02-parse-length-prefixed-binary-frame.md` for a standalone, testable version of this framing logic.
