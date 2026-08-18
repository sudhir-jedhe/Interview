# Output-Based: Error Middleware Placement

```js
app.get('/risky', (req, res) => {
  throw new Error('boom');
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: { message: err.message } });
});

app.get('/after', (req, res) => res.json({ ok: true }));

// GET /risky, then GET /after
```

**Answer:** `GET /risky` returns `500 { "error": { "message": "boom" } }`. `GET /after` still works fine afterward — it returns `{ "ok": true }`.

**Why:** Synchronous throws inside a regular (non-async) route handler are caught automatically by Express and routed to the error-handling middleware (identified by its 4-argument signature). Because error middleware doesn't crash the process, subsequent unrelated requests are unaffected. The trap here is conflating this safe synchronous case with the classic async-handler bug, where a thrown error inside an `async` function is *not* automatically caught by Express (covered in the async-error-handling topic).
