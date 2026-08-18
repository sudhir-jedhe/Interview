# Redesigning Blanket 500 Responses into Proper Status Codes

**Scenario:** Your service currently returns 500 for every error, and API consumers can't distinguish "you sent bad data" from "we broke." How do you redesign the error responses using proper status codes?

**Approach:** Introduce a small error-classification layer that maps validation/business errors to 4xx codes and only reserves 5xx for truly unexpected failures, so clients can programmatically branch on status.

```js
const http = require('http');

class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

function validateOrder(order) {
  if (!order.items || order.items.length === 0) {
    throw new HttpError(422, 'Order must contain at least one item');
  }
  if (!order.customerId) {
    throw new HttpError(400, 'customerId is required');
  }
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === '/orders' && req.method === 'POST') {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      const order = JSON.parse(raw);
      validateOrder(order); // throws HttpError(400/422) on bad input
      res.writeHead(201, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ id: 'order-1', ...order }));
    }
    res.writeHead(404).end();
  } catch (err) {
    if (err instanceof HttpError) {
      res.writeHead(err.statusCode, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: err.message }));
    }
    if (err instanceof SyntaxError) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Malformed JSON body' }));
    }
    console.error('Unexpected error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

server.listen(3000);
```

This pattern — a typed `HttpError` carrying its own status code — is exactly what most Express error-handling middleware does under the hood, just automated across route handlers via `next(err)`.
