# Scenario: Rendering a comments feed with limited formatting

**You're building a comments feed that renders user-submitted text (which may contain HTML-like characters) alongside a small set of allowed formatting tags (bold, italic, links). How do you render this safely?**

**Approach:**
Never pipe raw user input straight into `innerHTML`. If you only need plain text, use `textContent` — it's immune to injection by construction. If you genuinely need to allow a limited set of tags, run the input through a sanitizer (e.g., DOMPurify) configured with an allowlist before assigning to `innerHTML`, rather than trying to hand-write a regex-based filter (regex-based HTML sanitization is notoriously easy to bypass).

```js
function renderComment(container, rawText) {
  // Safe default: plain text, no formatting risk at all
  const p = document.createElement("p");
  p.textContent = rawText;
  container.append(p);
}

// If limited formatting is required, sanitize first:
function renderFormattedComment(container, rawHtml) {
  const clean = DOMPurify.sanitize(rawHtml, { ALLOWED_TAGS: ["b", "i", "a"], ALLOWED_ATTR: ["href"] });
  const p = document.createElement("p");
  p.innerHTML = clean; // safe because it passed through an allowlist sanitizer
  container.append(p);
}
```

See `../../20-security-basics/` for the full XSS treatment this scenario is grounded in.
