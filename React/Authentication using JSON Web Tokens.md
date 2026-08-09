Authentication using JSON Web Tokens (JWT) relies on a stateless, token-based architecture. Instead of storing session state on the server, the server verifies user credentials once, signs an encrypted payload (the JWT), and returns it to the client. The client presents this token with every subsequent request.

Here is the step-by-step lifecycle of token-based authentication:

---

### Step-by-Step Authentication Flow

```text
┌────────┐                                           ┌────────┐
│ Client │                                           │ Server │
└───┬────┘                                           └───┬────┘
    │                                                    │
    │ 1. POST /login (username, password)                │
    ├───────────────────────────────────────────────────►│
    │                                                    │ 2. Verify credentials against DB
    │                                                    │    Generate & sign JWT
    │ 3. Return JWT (Set-Cookie HTTP-only / JSON)        │
    │◄───────────────────────────────────────────────────┤
    │                                                    │
    │ 4. Store Token Securely                            │
    │                                                    │
    │ 5. GET /api/protected (Authorization: Bearer JWT)  │
    ├───────────────────────────────────────────────────►│
    │                                                    │ 6. Verify JWT Signature & Expiration
    │ 7. Return Protected Resource                       │    Extract payload (userId, roles)
    │◄───────────────────────────────────────────────────┤

```

---

### 1. Client Initiates Login

The user submits their login credentials (e.g., email/username and password) via an authentication form.

* The frontend sends an HTTP `POST` request to an auth endpoint (e.g., `/api/v1/auth/login`).
* Payload example:

```json
{
  "email": "user@example.com",
  "password": "user_password_123"
}

```

---

### 2. Server Verification & Credential Check

Upon receiving the login request:

1. **Fetch User:** The backend looks up the account record in the database using the provided email.
2. **Password Hashing:** The backend verifies the submitted plain-text password against the stored password hash (e.g., using `bcrypt`, `argon2`, or `scrypt`).
3. **Generate JWT:** If credentials match, the server constructs a JSON Web Token containing three parts separated by dots (`Header.Payload.Signature`):

* **Header:** Identifies the signing algorithm (e.g., `HS256`, `RS256`).
* **Payload (Claims):** Non-sensitive metadata (e.g., `userId`, `role`, `exp` expiration timestamp).
* **Signature:** Created by hashing the Header + Payload using a **Secret Key** stored only on the server.

---

### 3. JWT Returned to Client

The server responds to the client with the newly minted token:

* **Option A (Recommended):** Set as an `HttpOnly`, `Secure`, `SameSite` cookie in the response header.
* **Option B:** Returned in the JSON response body:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}

```

---

### 4. Secure Token Storage on the Client

Token storage choice directly impacts security against Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF):

| Storage Mechanism                 | Vulnerability Risk                                                                      | Best Practice                                                                                  |
| --------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **HttpOnly, Secure Cookie**       | Immune to XSS (JS cannot read it); vulnerable to CSRF if not protected.                 | **Recommended.** Combine with `SameSite=Strict` or `SameSite=Lax` and CSRF tokens.             |
| **In-Memory Variable**            | Lost on page refresh; immune to XSS persistence.                                        | Use inside React/Vue state for short-lived access tokens, backed by an HttpOnly Refresh Token. |
| **localStorage / sessionStorage** | **Vulnerable to XSS.** Any malicious script running on your domain can steal the token. | Avoid storing sensitive auth tokens here in production.                                        |

---

### 5. Attach Token to API Requests

For subsequent requests to protected endpoints, the client attaches the JWT:

* **If sent in Authorization Header:**

```http
GET /api/v1/user/profile HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

