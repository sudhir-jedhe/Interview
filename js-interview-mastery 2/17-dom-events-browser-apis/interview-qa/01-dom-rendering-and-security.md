# Interview Q&A: DOM Rendering & Security

**Q: What's the difference between `textContent` and `innerHTML`, and why does it matter for security?**
`textContent` sets or reads plain text and never parses its input as markup, so any string — including `<script>` tags — is rendered literally and inertly. `innerHTML` parses the assigned string as HTML, creating real DOM elements (and executing inline event handlers like `onerror`), which means untrusted input passed to it can run arbitrary script — the core mechanism behind DOM-based XSS.
