# Snippet: A minimal (illustrative, not production-grade) HTML-escaping helper

```js
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

console.log(escapeHtml("<script>alert(1)</script>"));
// "&lt;script&gt;alert(1)&lt;/script&gt;" -- renders as literal text if inserted via innerHTML
```

See `../problems/01-xss-demo-and-fixes.md` for this used as one of two independent fixes to a demonstrated XSS vulnerability.
