**HTTP Headers** are the core metadata components of HTTP requests and responses. They act as key-value pairs transmitted between a client (like a browser or mobile app) and a server, carrying crucial instructions about authentication, caching, data formats, security, and connection behavior.

---

## 1. The Four Main Categories of HTTP Headers

HTTP headers are generally categorized based on where they appear in the request-response lifecycle:

### A. Request Headers

Sent by the client to give the server additional context about the request, the user's environment, or what data formats the client can handle.

* *Examples:* `User-Agent`, `Authorization`, `Accept`, `Host`

### B. Response Headers

Sent by the server back to the client to provide additional context about the server itself or how the client should handle the response.

* *Examples:* `Server`, `Set-Cookie`, `ETag`, `Access-Control-Allow-Origin`

### C. Representation (Payload) Headers

Describe the actual body/content of the message (whether in a request or a response), such as its size, compression format, or MIME type.

* *Examples:* `Content-Type`, `Content-Length`, `Content-Encoding`, `Content-Language`

### D. General Headers

Headers that apply to both requests and responses alike, but don't relate to the body payload itself.

* *Examples:* `Cache-Control`, `Connection`, `Date`, `Via`

---

## 2. Most Common & Essential Headers in Practice

| Header Category         | Header Name                   | Purpose / Description                                                     | Example Value                                       |
| ----------------------- | ----------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------- |
| **Content Negotiation** | `Content-Type`                | Tells the receiver what media format the request/response body is in.     | `application/json`, `text/html`                     |
| **Content Negotiation** | `Accept`                      | Informs the server what media types the client is willing to receive.     | `application/json`, `image/webp`                    |
| **Authentication**      | `Authorization`               | Carries credentials or tokens to authenticate the client.                 | `Bearer eyJhbGciOi...`                              |
| **Caching**             | `Cache-Control`               | Directives for caching mechanisms in browsers and CDNs.                   | `no-cache`, `max-age=3600`                          |
| **Security**            | `Strict-Transport-Security`   | Enforces secure (HTTPS) connections (HSTS).                               | `max-age=31536000; includeSubDomains`               |
| **Security**            | `X-Content-Type-Options`      | Prevents browsers from MIME-sniffing away from the declared content-type. | `nosniff`                                           |
| **CORS**                | `Access-Control-Allow-Origin` | Specifies which domains are allowed to access resource responses.         | `[https://example.com](https://example.com)` or `*` |
| **Client Info**         | `User-Agent`                  | Contains information about the browser, operating system, and device.     | `Mozilla/5.0 (Windows NT 10.0)...`                  |

---

## 3. Custom Headers & Best Practices

* **Custom Headers (`X-` Prefix):** Historically, developers prefixed custom, non-standard headers with `X-` (e.g., `X-Request-ID`, `X-Custom-Auth`). However, RFC 6648 deprecated the `X-` prefix because standardizing headers caused confusion when they later became official. Today, you can use any clear, descriptive name without the prefix (e.g., `Request-ID` or `App-Version`).
* **Case Insensitivity:** HTTP header names are **case-insensitive** according to the HTTP specification (e.g., `content-type`, `Content-Type`, and `CONTENT-TYPE` are treated identically by HTTP parsers). However, convention dictates Pascal-Kebab-Case (e.g., `Content-Type`).
* **Security Considerations:** Never put sensitive information (like unencrypted passwords or internal API secrets) into custom request headers unless they are encrypted over TLS (HTTPS). Additionally, be mindful of header size limits enforced by web servers and proxies (usually between 8KB to 32KB total).

**HTTP headers** are key-value pairs passed between a client (browser, mobile app, API consumer) and a server in every HTTP request and response. They carry essential metadata about authentication, content formatting, caching rules, security constraints, and network state.

---

**Core Header Categories**

* **Request Headers:** Sent by the client to describe itself, configure auth, or specify acceptable response types (e.g., `Authorization`, `Accept`, `User-Agent`).
* **Response Headers:** Sent by the server to provide server context, set cookies, or guide client behavior (e.g., `Set-Cookie`, `Server`, `Location`).
* **Representation / Payload Headers:** Describe the body content directly (e.g., `Content-Type`, `Content-Length`, `Content-Encoding`).
* **General Headers:** Apply to the overall transmission rather than the payload (e.g., `Connection`, `Date`, `Cache-Control`).

---

**High-Priority Headers by Function**

| Category           | Header                        | Purpose                                                            | Example Value                                               |
| ------------------ | ----------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| **Authentication** | `Authorization`               | Passes bearer tokens, basic auth, or API credentials               | `Bearer eyJhbGciOi...`                                      |
| **Content Type**   | `Content-Type`                | Declares the media format of the payload body                      | `application/json; charset=utf-8`                           |
| **Negotiation**    | `Accept`                      | Informs the server what format the client expects                  | `application/json`, `text/html`                             |
| **Caching**        | `Cache-Control`               | Dictates caching behavior across browsers and CDNs                 | `public, max-age=86400, must-revalidate`                    |
| **Conditional**    | `If-None-Match` / `ETag`      | Prevents re-downloading unchanged data ($304\text{ Not Modified}$) | `ETag: "686897696a7c8"`                                     |
| **CORS**           | `Access-Control-Allow-Origin` | Governs cross-domain browser access                                | `[https://app.example.com](https://app.example.com)` or `*` |
| **Security**       | `Strict-Transport-Security`   | Enforces HTTPS connections (HSTS)                                  | `max-age=31536000; includeSubDomains`                       |
| **Security**       | `Content-Security-Policy`     | Restricts allowed scripts, styles, and asset origins               | `default-src 'self'`                                        |

---

**Key Technical Rules**

* **Case Insensitivity:** Header names are case-insensitive per RFC 7230 (`content-type` is identical to `Content-Type`), though Pascal-Kebab-Case is the standard convention.
* **Custom Headers:** Standardize on clear names like `Request-Id` or `Api-Version`. The legacy `X-` prefix (e.g., `X-Custom-Header`) was deprecated in RFC 6648.
* **Size Limits:** Web servers and load balancers typically enforce limits between **8 KB and 32 KB** total across all headers in a single request. Keep tokens and metadata lean.
