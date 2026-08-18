# Snippet: `fetch` with credentials — CORS explicitly forbids wildcard origin here

*(Browser-only.)*

```js
fetch("https://api.example.com/account", {
  credentials: "include", // send cookies cross-origin
})
  .then(res => res.json())
  .catch(err => console.log("blocked or failed:", err));
// The server's response MUST include a specific Access-Control-Allow-Origin
// (not "*") AND Access-Control-Allow-Credentials: true, or the browser
// refuses to expose the response to this script.
```
