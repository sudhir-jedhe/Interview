# express.Router() for Modular, Mountable Route Groups

A `Router` behaves like a mini standalone app, mounted onto the real app at a path prefix.

```js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ items: [] }));
router.get('/:id', (req, res) => res.json({ id: req.params.id }));

const app = express();
app.use('/api/items', router); // GET /api/items, GET /api/items/:id

app.listen(3000);
```

The router's own route definitions (`'/'`, `'/:id'`) are relative to wherever it gets mounted — moving the mount point from `/api/items` to `/v2/items` requires changing only the `app.use(...)` line, not the router's internal routes.