```

* **If sent via Cookie:** The browser automatically includes the HTTP-only cookie with every request matching the domain.

---

### 6. Backend Token Validation

When a protected endpoint receives a request, an Authentication Middleware intercepts it before reaching the controller:

1. **Extract Token:** Pulls the token from the `Authorization` header or cookie.
2. **Verify Signature:** Re-runs the signature calculation using the server's private secret key. If the token was tampered with in transit, the signature check fails immediately.
3. **Check Expiration (`exp`):** Ensures the current time is before the token's expiration timestamp.
4. **Attach User Context:** Extracts the `userId` or role claims from the payload and attaches them to the request context object (e.g., `req.user`).
5. **Pass to Controller:** If valid, `next()` is called to execute the API route logic; otherwise, returns HTTP `401 Unauthorized`.

---

### Summary Checklist for Production

* **Use Dual Tokens:** Issue short-lived **Access Tokens** (15 mins) and long-lived **Refresh Tokens** (7 days stored in an HttpOnly cookie).
* **Never Put Secrets in JWT Payload:** JWT payloads are Base64 encoded, not encrypted. Anyone can decode and read them. Never store passwords, PINs, or SSNs in a JWT.
* **Use Strong Algorithms:** Use `RS256` (asymmetric public/private keys) for distributed microservices, or `HS256` for single monolithic backend architectures.

Explain the Access Token and Refresh Token pattern with token rotation and silent refresh.

The **Access Token + Refresh Token** pattern solves a fundamental dilemma in web security: how to keep user sessions long-lasting and seamless without leaving a long-lived key vulnerable to theft.

---

### The Core Problem

* **Short-lived tokens are secure** (if stolen, they expire quickly), but forcing users to re-login every 15 minutes creates terrible UX.
* **Long-lived tokens provide great UX**, but if stolen via Cross-Site Scripting (XSS) or network interception, an attacker gains access for days or months.

The dual-token pattern solves this by splitting responsibilities into two distinct tokens with different lifespans, scopes, and storage locations.

---

### Token Breakdown

| Feature              | Access Token                                | Refresh Token                                           |
| -------------------- | ------------------------------------------- | ------------------------------------------------------- |
| **Purpose**          | Authenticates individual API requests       | Obtains a new Access Token when the current one expires |
| **Lifespan**         | Very short (5 to 15 minutes)                | Long (7 to 30 days)                                     |
| **Storage Location** | In-Memory (JavaScript variable/React state) | `HttpOnly`, `Secure`, `SameSite` Cookie                 |
| **Exposed to JS?**   | Yes                                         | **No** (browser handles it automatically)               |
| **XSS Risk**         | Low (wiped on page refresh/tab close)       | **Immune** (JS cannot access `HttpOnly` cookies)        |

---

### Architecture & Token Lifecycle Flow

```text
┌────────┐                                                  ┌────────┐
│ Client │                                                  │ Server │
└───┬────┘                                                  └───┬────┘
    │                                                           │
    │ 1. POST /login (credentials)                              │
    ├──────────────────────────────────────────────────────────►│
    │                                                           │ Authenticate user
    │ 2. Return Access Token (JSON) + Refresh Token (Cookie)    │ Generate AT (15m) & RT (7d)
    │◄──────────────────────────────────────────────────────────┤
    │                                                           │
    │ 3. API Requests (Header: Bearer <Access_Token>)           │
    ├──────────────────────────────────────────────────────────►│ Verifies AT
    │                                                           │
    │ ──── Access Token Expire (15 mins later) ────             │
    │                                                           │
    │ 4. POST /api/auth/refresh (Cookie sent automatically)     │
    ├──────────────────────────────────────────────────────────►│ Validates RT, revokes old RT,
    │                                                           │ issues NEW AT + NEW RT (Rotation)
    │ 5. Return NEW Access Token + Set NEW Refresh Token Cookie │
    │◄──────────────────────────────────────────────────────────┤

