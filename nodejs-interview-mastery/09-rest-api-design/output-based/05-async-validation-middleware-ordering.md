# Output-Based: Async Validation Middleware Ordering

```js
app.post('/orders',
  (req, res, next) => { console.log('A'); next(); },
  async (req, res, next) => {
    console.log('B');
    await validateAgainstInventory(req.body); // takes 50ms
    console.log('C');
    next();
  },
  (req, res) => { console.log('D'); res.json({ ok: true }); }
);
// request comes in
```

**Answer:** `A`, `B`, `C`, `D` — always in that order.

**Why:** Even though the second middleware is `async`, Express still runs the middleware chain sequentially because each function only proceeds to the next when `next()` is explicitly called. The `await` pauses *within* that middleware but doesn't let a later middleware run early — `next()` isn't invoked until after `console.log('C')`. The trap is assuming async middleware introduces interleaving; it doesn't unless you call `next()` before an async operation completes.
