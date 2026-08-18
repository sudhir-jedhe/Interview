# Problem: Demonstrate an XSS vulnerability, then fix it two ways

**Task:** Build a minimal "render user comment" function that is vulnerable to XSS via `innerHTML`, demonstrate the exploit, then fix it with (1) `textContent` and (2) a minimal sanitizer.

## The vulnerable version

```js
function renderCommentUnsafe(container, username, commentText) {
  // DANGEROUS: both username and commentText are untrusted user input,
  // concatenated directly into an HTML string and assigned via innerHTML.
  container.innerHTML = `<p><strong>${username}:</strong> ${commentText}</p>`;
}

const feed = document.getElementById("comment-feed");
renderCommentUnsafe(
  feed,
  "attacker",
  "<img src=x onerror=\"alert('stolen cookies: ' + document.cookie)\">"
);
// As soon as this runs, the onerror handler fires immediately (the browser
// tries to load "x" as an image, fails, and executes the injected script) --
// in the page's own origin, with access to document.cookie, fetch(), etc.
```

## Fix 1: `textContent` (correct choice when no HTML formatting is needed)

```js
function renderCommentSafeTextOnly(container, username, commentText) {
  const p = document.createElement("p");

  const strong = document.createElement("strong");
  strong.textContent = `${username}: `;

  const textNode = document.createTextNode(commentText);

  p.append(strong, textNode);
  container.append(p);
}

renderCommentSafeTextOnly(
  feed,
  "attacker",
  "<img src=x onerror=\"alert('stolen cookies: ' + document.cookie)\">"
);
// Renders the literal text `<img src=x onerror="alert('stolen cookies: ' + document.cookie)">`
// on the page -- nothing executes, because textContent never parses its input as markup.
```

## Fix 2: A minimal sanitizer (for when limited HTML formatting genuinely is required)

```js
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderCommentSafeEscaped(container, username, commentText) {
  // Escape BOTH untrusted values before building the HTML string --
  // escaping only one of them (e.g. just commentText) still leaves the other exploitable.
  const safeUsername = escapeHtml(username);
  const safeComment = escapeHtml(commentText);
  container.innerHTML = `<p><strong>${safeUsername}:</strong> ${safeComment}</p>`;
}

renderCommentSafeEscaped(
  feed,
  "attacker",
  "<img src=x onerror=\"alert('stolen cookies: ' + document.cookie)\">"
);
// Renders the escaped text as visible markup characters (&lt;img src=x ...&gt;)
// instead of a real <img> element -- no execution.
```

## Important caveat on the hand-rolled escaper

`escapeHtml` above is fine for escaping plain text into an HTML *text* context (like this example). It is **not** a general-purpose HTML sanitizer — it can't safely allow *some* tags through (e.g., "let `<b>` and `<a href>` survive, strip everything else"), and regex-based attempts at that are well-documented to have bypasses. For any case where you need to preserve real markup from an untrusted source, use a maintained allowlist sanitizer like DOMPurify instead (see `../scenarios/01-bio-field-stored-xss.md`), and reserve simple entity-escaping for pure "display as literal text" cases where `textContent` isn't a workable option (e.g., building a raw HTML string for a template engine that doesn't offer node-based insertion).
