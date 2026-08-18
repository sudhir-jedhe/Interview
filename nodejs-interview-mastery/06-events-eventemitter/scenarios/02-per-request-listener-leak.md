# Fixing a Per-Request Listener Leak on a Shared DB Emitter

**Scenario:** Your Express app creates a new database-connection-status listener inside every request handler to react to `db.on('reconnect', ...)`, and after a few hours in production you see `MaxListenersExceededWarning` and rising memory. How do you fix it?

**Approach:** The bug is registering a new listener on a long-lived `db` EventEmitter on every request instead of once at startup. The fix is to move the listener registration out of the request path entirely, and if a request genuinely needs a one-time signal, use `.once()` with a per-request scope that unsubscribes properly.

```js
// WRONG — leaks a listener on every request
app.get('/status', (req, res) => {
  db.on('reconnect', () => console.log('db reconnected'));
  res.send('ok');
});

// RIGHT — register once, outside the request handler
db.on('reconnect', () => console.log('db reconnected'));

app.get('/status', (req, res) => {
  res.json({ connected: db.isConnected() });
});
```

If a request truly needs to wait for a one-time event (e.g., wait for the next reconnect before responding), use `.once()` and clean it up on timeout to avoid leaks from abandoned requests:

```js
app.get('/wait-for-reconnect', (req, res) => {
  const onReconnect = () => {
    clearTimeout(timer);
    res.json({ reconnected: true });
  };
  const timer = setTimeout(() => {
    db.off('reconnect', onReconnect); // prevent leak if client never gets a reconnect
    res.status(504).json({ error: 'timeout' });
  }, 5000);
  db.once('reconnect', onReconnect);
});
```

See `problems/03-fix-listener-memory-leak.md` for a more general, standalone diagnosis-and-fix pattern for this class of bug.
