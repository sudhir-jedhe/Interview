# Scenario: Your app stores user "about me" bios and renders them on public profile pages — a pentester submitted `<script>` in their bio and it executed

You're fixing a stored XSS vulnerability: bios are saved as-is and interpolated directly into server-rendered HTML.

**Approach:** Fix this at two layers — sanitize/escape on output (the actual fix for XSS) and add a Content-Security-Policy as defense-in-depth in case an escaping bug slips through elsewhere:

```js
const escapeHtml = require('escape-html'); // or a templating engine that auto-escapes

app.get('/profile/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  // If the template engine doesn't auto-escape, escape explicitly:
  res.send(`<div class="bio">${escapeHtml(user.bio)}</div>`);
});
```

```js
// Defense in depth: CSP restricts what injected scripts (if any slip through) can do
const helmet = require('helmet');
app.use(
  helmet.contentSecurityPolicy({
    directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"] }, // blocks inline <script> execution
  })
);
```

The key lesson: validating input on the way in ("is this a reasonable-length string?") doesn't prevent XSS — the vulnerability lives at the *output* step where untrusted data is interpolated into HTML without escaping. If bios need to support limited rich text (bold, links), sanitize with an allowlist-based library (`sanitize-html`, `DOMPurify` server-side) rather than escaping everything, which would break legitimate formatting.
