# Snippet: Basic CRUD Routes Mapped Correctly onto HTTP Verbs

```js
const express = require('express');
const app = express();
app.use(express.json());

const users = new Map();
let nextId = 1;

app.get('/users', (req, res) => res.json({ data: [...users.values()] }));
app.get('/users/:id', (req, res) => {
  const user = users.get(Number(req.params.id));
  if (!user) return res.status(404).json({ error: { message: 'User not found' } });
  res.json({ data: user });
});
app.post('/users', (req, res) => {
  const user = { id: nextId++, ...req.body };
  users.set(user.id, user);
  res.status(201).json({ data: user });
});
app.put('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!users.has(id)) return res.status(404).json({ error: { message: 'User not found' } });
  users.set(id, { id, ...req.body }); // full replace
  res.json({ data: users.get(id) });
});
app.delete('/users/:id', (req, res) => {
  users.delete(Number(req.params.id));
  res.status(204).end();
});
```

**Explanation:** Each HTTP verb maps to exactly one CRUD operation on the `/users` resource. `GET` reads (list or single), `POST` creates and returns `201` with the new resource, `PUT` fully replaces (note the `...req.body` spread discards any field the client didn't send), and `DELETE` returns `204 No Content` since there's no body to send back. Every "not found" path returns early with a `404` before any code that assumes the resource exists — a real bug source if omitted.
