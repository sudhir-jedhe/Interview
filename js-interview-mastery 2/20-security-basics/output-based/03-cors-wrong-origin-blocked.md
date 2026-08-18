# Output: CORS blocks the browser from reading a response for the wrong origin

```js
fetch("https://api.other-domain.com/public-data")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.log("error:", err.message));
// Assume api.other-domain.com responds with Access-Control-Allow-Origin: https://some-third-site.com
// and the calling page's origin is https://my-app.com
```

**Answer:**
```
error: Failed to fetch
```

**Why:** The server *did* process the request and send a response — CORS doesn't block the request from reaching the server. But because `Access-Control-Allow-Origin` names `https://some-third-site.com`, not `https://my-app.com` (the actual calling origin), the browser refuses to expose the response body to the calling script and surfaces it as a generic network-level failure instead, which is why the error message is vague rather than something explicit like "CORS denied" in the caught error object (that detail is only visible in the browser console/network tab, not in JS).
