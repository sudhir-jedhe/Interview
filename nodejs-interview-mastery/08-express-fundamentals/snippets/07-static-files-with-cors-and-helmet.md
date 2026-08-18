# Serving Static Files and Third-Party Security/CORS Middleware Together

A realistic middleware stack combining security headers, CORS, static file serving, and JSON parsing, in an order that matters.

```js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(helmet());                       // sets security headers
app.use(cors({ origin: 'https://example.com' }));
app.use(express.static('public'));       // serves ./public/* directly, short-circuits matching paths
app.use(express.json());

app.get('/api/ping', (req, res) => res.json({ pong: true }));

app.listen(3000);
```

`helmet()` and `cors()` run first so their headers apply to every response, including static files. `express.static` is placed before `express.json()` since static file requests never carry a JSON body worth parsing — putting `express.json()` first would just do unnecessary work on every static asset request.
