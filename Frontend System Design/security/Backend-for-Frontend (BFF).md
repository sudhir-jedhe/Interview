A **Backend-for-Frontend (BFF)** acts as an intermediate server boundary specifically tailored to the needs of a single front-end client (such as a React Single-Page Application, Next.js SSR app, or Mobile App).

In modern front-end system design, the BFF serves as the **Security Gateway**: it keeps sensitive credentials off the browser, orchestrates API requests, enforces rate limits, and prevents Server-Side Request Forgery (SSRF) when interacting with internal microservices or third-party APIs.

---

## 1. End-to-End BFF Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT (BROWSER / SPA)                           │
│                                                                             │
│  • Stores ONLY HttpOnly, Secure, SameSite Refresh & Session Cookies         │
│  • Never sees raw downstream OAuth/JWT Access Tokens                        │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                         HTTPS + Anti-CSRF Header
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BACKEND-FOR-FRONTEND (BFF) GATEWAY                       │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 1. Rate Limiter (Redis Leaky/Token Bucket)                            │  │
│  │    • Tracks Client IP / Session ID to stop Brute Force / DoS            │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 2. Token Exchange & Forwarding Engine                                 │  │
│  │    • Decrypts Session Cookie -> Retrieves Downstream JWT in Memory    │  │
│  │    • Attaches `Authorization: Bearer <token>` to Internal Requests   │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 3. SSRF Safe Proxy Engine                                             │  │
│  │    • Validates Target Origins & Enforces DNS IP Allowlisting          │  │
│  │    • Blocks Private IP Ranges (10.0.0.0/8, 169.254.169.254, 127.0.0.1) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                     Internal mTLS / Private Network
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     DOWNSTREAM INTERNAL MICROSERVICES                       │
│                                                                             │
│  • Product Service      • User Account API      • Payment Gateway           │
└─────────────────────────────────────────────────────────────────────────────┘

```

---

## 2. Core Pillars of BFF Security

### Pillar 1: Distributed Rate Limiting

To protect both the BFF and downstream microservices from Denial-of-Service (DoS) attacks and brute-force credential stuffing, enforce rate limiting using a **Token Bucket** or **Sliding Window Log** algorithm backed by Redis.

* **Identification:** Rate limit based on authenticated `sessionId` for logged-in users, or client IP (`X-Forwarded-For` / `CF-Connecting-IP`) for unauthenticated endpoints.
* **Tiered Limits:** Apply strict limits on sensitive endpoints (`/auth/login`: 5 reqs/min) and relaxed limits on read endpoints (`/products`: 100 reqs/min).

---

### Pillar 2: Token Exchange & Safe Token Forwarding

The BFF isolates the client browser from raw API tokens (OAuth Access Tokens / Service JWTs).

1. **Token Abstraction (Token Handler Pattern):** The browser holds an encrypted, `HttpOnly`, `Secure`, `SameSite=Strict` cookie referencing the BFF session.
2. **In-Memory Token Retrieval:** When a client request hits the BFF, the BFF decrypts the cookie/session, retrieves the downstream microservice access token stored in Redis or memory, and injects it into the request header.
3. **Token Sanitization:** The BFF **strips** client session cookies before forwarding requests to internal services, ensuring internal microservices only receive validated `Authorization: Bearer <jwt>` tokens.

---

### Pillar 3: SSRF Prevention for Dynamic Downstream Calls

If the BFF proxies requests to dynamic URLs (e.g., image previews, webhooks, user-defined API integrations), it must prevent attackers from making the BFF send requests to internal infrastructure or cloud metadata endpoints (`169.254.169.254`).

* **Protocol Enforcement:** Allow `https:` and `http:` only.
* **DNS IP Validation:** Resolve target domains via DNS before initiating HTTP calls, and reject any IP addressing private (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) or loopback (`127.0.0.1`, `::1`) ranges.
* **Disable HTTP Redirect Follows:** Prevent attackers from redirecting the BFF from a public URL to an internal endpoint via HTTP 302.

---

## 3. Production Code Implementation (Node.js / Express TypeScript)

Below is a complete, production-ready BFF implementation combining Rate Limiting, Token Forwarding, and SSRF-Safe Proxying.

### Step A: Secure Rate Limiter Middleware (`rateLimiter.ts`)

```typescript
// src/middleware/rateLimiter.ts
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

interface RateLimitOptions {
  windowSeconds: number;
  maxRequests: number;
}

