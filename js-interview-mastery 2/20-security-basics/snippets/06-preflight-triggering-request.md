# Snippet: A preflight-triggering request (custom header + non-simple method)

*(Browser-only.)*

```js
fetch("https://api.example.com/items/42", {
  method: "PUT",
  headers: { "Content-Type": "application/json", "X-Custom-Header": "1" },
  body: JSON.stringify({ name: "updated" }),
});
// Before sending this, the browser automatically sends:
//   OPTIONS /items/42
//   Access-Control-Request-Method: PUT
//   Access-Control-Request-Headers: content-type, x-custom-header
// The server must respond with matching Access-Control-Allow-Methods/Headers
// or the browser cancels the real request before it's ever sent.
```
