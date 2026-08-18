# Interview Q&A: XSS

**Q: What is XSS, and what are the three main types?**
Cross-site scripting is a vulnerability where untrusted input is executed as script in a victim's browser within the vulnerable site's own security context, letting the attacker read cookies, make authenticated API calls, or manipulate the page. Stored XSS persists the payload server-side and affects every viewer; reflected XSS comes from the current request (e.g., a URL parameter) and is immediately echoed back unescaped; DOM-based XSS never touches the server — untrusted data flows into a dangerous client-side sink like `innerHTML` entirely within JavaScript.

**Q: Why is `innerHTML` dangerous with untrusted input, and what should you use instead?**
`innerHTML` parses its assigned string as HTML, creating real DOM nodes and firing inline event handlers (`onerror`, `onload`, etc.) — if that string comes from user input, an attacker can embed a payload that executes arbitrary JavaScript in the page's own origin. `textContent` is the safe default for displaying text since it never parses its input as markup; if actual HTML rendering is required, the input must first pass through a maintained sanitizer library with an allowlist, not custom regex stripping.

**Q: Are `<script>` tags injected via `innerHTML` actually executed?**
No — browsers deliberately do not execute `<script>` tags inserted via `innerHTML`; this is spec behavior specifically to block that injection vector. This does not make `innerHTML` safe, though, since other vectors like `<img onerror="...">` or `<svg onload="...">` do execute their event handler attributes once inserted into the live DOM.

**Q: What does `HttpOnly` do for a cookie, and how does it relate to XSS?**
`HttpOnly` is a cookie attribute (set by the server via the `Set-Cookie` header) that makes the cookie inaccessible to `document.cookie` and any other JavaScript API — only the browser itself can send it in HTTP requests. It mitigates the impact of an XSS vulnerability by preventing injected script from stealing the session cookie directly, even if the attacker successfully runs arbitrary JS on the page.

**Q: What is Content-Security-Policy and what does it protect against?**
CSP is a response header that lets a server declare an allowlist of sources browsers are permitted to load and execute scripts, styles, images, etc. from. It's a defense-in-depth layer against XSS specifically — even if an attacker manages to inject a `<script>` tag through a sanitization bug, a policy like `script-src 'self'` makes the browser refuse to execute it if it's inline or from an unlisted domain.
