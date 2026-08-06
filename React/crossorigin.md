Here is a technical breakdown of the `crossorigin` HTML attribute, detailing **Cross-Origin Resource Sharing (CORS) mode switching**, **Opaque Responses**, **Subresource Integrity (SRI)**, and **Cross-Origin Error Masking (`Script error.`)**.

---

# The HTML `crossorigin` Attribute: Security & Error Inspection

When a browser encounters a `<script>` tag pointing to an external domain (e.g., loading a CDN asset from `[https://cdn.example.com/script.js](https://cdn.example.com/script.js)` on `[https://my-app.com](https://my-app.com)`), it defaults to a **no-cors** request mode.

Adding `crossorigin` explicitly switches the browser's request mode to **CORS**, altering how credentials are transmitted, how the response is stored in memory, and whether browser subsystems can inspect the file.

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │ NO CROSSORIGIN ATTRIBUTE (Default: no-cors mode)                       │
 │ • Response is OPAQUE (Black box)                                       │
 │ • Window.onerror yields masked "Script error."                         │
 │ • Subresource Integrity (SRI) integrity="..." FAILS                    │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼ Add crossorigin="anonymous"
 ┌────────────────────────────────────────────────────────────────────────┐
 │ CROSSORIGIN="ANONYMOUS" (CORS mode)                                    │
 │ • Sends sec-fetch-mode: cors (No cookies/credentials sent)            │
 │ • Requires server header: Access-Control-Allow-Origin: *               │
 │ • Enables full stack traces in window.onerror & SRI verification        │
 └────────────────────────────────────────────────────────────────────────┘

```

---

## 1. Opaque Responses & Why SRI Requires CORS

When a cross-origin resource is loaded without CORS (`no-cors` mode), the browser wraps the response in an **Opaque Response**.

To prevent cross-site data leaks (e.g., an attacker using a `<script>` tag to read private user JSON or sensitive HTML from another site), the browser executes the JavaScript binary but **blocks the client-side environment from reading the underlying bytes**.

### Why Subresource Integrity (SRI) Fails Without CORS

Subresource Integrity relies on the browser calculating a cryptographic hash (SHA-256, SHA-384, or SHA-512) over the exact raw response bytes before execution:

```html
<!-- ❌ WRONG: SRI will fail because the opaque response blocks byte inspection -->
<script 
  src="https://cdn.example.com/library.js" 
  integrity="sha384-oqVuAfXR..."
></script>

<!-- ✅ CORRECT: CORS mode allows byte inspection to verify the hash -->
<script 
  src="https://cdn.example.com/library.js" 
  integrity="sha384-oqVuAfXR..." 
  crossorigin="anonymous"
></script>

```

If `crossorigin` is omitted when using an `integrity` attribute, the browser cannot inspect the raw byte stream to calculate the checksum. **The browser rejects the script and refuses to execute it.**

---

## 2. Solving the Cryptic `"Script error."` Bug

Without `crossorigin`, if a third-party CDN script throws an unhandled runtime error, the browser’s `window.onerror` handler suppresses the error details for security reasons:

```text
 ❌ Without crossorigin:
 Uncaught Script error. at line 0, column 0. (No message, no stack trace, no line number)

 ✅ With crossorigin="anonymous" (and Access-Control-Allow-Origin header):
 Uncaught TypeError: Cannot read property 'map' of undefined at CDNComponent.js:42:15

```

### Why Browsers Mask Cross-Origin Errors

If error messages were exposed across origins in `no-cors` mode, an attacker could load a private cross-origin file as a script and infer private data based on syntax error messages thrown by the parser.

Enabling `crossorigin="anonymous"` tells the browser to request CORS clearance. Once the CDN responds with `Access-Control-Allow-Origin: *` (or matching origin), the browser unmasks the error, providing full stack traces to logging tools like Sentry or Datadog.

---

## 3. `anonymous` vs. `use-credentials`

| Mode                       | HTML Syntax                                  | Outgoing Request Headers                               | Required Server Response Header    |
| -------------------------- | -------------------------------------------- | ------------------------------------------------------ | ---------------------------------- |
| **No Attribute (Default)** | `<script src="...">`                         | No CORS headers, sends origin cookies by default       | None required (Executes as Opaque) |
| **Anonymous**              | `<script src="..." crossorigin="anonymous">` | `Origin: [https://my-app.com](https://my-app.com)`<br> |

<br>`Sec-Fetch-Mode: cors`<br>

<br>*(No cookies/HTTP Auth)* | `Access-Control-Allow-Origin: *` *(or specific origin)* |
| **Use Credentials** | `<script src="..." crossorigin="use-credentials">` | `Origin: [https://my-app.com](https://my-app.com)`<br>

<br>`Sec-Fetch-Mode: cors`<br>

<br>*(Sends cookies/HTTP Auth)* | `Access-Control-Allow-Origin: [https://my-app.com](https://my-app.com)`<br>

<br>`Access-Control-Allow-Credentials: true` |

---

## Summary Checklist

1. **SRI Integrity Enforcement:** Always pair `integrity="..."` with `crossorigin="anonymous"`.
2. **CDN Error Visibility:** Use `crossorigin="anonymous"` on third-party libraries so global error handlers can log full stack traces instead of generic `"Script error."`.
3. **Server Configuration:** Ensure your CDN or static file storage (AWS S3, Cloudflare, Fastly) emits `Access-Control-Allow-Origin: *` for script assets, or CORS requests will be blocked.
