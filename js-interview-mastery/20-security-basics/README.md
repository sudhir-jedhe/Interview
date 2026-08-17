# Security Basics

This topic covers the security concepts every frontend developer needs to reason about, even without a dedicated security role: cross-site scripting (XSS) and how untrusted content rendered as HTML becomes executable script, cross-site request forgery (CSRF) and why cookie-based auth needs explicit protection, and CORS — one of the most commonly misunderstood browser mechanisms, since it's a *browser-enforced* restriction, not a server-side security boundary. It closes with Content-Security-Policy as a defense-in-depth layer and the non-negotiable rule that client-side validation is a UX nicety, never a security control.

What's covered:
- XSS: stored, reflected, and DOM-based, and how `innerHTML`/`document.write` with untrusted input causes it
- Safe alternatives: `textContent`, sanitization libraries, framework auto-escaping
- CSRF and why cookie-based auth is vulnerable without protection (SameSite cookies, CSRF tokens)
- CORS mechanics: same-origin policy, preflight OPTIONS requests, what `Access-Control-Allow-Origin` actually does
- Content-Security-Policy basics
- Why client-side validation alone is never sufficient

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
