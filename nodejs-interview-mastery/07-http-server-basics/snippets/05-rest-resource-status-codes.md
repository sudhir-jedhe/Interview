# Setting Correct Status Codes for a REST-Style Resource Endpoint

Demonstrates picking the right status code for "found," "not found," and "wrong method" cases on a single resource path.

```js
const http = require('http');

const users = new Map([['1', { id: '1', name: 'Ada' }]]);

const server = http.createServer((req, res) => {
  const id = req.url.split('/')[2]; // /users/:id
  if (req.method === 'GET' && req.url.startsWith('/users/')) {
    const user = users.get(id);
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'User not found' }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(user));
  }
  res.writeHead(405).end(); // Method Not Allowed
});

server.listen(3000);
```

Note the manual `req.url.split('/')` for extracting `id` — this is exactly the kind of hand-rolled param extraction a real router (see `problems/03-basic-request-routing.md`) replaces with a declarative `/users/:id` pattern.
