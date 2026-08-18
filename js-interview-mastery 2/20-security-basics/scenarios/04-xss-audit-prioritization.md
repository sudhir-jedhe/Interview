# Scenario: Auditing a codebase for XSS before a security review

**Your team is auditing the app for XSS before a security review. You find several places where user-controlled data (usernames, search queries, URL parameters) is inserted into the DOM via template literals and `innerHTML`. How do you prioritize and fix these systematically?**

**Approach:**
First, triage by data flow: does the value come from persisted storage visible to other users (highest priority — stored XSS), from the URL/query string (reflected/DOM-based), or is it fully static/trusted (no risk)? For each real risk, the default fix is switching to `textContent` if no HTML formatting is actually needed — the majority of "usernames" and "search queries" cases fall here. For genuine rich-content cases, introduce a sanitizer at the render boundary. As a systemic fix beyond one-off patches, add an ESLint rule (e.g., `no-unsanitized/property`) to flag any future `innerHTML` assignment for manual review, and consider adding a `Content-Security-Policy` header as a safety net that blocks inline/injected scripts even if a sanitization bug slips through later.

```js
// Before (risky):
resultsEl.innerHTML = `You searched for: ${query}`;

// After (safe):
resultsEl.textContent = `You searched for: ${query}`;
```
