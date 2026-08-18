# URL Parsing and + Decoding in Query Strings

```js
const http = require('http');
const { URL } = require('url');

const req = { url: '/search?q=node+js&page=2', headers: { host: 'example.com' } };
const parsed = new URL(req.url, `http://${req.headers.host}`);
console.log(parsed.searchParams.get('q'));
console.log(parsed.pathname);
```

**Answer:** `node js`, then `/search`.

**Why:** `URLSearchParams.get()` automatically decodes `+` as a space within query strings (per `application/x-www-form-urlencoded` convention), so `node+js` becomes `node js`. `pathname` correctly extracts just the path portion, excluding the query string.