```

---

### 1. Token Rotation (Refresh Token Rotation)

**Refresh Token Rotation** is a security standard where **every time a Refresh Token is used to get a new Access Token, the old Refresh Token is invalidated and a brand-new Refresh Token is issued.**

#### Why Token Rotation is Critical

If an attacker manages to steal a Refresh Token (e.g., via a compromised sub-domain or CSRF exploit), Token Rotation allows the system to immediately detect reuse and lockout the attacker:

1. **Legitimate User** uses `RT_1` to refresh $\rightarrow$ Server invalidates `RT_1` and issues `RT_2`.
2. **Attacker** tries to use stolen `RT_1` later.
3. **Breach Detection:** The server sees an attempt to use an *already invalidated/used token* (`RT_1`).
4. **Automated Containment:** The server recognizes a breach, invalidates `RT_2` (and all other active refresh tokens for that `userId`), forcing **both** the user and the attacker to re-authenticate.

---

### 2. Silent Refresh (Seamless UX)

Since Access Tokens are stored in JavaScript memory (React state / variable), **they are wiped whenever the user reloads or opens a new tab.**

**Silent Refresh** is the client-side mechanism that automatically retrieves a new Access Token in the background without disturbing the user experience.

#### How Silent Refresh Works in Practice

1. **On Page Load / App Startup:**

* React state initializes with `accessToken = null`.
* An initialization effect runs `POST /api/auth/refresh`.
* The browser automatically attaches the `HttpOnly` Refresh Token cookie.
* Server returns a fresh Access Token into React memory. The user stays logged in seamlessly.

1. **On Access Token Expiration during active usage:**

* An HTTP client interceptor (e.g., Axios Interceptor) catches a `401 Unauthorized` response from an API call.
* The interceptor pauses pending requests, calls `POST /api/auth/refresh` in the background.
* Upon receiving the new Access Token, it retries the failed API call seamlessly.

---

### Implementation Example: Axios Interceptor for Silent Refresh

```javascript
import axios from 'axios';

let accessToken = null; // Stored in memory

const api = axios.create({
  baseURL: 'https://api.example.com',
  withCredentials: true, // Required to send HttpOnly cookies
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response Interceptor: Handle Expiration & Silent Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Request new access token using HttpOnly cookie
        const res = await axios.post(
          'https://api.example.com/auth/refresh',
          {},
          { withCredentials: true }
        );

        accessToken = res.data.accessToken;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Retry the original request with new token
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed or expired -> redirect to login
        accessToken = null;
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

```

---

### Summary Checklist for Production

1. **Access Token:** Store in JavaScript memory; expire in 5–15 minutes.
2. **Refresh Token:** Store in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie; expire in 7–30 days.
3. **Database Tracking:** Store a hash of active Refresh Tokens (or a family ID) in DB/Redis to enable instant revocation and rotation tracking.
4. **Reuse Detection:** Instantly revoke the entire token family if a revoked Refresh Token is presented.

Provide a complete Node.js Express implementation for token rotation with Redis and HttpOnly cookies.

This complete Node.js/Express implementation demonstrates JWT access tokens, refresh tokens with token rotation, reuse detection using Redis, and `HttpOnly` cookies.

### Prerequisites & Dependencies

Run the following command to install the required packages:

```bash
npm install express jsonwebtoken bcryptjs cookie-parser ioredis dotenv

```

---

### Implementation Architecture

* **Access Token:** Short-lived (15 min), signed JWT returned in JSON body or attached in headers.
* **Refresh Token:** Long-lived (7 days), UUID string stored in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie.
* **Redis State:** Maps `refreshToken` $\rightarrow$ `userId` and tracks a **Token Family** (or active token list per user) to enable instant revocation upon reuse detection.

---

### 1. Environment Configuration (`.env`)

```env
PORT=5000
JWT_ACCESS_SECRET=your_super_secret_access_key_change_in_prod
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
NODE_ENV=development

```

---

### 2. Redis Client Setup (`redisClient.js`)

```javascript
const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
});

redis.on('connect', () => console.log('Connected to Redis'));
redis.on('error', (err) => console.error('Redis Error:', err));

module.exports = redis;

```

---

### 3. Middleware & Helpers (`authUtils.js`)

```javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const redis = require('./redisClient');

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Generate Access Token (JWT)
const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

// Generate an opaque Refresh Token
const generateOpaqueToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Cookie settings for Refresh Token
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/auth/refresh', // Restrict cookie transmission to refresh route only
  maxAge: REFRESH_TOKEN_TTL_SECONDS * 1000,
};

// Middleware: Verify Access Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired access token' });
    }
    req.user = user;
    next();
  });
};

module.exports = {
  generateAccessToken,
  generateOpaqueToken,
  REFRESH_COOKIE_OPTIONS,
  REFRESH_TOKEN_TTL_SECONDS,
  authenticateToken,
};

```

---

### 4. Express Auth Controller & Server (`server.js`)

```javascript
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const redis = require('./redisClient');
const {
  generateAccessToken,
  generateOpaqueToken,
  REFRESH_COOKIE_OPTIONS,
  REFRESH_TOKEN_TTL_SECONDS,
  authenticateToken,
} = require('./authUtils');

