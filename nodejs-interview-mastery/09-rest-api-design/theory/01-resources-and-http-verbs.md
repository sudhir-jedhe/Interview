# Resources and HTTP Verbs

REST (Representational State Transfer) isn't a protocol or a spec — it's a set of constraints for building APIs around **resources**. A resource is a noun (a user, an order, a comment), and you manipulate it using standard HTTP verbs. The moment your API has an endpoint like `POST /createUser` or `GET /getUserById`, you've broken the model — the verb belongs in the HTTP method, not the URL.

## Mapping verbs to CRUD

```js
GET    /users        // list users
GET    /users/42     // read one user
POST   /users        // create a user
PUT    /users/42     // replace user 42 entirely
PATCH  /users/42     // partially update user 42
DELETE /users/42     // delete user 42
```

`PUT` implies sending the *full* representation of the resource; `PATCH` sends only the fields that changed. A common interview gotcha: people use `PUT` for partial updates. That's technically wrong and breaks idempotency guarantees clients rely on.

## PUT vs PATCH

| Aspect | PUT | PATCH |
|---|---|---|
| Semantics | Replace the entire resource representation | Apply a partial update (only supplied fields change) |
| Idempotent | Yes — sending the same full body twice yields the same state | Not guaranteed (e.g. `{ "$inc": { "count": 1 } }`-style patches aren't idempotent) |
| Body | Full resource | Only the changed fields (or a patch document, e.g. JSON Patch) |

Use `PUT` when the client legitimately has and sends the full resource (e.g. a settings form); use `PATCH` for targeted field updates like toggling a flag. The most common mistake is implementing `PUT` as a partial merge — clients then can't rely on PUT to clear fields they omit, silently corrupting the idempotency contract.

```js
app.put('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!users.has(id)) return res.status(404).json({ error: { message: 'User not found' } });
  users.set(id, { id, ...req.body }); // full replace — fields the client omits are dropped
  res.json({ data: users.get(id) });
});
```
