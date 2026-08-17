# Notes: Security Basics

## Cross-Site Scripting (XSS)

XSS happens when untrusted input ends up executed as script in a victim's browser, in the security context of the vulnerable site — meaning the malicious script can read cookies, make authenticated requests, and manipulate the page as if it were legitimate site code. Three flavors: **stored** (payload saved server-side, e.g. a bio field, and rendered to every later visitor — the most dangerous since it needs no social engineering), **reflected** (payload comes from the request itself, e.g. a URL param, reflected straight back unescaped — needs a victim to click a crafted link), and **DOM-based** (the whole vulnerability lives in client-side JS — untrusted data like `location.hash` flows into a dangerous sink such as `innerHTML` without ever touching the server).

```js
// DOM-based XSS example: reading directly from the URL and injecting into innerHTML
const params = new URLSearchParams(location.search);
document.getElementById("greeting").innerHTML = "Hello, " + params.get("name");
// Visiting ?name=<img src=x onerror=alert(document.cookie)> executes attacker script
// in the page's own origin -- it can read cookies, call your APIs with the user's session, etc.
```

The root cause is always the same: untrusted data flows into a "sink" that interprets it as code or markup (`innerHTML`, `document.write`, `eval`, `setAttribute("onclick", ...)`) instead of being treated as inert data.

## Safe alternatives

`textContent` never parses its input as HTML, so it's immune to markup injection by construction — use it whenever you're just displaying text. If you must render actual HTML from an untrusted source (e.g., a rich-text comment), run it through a dedicated sanitizer with an allowlist (like DOMPurify) rather than hand-rolled regex stripping, which is notoriously easy to bypass. Modern frameworks (React, Vue, Angular) auto-escape interpolated values by default — `{userInput}` in JSX is rendered as text, not markup — but each has an explicit "danger" escape hatch (`dangerouslySetInnerHTML`, `v-html`) that reintroduces the same risk if fed untrusted data.

## Cross-Site Request Forgery (CSRF)

CSRF exploits the fact that browsers automatically attach cookies to requests regardless of which site initiated them. If a user is logged into `bank.com` and then visits a malicious site that silently submits a form to `bank.com/transfer`, the browser attaches the valid session cookie, and the request looks legitimate to the server — even though the user never intended it.

```html
<!-- On attacker.com, auto-submitted via JS onload -->
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="to" value="attacker-account" />
</form>
```

Defenses: the `SameSite` cookie attribute (`Strict` or `Lax`) tells the browser not to send the cookie on cross-site requests, blocking most CSRF by default; CSRF tokens are an unpredictable value embedded in forms that the server validates against the user's session — an attacker's page can't obtain a valid one because same-origin policy blocks it from reading the legitimate page's content.

## CORS mechanics

The **same-origin policy** is the browser's default rule: JavaScript running on `siteA.com` cannot read responses from `siteB.com` unless `siteB.com` explicitly allows it. CORS (Cross-Origin Resource Sharing) is the mechanism for that explicit opt-in — it's a relaxation of the same-origin policy, enforced entirely by the *browser*, not a server-side security feature.

For "simple" requests (basic GET/POST with standard headers), the browser sends the request and then checks the response's `Access-Control-Allow-Origin` header before letting JavaScript read the response body — the request still *happens* server-side either way. For more complex requests (custom headers, methods like `PUT`/`DELETE`, `Content-Type: application/json`), the browser first sends a **preflight** `OPTIONS` request asking "would you allow this actual request?", and only sends the real one if the preflight response permits it.

This header, set by the *server*, tells the browser which origins may read the response via JavaScript — it's commonly misunderstood as a wall that blocks the request from reaching the server, but it doesn't; the server still processes it. What it blocks is the *browser* handing the response back to the calling script if the origin isn't allowed. `Access-Control-Allow-Origin: *` means any origin can read the response (fine for public data; forbidden by spec when combined with credentialed requests).

## Content-Security-Policy (CSP)

CSP is a response header letting a server declare which sources of scripts, styles, and images the browser may load/execute, as a defense-in-depth layer against XSS. A policy like `Content-Security-Policy: script-src 'self'` makes the browser refuse to execute inline `<script>` tags or scripts from any domain other than the page's own — so even if an attacker injects a `<script>` tag via a missed sanitization bug, the browser simply won't run it.

## Never trust client-side validation alone

Client-side validation (JS form checks, HTML5 `required`/`pattern`) exists purely for UX — instant feedback without a round trip. It provides zero security, because anyone can bypass it: disable JavaScript, edit the DOM via DevTools, or send a crafted request directly to the API with `curl`/Postman, skipping the browser entirely. Every check that matters for security or data integrity must be re-enforced on the server, the only party the client can't tamper with.