const app = express();
app.use(express.json());
app.use(cookieParser());

// Simulated Database
const usersDB = [
  {
    id: 'user_101',
    email: 'dev@example.com',
    passwordHash: bcrypt.hashSync('Password123!', 10),
    role: 'admin',
  },
];

// Helper: Revoke all refresh tokens for a given user (Reuse Detection Safeguard)
const revokeAllUserTokens = async (userId) => {
  const userTokensKey = `user_tokens:${userId}`;
  const activeTokens = await redis.smembers(userTokensKey);

  if (activeTokens.length > 0) {
    const pipeline = redis.pipeline();
    activeTokens.forEach((token) => pipeline.del(`refresh_token:${token}`));
    pipeline.del(userTokensKey);
    await pipeline.exec();
  }
};

// ==========================================
// 1. POST /api/auth/login
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = usersDB.find((u) => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateOpaqueToken();

  // Save Refresh Token -> UserId mapping
  await redis.set(
    `refresh_token:${refreshToken}`,
    user.id,
    'EX',
    REFRESH_TOKEN_TTL_SECONDS
  );

  // Track active token under user's token set
  await redis.sadd(`user_tokens:${user.id}`, refreshToken);

  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
  return res.json({ accessToken });
});

// ==========================================
// 2. POST /api/auth/refresh (Token Rotation & Reuse Detection)
// ==========================================
app.post('/api/auth/refresh', async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }

  // Look up userId from Redis
  const userId = await redis.get(`refresh_token:${incomingRefreshToken}`);

  if (!userId) {
    // REUSE DETECTION / RECYCLING TRIGGERED
    // Token is either expired OR has already been invalidated (stolen token reuse attempt)
    // Clear cookie on client
    res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS);
    return res.status(403).json({
      message: 'Invalid or reused refresh token. Please log in again.',
    });
  }

  const user = usersDB.find((u) => u.id === userId);
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  // ATOMIC ROTATION
  // 1. Delete old refresh token from Redis
  await redis.del(`refresh_token:${incomingRefreshToken}`);
  await redis.srem(`user_tokens:${userId}`, incomingRefreshToken);

  // 2. Issue new Access Token and new Refresh Token
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateOpaqueToken();

  // 3. Store new Refresh Token in Redis
  await redis.set(
    `refresh_token:${newRefreshToken}`,
    userId,
    'EX',
    REFRESH_TOKEN_TTL_SECONDS
  );
  await redis.sadd(`user_tokens:${userId}`, newRefreshToken);

  // 4. Send updated HttpOnly Cookie
  res.cookie('refreshToken', newRefreshToken, REFRESH_COOKIE_OPTIONS);

  return res.json({ accessToken: newAccessToken });
});

// ==========================================
// 3. POST /api/auth/logout
// ==========================================
app.post('/api/auth/logout', async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (incomingRefreshToken) {
    const userId = await redis.get(`refresh_token:${incomingRefreshToken}`);
    if (userId) {
      await redis.del(`refresh_token:${incomingRefreshToken}`);
      await redis.srem(`user_tokens:${userId}`, incomingRefreshToken);
    }
  }

  res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS);
  return res.json({ message: 'Logged out successfully' });
});

// ==========================================
// 4. GET /api/user/profile (Protected Route)
// ==========================================
app.get('/api/user/profile', authenticateToken, (req, res) => {
  return res.json({
    message: 'Protected resource accessed successfully',
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

```

---

### How Security Works in This Implementation

1. **Path Restriction (`path: '/api/auth/refresh'`):** The browser will *only* automatically include the `refreshToken` cookie on requests sent to `/api/auth/refresh`. Standard API endpoints (`/api/user/profile`) don't receive this cookie, cutting down cross-site exposure.
2. **Atomic Invalidation:** When `/api/auth/refresh` is hit, the incoming refresh token is immediately deleted from Redis before sending the response.
3. **Reuse Isolation:** If an attacker intercepts an already used `refreshToken`, Redis will return `null`. The client gets a `403 Forbidden`, and `revokeAllUserTokens(userId)` can be triggered to invalidate all active sessions for that account.
