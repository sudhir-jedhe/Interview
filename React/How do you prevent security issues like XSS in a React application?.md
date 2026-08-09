Preventing Cross-Site Scripting (XSS) in a React application relies on leveraging React's built-in defenses while avoiding dangerous anti-patterns and securing client-side data flows.

---

## 1. Rely on React’s Built-in HTML Escaping

By default, React automatically escapes all values embedded in JSX expressions before rendering them to the DOM. String values inside `{}` are converted to plain text, preventing malicious HTML or script tags from executing.

```tsx
// Malicious user input
const userInput = '<script>alert("Hacked!")</script>';

// ✅ Safe: React renders this as string text, NOT executable HTML
return <div>{userInput}</div>;

```

---

## 2. Avoid `dangerouslySetInnerHTML`

`dangerouslySetInnerHTML` bypasses React's built-in escaping mechanism and injects raw HTML into the DOM.

```tsx
// ❌ Dangerous: Any script in userInput will execute!
<div dangerouslySetInnerHTML={{ __innerHTML: userInput }} />

```

### If You MUST Render HTML (Sanitization)

When rendering rich text or user-generated HTML, always sanitize the content first using a battle-tested library like **DOMPurify**:

```tsx
import DOMPurify from 'dompurify';

// ✅ Safe: DOMPurify strips out <script> tags and malicious attributes
const cleanHtml = DOMPurify.sanitize(userInput);

return <div dangerouslySetInnerHTML={{ __innerHTML: cleanHtml }} />;

```

---

## 3. Sanitize Dynamic URLs (Preventing `javascript:` Execution)

React escapes HTML inside JSX text, but **it does NOT automatically sanitize URL attributes** (such as `<a href="...">` or `<iframe src="...">`). If a user provides a URL starting with `javascript:`, clicking the link will execute arbitrary code.

```tsx
// ❌ Dangerous: User can supply "javascript:alert('Hacked!')"
<a href={userProvidedUrl}>User Profile</a>

```

### The Fix: Validate URL Protocols

Always validate or sanitize user-supplied URLs to ensure they use safe protocols (`http:`, `https:`, `mailto:`):

```tsx
function SafeLink({ url, children }: { url: string; children: React.ReactNode }) {
  const isSafe = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:');

  // Fallback to a safe link if validation fails
  return <a href={isSafe ? url : '#'}>{children}</a>;
}

```

---

## 4. Implement a Strict Content Security Policy (CSP)

A **Content Security Policy (CSP)** is an HTTP header sent by the server that controls which resources (scripts, styles, images) the browser is allowed to load and execute. It acts as a critical secondary line of defense against XSS.

### Example CSP Header Configuration

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com; object-src 'none';

```

* **`script-src 'self'`**: Only allow scripts served from the same origin.
* **Avoid `'unsafe-inline'**`: Prevents execution of inline `<script>` tags injected by attackers.
* **Use Nonces or Hashes:** For inline scripts required during SSR or bundle bootstrapping, pass a server-generated cryptographically random nonce:

```http
Content-Security-Policy: script-src 'self' 'nonce-rAnd0m12345';

```

---

## 5. Prevent XSS via State and SSR Injections

When using Server-Side Rendering (SSR) or React Server Components (RSC), initial state is often serialized into JSON and embedded in an inline `<script>` tag on the initial page load.

```html
<!-- ❌ Dangerous: Raw JSON containing </script> can break out of the tag! -->
<script>
  window.__INITIAL_STATE__ = {"user": "</script><script>alert('xss')</script>"};
</script>

```

### The Fix: Serialize Safely

Use libraries like **`serialize-javascript`** instead of raw `JSON.stringify()` to properly escape HTML entities and script boundaries:

```tsx
import serialize from 'serialize-javascript';

<script
  dangerouslySetInnerHTML={{
    __html: `window.__INITIAL_STATE__ = ${serialize(initialState, { isJSON: true })};`,
  }}
/>

```

---

## 6. Secure Cookie and Token Storage

If an attacker successfully executes an XSS vulnerability, their primary goal is usually stealing sensitive authentication tokens stored in `localStorage` or `sessionStorage`.

* **Use `HttpOnly` Cookies:** Store session tokens or JWTs in HTTP cookies marked with `HttpOnly`, `Secure`, and `SameSite=Strict`. JavaScript cannot access `HttpOnly` cookies via `document.cookie`, preventing attackers from stealing tokens via XSS.
* **Avoid `localStorage` for Sensitive Auth Tokens:** Tokens stored in `localStorage` are globally accessible to any script running on the page.

---

## Summary Checklist

| Defense Mechanism           | Vulnerability Addressed     | Recommended Implementation                                  |
| --------------------------- | --------------------------- | ----------------------------------------------------------- |
| **Default JSX `{}**`        | HTML Injection              | Built-in (Always use standard JSX interpolation).           |
| **DOMPurify**               | Unsanitized Rich Text       | Wrap inputs passed to `dangerouslySetInnerHTML`.            |
| **URL Protocol Validation** | `javascript:` URL execution | Validate protocols (`https:`) on `<a href>` and `<iframe>`. |
| **HTTP CSP Headers**        | Script Injection Execution  | Set strict server headers (`script-src 'self'`).            |
| **`serialize-javascript`**  | SSR Initial State Injection | Replace raw `JSON.stringify()` in HTML templates.           |
| **`HttpOnly` Cookies**      | Token Theft via XSS         | Store auth session cookies off client-side JS reach.        |
