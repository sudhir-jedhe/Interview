# setHeader() Overwrites, Doesn't Append

```js
const http = require('http');
const server = http.createServer((req, res) => {
  res.setHeader('X-Custom', 'value1');
  res.setHeader('X-Custom', 'value2');
  res.end();
});
server.listen(3000, () => {
  http.get('http://localhost:3000', (res) => {
    console.log(res.headers['x-custom']);
  });
});
```

**Answer:** `value2`.

**Why:** `res.setHeader(name, value)` overwrites any previous value for that header name rather than appending — calling it twice with the same name just replaces the value. (To send multiple values for the same header, you'd pass an array as the value.)
