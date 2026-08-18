# Interview Q&A: CSRF & CORS

**Q: What is CSRF, and how does `SameSite` help prevent it?**
CSRF exploits the browser's automatic attachment of cookies to any request to a given domain, regardless of which site initiated the request — an attacker's page can trigger a state-changing request to a site the victim is logged into, and the browser sends the victim's valid session cookie along with it. The `SameSite` cookie attribute (`Strict` or `Lax`) instructs the browser not to send that cookie on cross-site requests at all, which blocks most CSRF attacks without any server-side token logic.

**Q: What is a CSRF token and how does it work?**
It's a unique, unpredictable value the server generates and embeds in a form or page tied to the user's session; the server then validates that the value submitted with a state-changing request matches what it issued. An attacker's cross-origin page can trigger the request but cannot read the legitimate page's content (same-origin policy blocks that), so it can't obtain a valid token to include, causing the forged request to fail validation.

**Q: Explain the same-origin policy and how CORS relates to it.**
The same-origin policy is the browser's default restriction preventing JavaScript on one origin from reading responses from a different origin. CORS is the mechanism a server uses to explicitly opt certain origins into being allowed to read its responses, via response headers like `Access-Control-Allow-Origin` — it's a controlled relaxation of the same-origin policy, not a separate restriction.

**Q: Does CORS prevent the actual HTTP request from reaching the server?**
No — this is a very common misunderstanding. The request is sent and processed by the server regardless (for "simple" requests); CORS only controls whether the *browser* allows the calling JavaScript to read the response. The exception is a preflighted request, where the browser sends an `OPTIONS` request first and, if the server's response doesn't authorize the actual request, cancels it before ever sending it.

**Q: When does a preflight `OPTIONS` request get triggered?**
It's triggered for "non-simple" requests — those using methods other than GET/POST/HEAD, custom headers, or a `Content-Type` other than a few whitelisted simple values (like `application/x-www-form-urlencoded`). The browser sends `OPTIONS` with `Access-Control-Request-Method` and `Access-Control-Request-Headers` to ask the server for permission before sending the real request.

**Q: Why can't you combine `Access-Control-Allow-Origin: *` with credentialed requests?**
The CORS spec forbids it, and browsers enforce this by refusing to expose the response — allowing a wildcard origin to also receive cookies/credentials would let literally any website on the internet read a user's authenticated data from any site they're logged into, defeating the entire purpose of same-origin protections. Using credentials requires the server to specify a concrete, validated origin instead of `*`.
