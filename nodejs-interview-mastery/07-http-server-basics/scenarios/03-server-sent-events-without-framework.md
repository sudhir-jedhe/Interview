# Implementing Server-Sent Events with Raw http

**Scenario:** Product wants a `/events` endpoint that streams live updates to a browser as they happen (server-sent events), built without any framework. How do you implement it correctly with raw `http`?

**Approach:** Set the right headers for SSE (`text/event-stream`, no caching, keep-alive), keep the connection open, and write formatted `data: ...\n\n` chunks as events occur — cleaning up on client disconnect.

```js
const http = require('http');
const { EventEmitter } = require('events');

const bus = new EventEmitter();

const server = http.createServer((req, res) => {
  if (req.url !== '/events') return res.writeHead(404).end();

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.write('\n'); // flush headers to the client immediately

  const onUpdate = (payload) => {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };
  bus.on('update', onUpdate);

  req.on('close', () => {
    bus.off('update', onUpdate); // avoid leaking listeners when client disconnects
  });
});

server.listen(3000);
// Elsewhere: bus.emit('update', { price: 42.5 });
```

The critical detail: listening for `req.on('close', ...)` to unsubscribe, otherwise every disconnected client leaves a dangling listener on `bus`, eventually leaking memory and triggering `MaxListenersExceededWarning`.
