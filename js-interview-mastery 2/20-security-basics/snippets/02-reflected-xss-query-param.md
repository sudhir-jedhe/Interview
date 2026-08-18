# Snippet: Reflected XSS pattern — untrusted query param flows straight into the DOM

*(Browser-only.)*

```js
// URL: https://example.com/search?q=<script>alert(1)</script>
const query = new URLSearchParams(location.search).get("q");
document.getElementById("results").innerHTML = `You searched for: ${query}`;
// DANGEROUS -- never interpolate untrusted strings into an innerHTML template literal.
// Fix: use textContent, or escape/sanitize `query` first.
```
