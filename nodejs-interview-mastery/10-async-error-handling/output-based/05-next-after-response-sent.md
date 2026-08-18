# Output-Based: Multiple next(err) Calls / Calling next After Sending a Response

```js
app.get('/thing', async (req, res, next) => {
  try {
    res.json({ ok: true });
    throw new Error('oops, after response sent');
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log('error handler:', err.message);
  res.status(500).json({ error: err.message }); // this line runs
});
```

**Answer:** The client still receives the original `{ "ok": true }` response (headers already flushed), `"error handler: oops, after response sent"` is logged to the server console, and then the error middleware's `res.status(500).json(...)` call throws a further `Cannot set headers after they are sent` error (typically unhandled, logged by Express's default handling for that case).

**Why:** `res.json` sends the response synchronously as far as the handler is concerned; the subsequent `throw` is still caught by the local `try/catch` and forwarded via `next(err)`, which *does* invoke the error middleware — Express doesn't know the response was already sent. The error middleware then attempts to send a second response, which throws again because HTTP headers can only be sent once per request.
