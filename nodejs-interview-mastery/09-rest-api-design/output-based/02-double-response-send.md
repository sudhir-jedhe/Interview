# Output-Based: Double Response Send

```js
app.get('/orders/:id', (req, res) => {
  const order = findOrder(req.params.id);
  if (!order) {
    res.status(404).json({ error: { message: 'Not found' } });
  }
  res.json({ data: order }); // no return above
});

// client requests an id that does not exist
```

**Answer:** Throws `Error: Cannot set headers after they are sent to the client`.

**Why:** When `order` is missing, the 404 branch sends a response, but execution falls through to the unconditional `res.json` below since there was no `return`. Express doesn't stop your handler — you have to stop it yourself. This is one of the most common real-world bugs in REST handlers.
