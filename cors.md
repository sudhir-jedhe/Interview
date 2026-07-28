**Do you know what CORS is?**

Cross-Origin Resource Sharing (CORS) is a security feature implemented by web browsers to restrict web applications from making requests to domains other than their own. Let's delve into the details of CORS:

CORS is a mechanism that allows servers to specify who can access their resources by adding specific HTTP headers to their responses.
It provides a way for servers to declare which origins are allowed to access their resources and which HTTP methods are permitted for cross-origin requests.

**Same-Origin Policy:**
Before CORS, web browsers enforced the Same-Origin Policy, which restricts web pages from making requests to domains other than the one from which they originated.
This policy prevents malicious websites from accessing sensitive data or executing unauthorized actions on behalf of users.

**Cross-Origin Requests:**
A cross-origin request occurs when a web page hosted on one domain makes a request to a resource hosted on another domain.
These requests include XMLHttpRequest (XHR) or Fetch API requests initiated by client-side JavaScript code.

**CORS Workflow:**
When a web application makes a cross-origin request, the browser sends a preflight request (OPTIONS) to the server to determine if the actual request (GET, POST, etc.) is allowed.
The server responds with CORS headers indicating whether the request is allowed from the specified origin, HTTP methods, and other relevant information.
If the preflight request is successful and the server allows the request, the actual request is sent.

**CORS Headers:**
CORS headers are included in HTTP responses to control access to resources from different origins.
The primary CORS headers include:Access-Control-Allow-Origin: Specifies which origins are allowed to access the resource. It can be a specific origin, "\*", or null.
Access-Control-Allow-Methods: Indicates which HTTP methods (GET, POST, etc.) are permitted for cross-origin requests.
Access-Control-Allow-Headers: Lists the HTTP headers that can be used in the actual request.
Access-Control-Allow-Credentials: Specifies whether cookies and other credentials should be included in cross-origin requests.

**Handling CORS Errors:**
If a cross-origin request is made without proper CORS headers or is not allowed by the server, the browser blocks the request and generates a CORS error.
Developers can handle CORS errors by configuring the server to include appropriate CORS headers or by proxying requests through their own server.

**Security Implications:**
CORS helps mitigate security risks associated with cross-origin requests by providing a mechanism for servers to control access to their resources.
Properly configuring CORS policies helps prevent unauthorized access to sensitive data and resources, reducing the risk of Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF) attacks.

**1/ What is CORS? **
CORS stands for Cross-Origin Resource Sharing—a security feature built into browsers.

It blocks requests made from one origin (domain, protocol, or port) to another origin unless explicitly allowed by the server.

For example:

- Your frontend is hosted at `frontend.com`.
- Your backend API is hosted at `api.backend.com`.

The browser treats these as different origins and blocks the request unless it’s explicitly allowed.

** 2/ Why Does It Happen? **
CORS errors are triggered by the Same-Origin Policy, which prevents malicious websites from making unauthorized API calls using your credentials.

When the backend server doesn’t include the right CORS headers, the browser refuses to share the response and throws this error:

> _Access to fetch at 'https://api.backend.com' from origin 'https://frontend.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present._

In short, the browser isn’t blocking the request—it’s blocking the response for security reasons.

3/ The Real Problem Behind CORS

- It’s not a frontend issue.
- It’s not a browser bug.
- It’s a server-side configuration issue.

Most candidates panic and assume the browser is the problem. It’s not.

CORS is the server’s responsibility to allow or deny requests from other origins.

** 4/ How Do You Fix It? **

Step 1: Update the Backend.
The server must send the right headers, like:

- `Access-Control-Allow-Origin: *` (Allows all origins).
- Or specify trusted domains like `Access-Control-Allow-Origin: https://frontend.com`.

Step 2: Handle Preflight Requests (OPTIONS).
For complex requests (like `POST` with custom headers), browsers send a preflight request before the actual call.

The server must respond to this with:

- `Access-Control-Allow-Methods: GET, POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

Step 3: Use a Proxy for Local Development.
If the backend isn’t updated yet, set up a proxy to forward requests through the same origin as your frontend.

** 5/ Can We Bypass CORS? **
Short answer—No.

Any hacky workaround, like disabling CORS in the browser or using extensions, won’t work in production.

Fix it properly by configuring the server. That’s the only scalable solution.

** 6/ Why Is This Important in Interviews? **
Because CORS tests whether you:

- Understand how the web works.
- Can debug issues logically.
- Know where the real problem lies (backend vs frontend).

**CORS (Cross-Origin Resource Sharing)** is a mechanism that allows web servers to control how resources on their domain can be accessed by web pages from other origins. It is a way for a server to permit or deny cross-origin HTTP requests made by a client, which would otherwise be restricted by the **same-origin policy** (SOP).

The **same-origin policy** is a security measure implemented by web browsers to prevent malicious websites from reading sensitive data from other websites. It restricts web pages from making requests to a domain other than the one that served the web page. CORS provides a secure way to bypass this restriction under controlled circumstances.

### How CORS Works

When a web page makes a cross-origin request (for example, making an AJAX call to a different domain), the browser sends an **HTTP request** to the server hosting the resource, and the server responds with special HTTP headers. These headers control which domains are allowed to access the resource.

#### 1. **Simple Requests** (No Preflight)

For simple requests, CORS is handled by the browser automatically if the server provides the correct `Access-Control-Allow-Origin` header. A simple request is one that:

- Uses only the **GET**, **POST**, or **HEAD** methods.
- Contains only certain safe headers (such as `Content-Type: application/json`, `Accept`, etc.).
- Does not contain certain potentially unsafe methods or headers (like `PUT`, `DELETE`, or custom headers).

#### 2. **Preflight Requests**

For more complex requests (e.g., with custom headers or methods), the browser sends a **preflight request**. This is an **OPTIONS** request sent before the actual request to check if the server is willing to allow the cross-origin request.

The **preflight request** includes:

- The method that will be used in the actual request (via `Access-Control-Request-Method`).
- Any custom headers that will be included in the actual request (via `Access-Control-Request-Headers`).
- The server must respond with appropriate CORS headers to approve the request.

### CORS Headers

The CORS headers are sent in both the **request** and **response** to determine whether a cross-origin request is allowed.

#### **1. Response Headers:**

1. **`Access-Control-Allow-Origin`**:
   - Specifies which origin(s) are allowed to access the resource. It can either be a specific domain (e.g., `https://example.com`) or the wildcard `*` to allow all origins.
   - **Example**: `Access-Control-Allow-Origin: https://example.com`

