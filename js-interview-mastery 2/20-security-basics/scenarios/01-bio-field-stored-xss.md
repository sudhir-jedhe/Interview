# Scenario: A user "bio" field with basic formatting, shown to every visitor

**You're building a user profile page that displays a "bio" field users can edit, including basic formatting (bold, italics, links). The bio is stored in your database and shown to every visitor of the profile. How do you render it safely, and what's the specific risk if you get this wrong?**

**Approach:**
This is a stored XSS risk: since the bio is persisted and shown to *every* visitor, a single malicious bio (e.g., containing `<img src=x onerror="steal cookies/session">`) would compromise every user who views that profile, not just the author. Never store or render raw HTML from user input directly. Instead, store the bio as plain text or a constrained markup format (like Markdown), and when rendering, either use `textContent` for plain text or run any HTML output through a sanitizer with a strict allowlist before inserting it.

```js
import DOMPurify from "dompurify";

function renderBio(container, rawBio) {
  // If bio supports limited formatting (e.g., converted from Markdown to HTML server-side or client-side):
  const html = markdownToHtml(rawBio); // produces HTML from a constrained subset
  container.innerHTML = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "a", "p", "br"],
    ALLOWED_ATTR: ["href"],
  });
}
```
Sanitize on render (or at minimum, on write *and* re-sanitize on any migration/import), and never trust that "we already sanitized it once" holds true forever as sanitizer configs and libraries change.
