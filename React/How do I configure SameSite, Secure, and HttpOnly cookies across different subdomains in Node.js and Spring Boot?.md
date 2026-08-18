To share authentication or session cookies across different subdomains (e.g., frontend on `app.example.com` and backend API on `api.example.com`), configure four key attributes:

1. **`Domain=.example.com`**: Tells the browser the cookie is accessible by the parent domain and **all** of its subdomains (`app.example.com`, `api.example.com`, `admin.example.com`).
2. **`HttpOnly=true`**: Prevents client-side scripts (`document.cookie`) from accessing the token, protecting against Cross-Site Scripting (XSS).
3. **`Secure=true`**: Ensures the cookie is transmitted only over HTTPS connections.
4. **`SameSite=Lax` or `SameSite=None**`:

* **`SameSite=Lax` (Recommended for shared root domains):** `app.example.com` and `api.example.com` belong to the **same registrable site** (`example.com` on the Public Suffix List). `SameSite=Lax` allows cookies on top-level navigations and first-party subdomains while guarding against Cross-Site Request Forgery (CSRF).
* **`SameSite=None` (Required only if domains are completely distinct e.g., `app-frontend.com` to `api-backend.com`):** Requires `Secure=true` on HTTPS.

---

### 1. Node.js Implementations

#### Option A: Fastify (`@fastify/cookie`)

```bash
npm install fastify @fastify/cookie

```

```typescript
import Fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';

const app = Fastify({ logger: true });

app.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET || 'your-super-secret-signing-key',
  hook: 'onRequest',
});

const isProduction = process.env.NODE_ENV === 'production';

app.post('/api/auth/login', async (request, reply) => {
  const sessionId = 'sess_9f8a7b6c5d4e3f2a1';

  // Set the cross-subdomain cookie
  reply.setCookie('session_id', sessionId, {
    path: '/',
    // Leading dot allows all subdomains in production; omit or use undefined for localhost
    domain: isProduction ? '.example.com' : undefined,
    httpOnly: true,
    secure: isProduction, // HTTPS required in production
    sameSite: isProduction ? 'lax' : 'lax', // Use 'none' only if domains differ completely
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  });

  return { success: true, message: 'Logged in successfully' };
});

app.post('/api/auth/logout', async (request, reply) => {
  // Clearing requires the EXACT same Domain and Path
  reply.clearCookie('session_id', {
    path: '/',
    domain: isProduction ? '.example.com' : undefined,
  });

  return { success: true, message: 'Logged out' };
});

```

---

#### Option B: Express (`cookie-parser` / `res.cookie`)

```bash
npm install express cookie-parser
npm install -D @types/express @types/cookie-parser

```

```typescript
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET));

const isProduction = process.env.NODE_ENV === 'production';

app.post('/api/auth/login', (req: Request, res: Response) => {
  const authToken = 'jwt_secure_payload_token';

  res.cookie('auth_token', authToken, {
    path: '/',
    domain: isProduction ? '.example.com' : undefined,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
  });

  res.json({ message: 'Authentication successful' });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  res.clearCookie('auth_token', {
    path: '/',
    domain: isProduction ? '.example.com' : undefined,
  });

  res.json({ message: 'Logged out successfully' });
});

```

---

### 2. Spring Boot Implementation (Java 17+ / Spring Boot 3.x)

In Spring Boot, construct a `ResponseCookie` and attach it to the `Set-Cookie` response header.

#### Option A: Native `ResponseCookie` in Spring MVC / WebFlux Controller

```java
package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${app.cookie.domain:}")
    private String cookieDomain; // Set to ".example.com" in application-prod.properties

    @Value("${app.cookie.secure:true}")
    private boolean isSecure;

    @PostMapping("/login")
    public ResponseEntity<String> login() {
        String token = "secure_session_token_xyz123";

        ResponseCookie.ResponseCookieBuilder cookieBuilder = ResponseCookie.from("SESSION_TOKEN", token)
                .httpOnly(true)
                .secure(isSecure)
                .path("/")
                .maxAge(Duration.ofDays(7))
                .sameSite("Lax"); // Use "None" if calling across completely separate domains

        // Set subdomain scope if configured (omit on localhost)
        if (cookieDomain != null && !cookieDomain.isBlank()) {
            cookieBuilder.domain(cookieDomain);
        }

        ResponseCookie cookie = cookieBuilder.build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("{\"message\": \"Login successful\"}");
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        // Clearing cookie requires matching Domain and Path with maxAge(0)
        ResponseCookie.ResponseCookieBuilder cookieBuilder = ResponseCookie.from("SESSION_TOKEN", "")
                .httpOnly(true)
                .secure(isSecure)
                .path("/")
                .maxAge(0)
                .sameSite("Lax");

        if (cookieDomain != null && !cookieDomain.isBlank()) {
            cookieBuilder.domain(cookieDomain);
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookieBuilder.build().toString())
                .body("{\"message\": \"Logged out\"}");
    }
}

```

#### Option B: Global Spring Session / Embedded Tomcat Configuration (`application.yml`)

If using **Spring Session** or standard server session management, configure defaults in configuration:

```yaml
server:
  servlet:
    session:
      cookie:
        name: JSESSIONID
        domain: .example.com
        http-only: true
        secure: true
        max-age: 7d
        same-site: LAX

```

---

### 3. Frontend / Fetch Configuration

For the browser to send and receive cookies across subdomains (`app.example.com` $\rightarrow$ `api.example.com`), the client **must** pass `credentials: 'include'`:

```typescript
// Native fetch
const response = await fetch('https://api.example.com/api/user/me', {
  method: 'GET',
  credentials: 'include', // Mandates cross-subdomain cookie transmission
});

// Axios
import axios from 'axios';
const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  withCredentials: true, // Enables cross-origin/subdomain cookie transmission
});

```

---

### 4. Critical Pitfalls & Localhost Testing

* **`localhost` Does Not Support Subdomain Cookies:**
Browsers will reject `domain: ".localhost"`. When developing locally:
* Leave `domain` as `undefined` / empty for `localhost`.
* Alternatively, add custom local aliases to your `/etc/hosts` or `C:\Windows\System32\drivers\etc\hosts`:

```
127.0.0.1 app.localtest.me
127.0.0.1 api.localtest.me

```

Then use `domain: ".localtest.me"`.

* **Cookie Deletion Mismatch:**
To delete a cookie on logout, the server must issue a `Set-Cookie` with `Max-Age=0` or `Expires=Thu, 01 Jan 1970 00:00:00 GMT` using the **exact same `Domain` and `Path**`. If the login set `Domain=.example.com; Path=/`, but the logout omits `domain`, the browser creates a new expired local cookie and leaves the shared parent cookie untouched.
* **Double Dots / Trailing Dots:**
Modern browsers normalize `.example.com` and `example.com` to cover subdomains identically when `Domain` is explicitly specified. However, omitting the `Domain` attribute entirely restricts the cookie strictly to the origin host (`api.example.com` only).
