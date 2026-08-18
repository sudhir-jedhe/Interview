# Output-Based: Content Negotiation Default

```js
app.get('/report', (req, res) => {
  res.json({ total: 42 });
});

// client sends: curl -H "Accept: text/plain" http://localhost:3000/report
```

**Answer:** The client still receives a JSON body with `Content-Type: application/json`, HTTP 200.

**Why:** `res.json()` unconditionally serializes to JSON and sets the `Content-Type` header — it ignores the `Accept` header entirely. True content negotiation requires `res.format({...})` to branch on `req.accepts()`. A common interview trap is assuming Express does automatic content negotiation just because the client sent an `Accept` header.