2. **`Access-Control-Allow-Credentials`**:
   - Indicates whether or not the response to the request can be exposed when the credentials flag is true (e.g., when sending cookies, authentication headers, etc.).
   - **Example**: `Access-Control-Allow-Credentials: true`

3. **`Access-Control-Allow-Headers`**:
   - Used in response to a preflight request to indicate which HTTP headers can be used when making the actual request.
   - **Example**: `Access-Control-Allow-Headers: Content-Type, Authorization`

4. **`Access-Control-Allow-Methods`**:
   - Specifies the method or methods allowed when accessing the resource in response to a preflight request.
   - **Example**: `Access-Control-Allow-Methods: GET, POST, PUT`

5. **`Access-Control-Expose-Headers`**:
   - Indicates which headers can be exposed as part of the response by listing their names. By default, only a limited set of headers (such as `Content-Type`, `Date`, etc.) are exposed.
   - **Example**: `Access-Control-Expose-Headers: X-Custom-Header`

6. **`Access-Control-Max-Age`**:
   - Specifies how long the results of a preflight request can be cached. This reduces the need for repeated preflight requests.
   - **Example**: `Access-Control-Max-Age: 86400` (24 hours)

#### **2. Request Headers:**

1. **`Access-Control-Request-Headers`**:
   - Used when issuing a preflight request to let the server know which HTTP headers will be used when the actual request is made.
   - **Example**: `Access-Control-Request-Headers: X-Custom-Header`

2. **`Access-Control-Request-Method`**:
   - Used when issuing a preflight request to let the server know which HTTP method will be used when the actual request is made.
   - **Example**: `Access-Control-Request-Method: POST`

3. **`Origin`**:
   - Indicates where the fetch (or request) originates from. This header is automatically sent by the browser as part of the cross-origin request and specifies the origin (protocol, host, and port) of the requesting site.
   - **Example**: `Origin: https://another-site.com`

4. **`Timing-Allow-Origin`**:
   - This header is used for the **Resource Timing API** to specify which origins are allowed to see values of attributes retrieved via features like `performance.getEntriesByType('resource')`, which would otherwise be restricted due to cross-origin policies.
   - **Example**: `Timing-Allow-Origin: *`

### Flow of CORS Process

1. **Client Request:**
   - The client (browser) sends an HTTP request to the server with an `Origin` header indicating the origin of the requesting page.
2. **Preflight Request (if needed):**
   - If the request is complex (e.g., with custom headers or methods), the browser sends an **OPTIONS** preflight request to the server.
   - The server responds with the appropriate CORS headers (`Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, etc.) to indicate whether the actual request is allowed.

3. **Actual Request:**
   - If the preflight check (if applicable) is successful, the browser proceeds to send the actual request (e.g., GET, POST).
   - The server processes the request and includes the appropriate CORS response headers in its response.

4. **Access or Blocked:**
   - If the server allows the origin (via `Access-Control-Allow-Origin`), the browser allows access to the response data.
   - If the server does not allow the origin or does not respond with the correct CORS headers, the browser blocks the response and typically reports an error (e.g., `CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource`).

### Example: CORS in Action

#### **Preflight Request (OPTIONS)**

A request to a server with a custom header might trigger a preflight request.

- **Request:**

  ```http
  OPTIONS /data HTTP/1.1
  Host: api.example.com
  Origin: https://my-website.com
  Access-Control-Request-Method: POST
  Access-Control-Request-Headers: X-Custom-Header
  ```

- **Response:**
  ```http
  HTTP/1.1 200 OK
  Access-Control-Allow-Origin: https://my-website.com
  Access-Control-Allow-Methods: GET, POST
  Access-Control-Allow-Headers: X-Custom-Header
  Access-Control-Max-Age: 86400
  ```

#### **Actual Request (POST)**

If the preflight request succeeds, the browser sends the actual request.

- **Request:**

  ```http
  POST /data HTTP/1.1
  Host: api.example.com
  Origin: https://my-website.com
  X-Custom-Header: some-value
  ```

- **Response:**
  ```http
  HTTP/1.1 200 OK
  Access-Control-Allow-Origin: https://my-website.com
  Content-Type: application/json
  ```

### Key Takeaways:

- **CORS** allows servers to control which domains can access their resources.
- The server specifies CORS permissions using headers like `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, and others.
- A **preflight request** may be necessary when using custom methods or headers, to check server permissions.
- **Credentials (cookies, authentication)** are allowed if the server explicitly sets `Access-Control-Allow-Credentials` to `true`.
- **CORS** provides a secure and controlled way for cross-origin requests, ensuring sensitive data is not exposed to unauthorized domains.
