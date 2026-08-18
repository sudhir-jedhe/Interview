# Scenario: A third-party API call fails with CORS in the browser but works in Postman

**Your frontend team wants to call a third-party partner's API directly from the browser, but requests are failing with a CORS error even though the API works fine when called from a backend service or Postman. How do you explain what's happening and what needs to change?**

**Approach:**
This is expected behavior, not a bug in the frontend code: the same-origin policy is enforced entirely by the *browser*, so tools like Postman or a server-to-server call (which aren't browsers) never trigger it — the API itself is reachable and working fine, as evidenced by those tools succeeding. The fix has to happen on the partner API's side: they need to respond with an `Access-Control-Allow-Origin` header that includes your app's origin (and handle the preflight `OPTIONS` request correctly if the call uses custom headers or non-simple methods). If the partner can't or won't add CORS headers, the alternative is routing the request through your own backend as a proxy, since server-to-server calls aren't subject to CORS at all.

```js
// This fails in the browser with a CORS error if partner-api.com doesn't
// send an Access-Control-Allow-Origin header matching your origin:
fetch("https://partner-api.com/data").then(res => res.json());

// Workaround: proxy through your own backend, which isn't a browser and isn't CORS-restricted
fetch("/api/proxy/partner-data").then(res => res.json());
```
