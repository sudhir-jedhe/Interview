# Output-Based: PATCH vs PUT Semantics with Missing Fields

```js
let user = { id: 1, name: 'Jed', age: 30 };

app.put('/users/1', (req, res) => {
  user = { id: 1, ...req.body }; // full replace
  res.json({ data: user });
});

// client sends PUT /users/1 with body { "name": "Sudhir" }
```

**Answer:** `{ "data": { "id": 1, "name": "Sudhir" } }` — `age` is gone.

**Why:** `PUT` is defined as replacing the *entire* resource representation. Because the handler does a full overwrite rather than a merge, any field the client omits (`age`) disappears from the stored resource. This is correct PUT semantics — the bug would be expecting PUT to behave like PATCH (a merge).
