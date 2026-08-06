
✅ XSS (Cross-Site Scripting)
👉 Attacker injects malicious JS through user input, and it runs inside other users' browsers.

✅ CSRF (Cross-Site Request Forgery)
👉 A malicious site tricks a logged-in user's browser into sending requests to your app without consent.

✅ Man-in-the-Middle Attacks
👉 Attacker intercepts data while it's travelling between client and server.

✅ Sensitive Data Exposure
👉 API keys, tokens, or secrets accidentally leaking through client-side code.

✅ Clickjacking
👉 Your app gets loaded inside a hidden iframe to trick users into clicking something else.

✅ Dependency Vulnerabilities
👉 An outdated or malicious npm package quietly becomes your biggest risk.

Now, since we learnt about the threats, let's go further and learn how to secure a ReactJS app against them.

✅ Prevent XSS
👉 React escapes `{variable}` content by default, so it won't run as HTML.
👉 Avoid `dangerouslySetInnerHTML`. If you must use it, sanitize first with `DOMPurify`.
👉 Never inject user input directly into `href`, `src`, or inline styles.

✅ Keep Dependencies Clean
👉 Run `npm audit` regularly.
👉 Use Dependabot or Snyk for automated vulnerability alerts.
👉 Avoid installing random low-download packages just to save time.

✅ Never Expose Secrets in the Client
👉 Anything in `.env` with `REACT_APP_` (CRA) or `import.meta.env` (Vite) gets bundled into your client JS.
👉 That means it is NOT secret. API keys and private tokens must stay server-side.

✅ Handle Auth Tokens Carefully
👉 Avoid storing JWTs in `localStorage` when possible, since any injected JS can read it.
👉 Prefer `httpOnly` cookies set by the server, JS cannot access those.
👉 Keep token lifetimes short.