export const createRateLimiter = (options: RateLimitOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Identify user by session ID or client IP
    const clientId = req.cookies?.session_id || req.ip || 'anonymous';
    const redisKey = `ratelimit:${req.path}:${clientId}`;

    try {
      const currentRequests = await redis.incr(redisKey);

      if (currentRequests === 1) {
        await redis.expire(redisKey, options.windowSeconds);
      }

      const ttl = await redis.ttl(redisKey);

      // Set standard RateLimit headers
      res.setHeader('X-RateLimit-Limit', options.maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, options.maxRequests - currentRequests));
      res.setHeader('X-RateLimit-Reset', ttl);

      if (currentRequests > options.maxRequests) {
        return res.status(429).json({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${ttl} seconds.`,
        });
      }

      next();
    } catch (err) {
      console.error('[RateLimiter Error]:', err);
      next(); // Fallback to allow request if Redis fails
    }
  };
};

```

---

### Step B: Token Forwarding Middleware (`tokenForwarder.ts`)

```typescript
// src/middleware/tokenForwarder.ts
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const injectMicroserviceToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionId = req.cookies?.session_id;

  if (!sessionId) {
    return res.status(401).json({ error: 'Unauthorized: Missing session cookie' });
  }

  try {
    // Retrieve downstream API access token linked to this session
    const accessToken = await redis.get(`session:${sessionId}:access_token`);

    if (!accessToken) {
      return res.status(401).json({ error: 'Unauthorized: Session token expired' });
    }

    // Attach downstream bearer token to internal request context
    req.headers['authorization'] = `Bearer ${accessToken}`;

    // Strip incoming client cookies before forwarding to internal services
    delete req.headers['cookie'];

    next();
  } catch (err) {
    console.error('[TokenForwarder Error]:', err);
    return res.status(500).json({ error: 'Internal Server Error during token exchange' });
  }
};

```

---

### Step C: SSRF-Safe Proxy Transport (`safeProxy.ts`)

```typescript
// src/security/safeProxy.ts
import dns from 'dns/promises';
import ipaddr from 'ipaddr.js';
import axios from 'axios';

function isRestrictedIp(ipString: string): boolean {
  try {
    const addr = ipaddr.parse(ipString);
    const range = addr.range();

    const forbiddenRanges = [
      'loopback',
      'private',
      'linkLocal', // Blocks 169.254.169.254 AWS Metadata API
      'uniqueLocal',
      'unspecified',
      'broadcast',
    ];

    return forbiddenRanges.includes(range);
  } catch {
    return true; // Block if IP parsing fails
  }
}

export async function safeForwardRequest(
  targetUrl: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  headers: Record<string, string>,
  data?: unknown
) {
  const parsedUrl = new URL(targetUrl);

  // 1. Enforce HTTPS / HTTP Protocol
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new Error(`[SSRF Blocked] Unauthorized protocol: ${parsedUrl.protocol}`);
  }

  // 2. Resolve Hostname to IP and Verify against Private Subnets
  const host = parsedUrl.hostname;

  if (ipaddr.isValid(host)) {
    if (isRestrictedIp(host)) {
      throw new Error(`[SSRF Blocked] Direct access to restricted IP rejected: ${host}`);
    }
  } else {
    const resolvedIps = await dns.resolve(host);
    if (!resolvedIps || resolvedIps.length === 0) {
      throw new Error('[SSRF Blocked] Could not resolve host domain.');
    }

    for (const ip of resolvedIps) {
      if (isRestrictedIp(ip)) {
        throw new Error(`[SSRF Blocked] Domain resolves to restricted IP: ${ip}`);
      }
    }
  }

  // 3. Execute request with REDIRECTS DISABLED to prevent 302 SSRF bypass
  return axios({
    method,
    url: targetUrl,
    headers,
    data,
    maxRedirects: 0, // CRITICAL: Stop HTTP 302 redirects to private IPs
    timeout: 5000,
  });
}

```

---

### Step D: Main BFF Application Integration (`bffServer.ts`)

```typescript
// src/bffServer.ts
import express from 'express';
import cookieParser from 'cookie-parser';
import { createRateLimiter } from './middleware/rateLimiter';
import { injectMicroserviceToken } from './middleware/tokenForwarder';
import { safeForwardRequest } from './security/safeProxy';

const app = express();
app.use(express.json());
app.use(cookieParser());

// 1. Global Standard Rate Limiter (100 requests / minute)
app.use(createRateLimiter({ windowSeconds: 60, maxRequests: 100 }));

// 2. Auth Rate Limiter (5 login attempts / minute)
app.post('/api/auth/login', createRateLimiter({ windowSeconds: 60, maxRequests: 5 }), (req, res) => {
  // Login logic, sets HttpOnly cookie session_id...
  res.json({ message: 'Authenticated successfully' });
});

// 3. Authenticated Proxy Route with Token Forwarding and SSRF Protection
app.post('/api/proxy/external-data', injectMicroserviceToken, async (req, res) => {
  const { targetEndpoint, payload } = req.body;

  try {
    // Forward request securely
    const response = await safeForwardRequest(
      targetEndpoint,
      'POST',
      {
        'Authorization': req.headers['authorization'] as string,
        'Content-Type': 'application/json',
      },
      payload
    );

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[BFF Proxy Error]:', error.message);
    return res.status(400).json({ error: 'Failed to proxy request securely.' });
  }
});

app.listen(4000, () => console.log('BFF Security Gateway running on port 4000'));

```

---

## BFF Security Responsibility Summary

| Security Layer        | BFF Control Strategy                                                               | Threat Mitigated                                                    |
| --------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Rate Limiting**     | Redis sliding window tracking client IPs & session tokens.                         | Distributed DoS, brute-force credential stuffing.                   |
| **Token Forwarding**  | Exposes `HttpOnly` session cookies to client; injects real JWT tokens server-side. | Token theft via XSS; credentials exposed in browser storage.        |
| **SSRF Prevention**   | Protocol allowlist + DNS IP validation + `maxRedirects: 0`.                        | Cloud metadata leakage (`169.254.169.254`), internal port scanning. |
| **Session Isolation** | Strips browser cookies before forwarding calls to internal microservices.          | Cookie leakage to third-party microservices.                        |
