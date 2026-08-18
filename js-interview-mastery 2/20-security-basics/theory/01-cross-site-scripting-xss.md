# Cross-Site Scripting (XSS)

XSS happens when untrusted input ends up executed as script in a victim's browser, in the security context of the vulnerable site — meaning the malicious script can read cookies, make authenticated requests, and manipulate the page as if it were legitimate site code.

Three flavors:
- **Stored** — payload saved server-side, e.g. a bio field, and rendered to every later visitor — the most dangerous since it needs no social engineering.
- **Reflected** — payload comes from the request itself, e.g. a URL param, reflected straight back unescaped — needs a victim to click a crafted link.
- **DOM-based** — the whole vulnerability lives in client-side JS — untrusted data like `location.hash` flows into a dangerous sink such as `innerHTML` without ever touching the server.

```js
// DOM-based XSS example: reading directly from the URL and injecting into innerHTML
const params = new URLSearchParams(location.search);
document.getElementById("greeting").innerHTML = "Hello, " + params.get("name");
// Visiting ?name=<img src=x onerror=alert(document.cookie)> executes attacker script
// in the page's own origin -- it can read cookies, call your APIs with the user's session, etc.
```

The root cause is always the same: untrusted data flows into a "sink" that interprets it as code or markup (`innerHTML`, `document.write`, `eval`, `setAttribute("onclick", ...)`) instead of being treated as inert data.

## Comparison: stored vs. reflected vs. DOM-based

| Aspect | Stored XSS | Reflected XSS | DOM-based XSS |
|---|---|---|---|
| Where payload lives | Persisted server-side (DB, file) | In the request itself (URL param, form field) | Never touches the server — client-side JS only |
| Who's affected | Every user who views the poisoned content | Only users tricked into clicking a crafted link | Only users who trigger the vulnerable client-side code path |
| Typical fix location | Server-side output encoding on render | Server-side output encoding on the reflected response | Client-side: avoid unsafe sinks (`innerHTML`, `eval`) with untrusted data |

Stored XSS is generally considered the most severe because it requires no social engineering — every visitor is a victim automatically. The common mistake is assuming server-side escaping alone covers DOM-based XSS, when the vulnerable data flow (e.g., `location.hash` into `innerHTML`) never goes through the server at all.

See `../problems/01-xss-demo-and-fixes.md` for a runnable demonstration and two independent fixes.
