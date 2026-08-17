# Interview Questions: Security Basics

**Q: What is XSS, and what are the three main types?**
Cross-site scripting is a vulnerability where untrusted input is executed as script in a victim's browser within the vulnerable site's own security context, letting the attacker read cookies, make authenticated API calls, or manipulate the page. Stored XSS persists the payload server-side and affects every viewer; reflected XSS comes from the current request (e.g., a URL parameter) and is immediately echoed back unescaped; DOM-based XSS never touches the server — untrusted data flows into a dangerous client-side sink like `innerHTML` entirely within JavaScript.

**Q: Why is `innerHTML` dangerous with untrusted input, and what should you use instead?**
`innerHTML` parses its assigned string as HTML, creating real DOM nodes and firing inline event handlers (`onerror`, `onload`, etc.) — if that string comes from user input, an attacker can embed a payload that executes arbitrary JavaScript in the page's own origin. `textContent` is the safe default for displaying text since it never parses its input as markup; if actual HTML rendering is required, the input must first pass through a maintained sanitizer library with an allowlist, not custom regex stripping.

**Q: Are `<script>` tags injected via `innerHTML` actually executed?**
No — browsers deliberately do not execute `<script>` tags inserted via `innerHTML`; this is spec behavior specifically to block that injection vector. This does not make `innerHTML` safe, though, since other vectors like `<img onerror="...">` or `<svg onload="...">` do execute their event handler attributes once inserted into the live DOM.

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

**Q: What is Content-Security-Policy and what does it protect against?**
CSP is a response header that lets a server declare an allowlist of sources browsers are permitted to load and execute scripts, styles, images, etc. from. It's a defense-in-depth layer against XSS specifically — even if an attacker manages to inject a `<script>` tag through a sanitization bug, a policy like `script-src 'self'` makes the browser refuse to execute it if it's inline or from an unlisted domain.

**Q: Why is client-side validation never sufficient on its own?**
Anything running in the browser is fully controllable by the end user — they can disable JavaScript, edit the DOM/form attributes via DevTools, or bypass the browser entirely by sending crafted requests directly to the API with tools like `curl` or Postman. Client-side checks are valuable for instant UX feedback, but every check that actually matters for security, data integrity, or business rules must be independently enforced on the server, which is the only party the client can't tamper with.

**Q: What does `HttpOnly` do for a cookie, and how does it relate to XSS?**
`HttpOnly` is a cookie attribute (set by the server via the `Set-Cookie` header) that makes the cookie inaccessible to `document.cookie` and any other JavaScript API — only the browser itself can send it in HTTP requests. It mitigates the impact of an XSS vulnerability by preventing injected script from stealing the session cookie directly, even if the attacker successfully runs arbitrary JS on the page.
