# Security Basics

This topic covers the security concepts every frontend developer needs to reason about, even without a dedicated security role: cross-site scripting (XSS) and how untrusted content rendered as HTML becomes executable script, cross-site request forgery (CSRF) and why cookie-based auth needs explicit protection, and CORS — one of the most commonly misunderstood browser mechanisms, since it's a *browser-enforced* restriction, not a server-side security boundary. It closes with Content-Security-Policy as a defense-in-depth layer and the non-negotiable rule that client-side validation is a UX nicety, never a security control.

What's covered:
- XSS: stored, reflected, and DOM-based, and how `innerHTML`/`document.write` with untrusted input causes it
- Safe alternatives: `textContent`, sanitization libraries, framework auto-escaping
- CSRF and why cookie-based auth is vulnerable without protection (SameSite cookies, CSRF tokens)
- CORS mechanics: same-origin policy, preflight OPTIONS requests, what `Access-Control-Allow-Origin` actually does
- Content-Security-Policy basics
- Why client-side validation alone is never sufficient

## Structure

- `theory/` — concept notes: XSS, safe rendering alternatives, CSRF, CORS mechanics, CSP, client-side validation vs. real security boundaries.
- `snippets/` — one runnable snippet per file.
- `output-based/` — one "what does this log" question per file, with the answer and reasoning.
- `scenarios/` — one real-world scenario per file, with an approach and code.
- `interview-qa/` — Q&A grouped into themed files (XSS, CSRF & CORS, validation & trust boundaries).
- `problems/` — hands-on "implement X" challenges with full solutions: an XSS demo with two independent fixes, a CSRF-token generate/attach/verify simulation, input validation & sanitization for untrusted text.
- `assets/` — placeholder for images/PDFs from your original notes.

This topic has no `from-your-notes/` folder (none existed for it in the original source) and no standalone `projects/` folder.

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
