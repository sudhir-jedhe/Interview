Access Token vs Refresh Token
If a JWT proves that you're authenticated, why do modern applications use two tokens instead of one?

The answer is security.

Let's understand it.
Imagine you check into a hotel.

At reception, you're given:

* A room key card.
* Your identity proof remains with you.

The room key lets you enter your room, but if you lose it, the hotel can deactivate it and issue a new one.

Modern authentication works in a similar way.

Access Token

An Access Token is your temporary identity card.

Every time your application calls a protected API, it sends the Access Token.

Authorization: Bearer <Access Token>

The server verifies the token and, if it's valid, allows the request.

Access Tokens are intentionally short-lived.

Most applications keep them valid for only a few minutes to a few hours.

Why?
Because if an attacker steals an Access Token, they can only misuse it for a limited time.

Refresh Token
Now imagine you're still staying at the hotel after your room key expires.

Instead of going through the entire check-in process again, you visit reception and receive a new room key.

That's exactly what a Refresh Token does.

When your Access Token expires:

* The application sends the Refresh Token to the authentication server.
* The server verifies it.
* If it's valid, the server issues a brand-new Access Token.
* The user continues working without logging in again.

This creates a much smoother user experience.

Why not use a Refresh Token for every request?

Because Refresh Tokens are much more powerful.

If someone steals a Refresh Token, they can continue generating new Access Tokens.

That's why Refresh Tokens should never be sent with every API request.

Instead, they're stored securely and used only when the Access Token expires.

Best practices

* Keep Access Tokens short-lived.
* Rotate Refresh Tokens whenever possible.
* Store Refresh Tokens securely.
* Revoke Refresh Tokens when a user logs out or changes their password.
* Always use HTTPS to protect tokens during transmission.

Key takeaway
Think of it this way:
Access Token = Your temporary room key.
Refresh Token = Reception's authority to issue a new room key.
One is used frequently.
The other is used sparingly and protected much more carefully.

Here is a recreated, highly structured, and visually engaging breakdown of **Access Token vs. Refresh Token**.

---

# Access Token vs. Refresh Token 🔑

If a JWT proves that you're authenticated, why do modern applications use **two tokens** instead of just one?

The answer comes down to a fundamental trade-off: **Security vs. User Experience**.

---

### The Hotel Analogy 🏨

Imagine checking into a hotel:

* **Access Token = Your Room Key Card:** You swipe it frequently to enter your room or access the gym. If you drop it in the hallway, it expires quickly so a stranger can't use it for long.
* **Refresh Token = Your ID / Booking Confirmation:** You keep this stored safely in your wallet. You only show it at reception when your key card expires so they can issue you a fresh one—without making you register from scratch.

---

### 1. The Access Token (The Temporary Key)

The **Access Token** is sent with **every API request** to access protected routes.

```http
GET /api/user/profile
Authorization: Bearer <Access_Token>

```

* **Purpose:** Grants immediate, stateless authorization to backend resources.
* **Lifespan:** Intentionally **short-lived** (e.g., 5 to 15 minutes).
* **Storage Location:** Kept in memory (application state) or an `HttpOnly` cookie.
* **Why keep it short-lived?** If an attacker intercepts or steals an Access Token via an XSS vulnerability, the blast radius is strictly limited to a few minutes before the token becomes useless.

---

### 2. The Refresh Token (The Authority Key)

The **Refresh Token** is used **only** when the current Access Token expires.

```text
 Client                                                Auth Server
   │                                                        │
   │─── 1. POST /auth/refresh (Sends Refresh Token) ───────►│
   │                                                        │
   │◄── 2. Returns New Access Token + New Refresh Token ────│

```

* **Purpose:** Obtains a new Access Token without forcing the user to type their username and password again.
* **Lifespan:** **Long-lived** (e.g., 7 days, 30 days, or several months).
* **Storage Location:** Stored with maximum security—typically inside a secure, `HttpOnly`, `SameSite=Strict` cookie, or encrypted mobile storage (iOS Keychain / Android Keystore).
* **Why not send it with every request?** Because a Refresh Token has long-term power. Minimizing its network exposure drastically reduces the chance of interception.

---

### Comparison Matrix

| Feature                    | Access Token                       | Refresh Token                              |
| -------------------------- | ---------------------------------- | ------------------------------------------ |
| **Primary Role**           | Accesses protected resources/APIs  | Generates new Access Tokens                |
| **Transmission Frequency** | Sent with **every** HTTP request   | Sent **only** when renewing expired access |
| **Lifespan**               | Very Short (5 – 15 minutes)        | Long (Days to Months)                      |
| **Stored Where**           | In-Memory (State) or Cookie        | Secure `HttpOnly` Cookie / OS Keyring      |
| **Database Lookup**        | Stateless (Verified via Signature) | Stateful (Checked/Revoked in DB/Redis)     |

---

### Production Best Practices 🛡️

1. **Implement Refresh Token Rotation (RTR):** Every time a Refresh Token is used, invalidate it and issue a *new* Refresh Token alongside the new Access Token. If an old Refresh Token is re-used, revoke the entire token family immediately—this signals a potential token theft attempt!
2. **Revocation & Logout:** Maintain a blacklist or token family state in Redis so that when a user clicks "Logout" or changes their password, all active Refresh Tokens are revoked immediately.
3. **Strict HTTPS:** Always enforce TLS 1.3 across all endpoints to ensure tokens can never be sniffed over public Wi-Fi networks.

---

### Key Takeaway

> **Access Token** = Used **frequently**, carries **low trust**, and expires **quickly**.
> **Refresh Token** = Used **sparingly**, carries **high trust**, and is protected **strictly**.

Here is a complete, production-ready **JWT Authentication & Refresh Token Rotation (RTR)** implementation using **Express.js**, **TypeScript**, **Mongoose**, and **Redis** (for instant token revocation).

---

### Key Production Features Included

1. **Refresh Token Rotation (RTR):** Every refresh request invalidates the used refresh token and issues a new pair.
2. **Reuse Detection & Automatic Revocation:** If a previously used refresh token is presented (indicating a stolen token replay attack), the entire token family for that user is immediately revoked from Redis.
3. **`HttpOnly` Cookie Storage:** Refresh tokens are stored in `HttpOnly`, `Secure`, `SameSite` cookies to protect against XSS exfiltration.
4. **Strong Typing:** Express `Request` interface is extended to include strongly-typed `req.user`.

---

### Folder Structure

```text
src/
├── config/
│   ├── env.ts
│   └── redis.ts
├── middleware/
│   └── auth.middleware.ts
├── models/
│   └── user.model.ts
├── services/
│   └── token.service.ts
├── controllers/
│   └── auth.controller.ts
├── routes/
│   └── auth.routes.ts
└── types/
    └── express.d.ts

```

---

### 1. Express Type Declarations (`src/types/express.d.ts`)

```typescript
import { JwtPayload } from '../services/token.service';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

```

---

### 2. Token Service (`src/services/token.service.ts`)

```typescript
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { redisClient } from '../config/redis';

export interface JwtPayload {
  userId: string;
  role: string;
  tokenId?: string; // Unique identifier for refresh token
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'super-access-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'super-refresh-secret';

const ACCESS_TOKEN_EXP = '15m'; // Short-lived access token
const REFRESH_TOKEN_EXP_SECONDS = 7 * 24 * 60 * 60; // 7 Days in seconds

export class TokenService {
  // Generate Access Token (15 Minutes)
  static generateAccessToken(payload: Omit<JwtPayload, 'tokenId'>): string {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXP });
  }

  // Generate Refresh Token and store metadata in Redis (7 Days)
  static async generateRefreshToken(userId: string, role: string): Promise<string> {
    const tokenId = uuidv4();
    const token = jwt.sign({ userId, role, tokenId }, REFRESH_TOKEN_SECRET, {
      expiresIn: `${REFRESH_TOKEN_EXP_SECONDS}s`,
    });

    // Store token validity in Redis: key = user:refresh:<userId>:<tokenId>
    const redisKey = `user:refresh:${userId}:${tokenId}`;
    await redisClient.set(redisKey, 'valid', { EX: REFRESH_TOKEN_EXP_SECONDS });

    return token;
  }

  // Verify Access Token
  static verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
  }

  // Verify Refresh Token with Rotation & Reuse Detection
  static async rotateRefreshToken(oldRefreshToken: string): Promise<{ newAccessToken: string; newRefreshToken: string }> {
    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(oldRefreshToken, REFRESH_TOKEN_SECRET) as JwtPayload;
    } catch (err) {
      throw new Error('UNAUTHORIZED: Invalid or expired refresh token');
    }

    const { userId, role, tokenId } = decoded;
    if (!tokenId) throw new Error('UNAUTHORIZED: Malformed refresh token');

    const redisKey = `user:refresh:${userId}:${tokenId}`;
    const tokenStatus = await redisClient.get(redisKey);

    // REUSE DETECTION / REPLAY ATTACK SAFEGUARD
    if (!tokenStatus) {
      // Token was either already used/deleted or never existed!
      // Revoke ALL active refresh tokens for this user family to contain breach
      await this.revokeAllUserTokens(userId);
      throw new Error('SECURITY_ALERT: Refresh token reuse detected! All active sessions revoked.');
    }

    // Step 1: Invalidate the used refresh token immediately
    await redisClient.del(redisKey);

    // Step 2: Issue fresh token pair
    const newAccessToken = this.generateAccessToken({ userId, role });
    const newRefreshToken = await this.generateRefreshToken(userId, role);

    return { newAccessToken, newRefreshToken };
  }

  // Revoke all tokens for a user (e.g. on reuse detection or full logout)
  static async revokeAllUserTokens(userId: string): Promise<void> {
    const keys = await redisClient.keys(`user:refresh:${userId}:*`);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  }

  // Revoke a single token (standard logout)
  static async revokeSingleToken(refreshToken: string): Promise<void> {
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as JwtPayload;
      if (decoded.tokenId) {
        await redisClient.del(`user:refresh:${decoded.userId}:${decoded.tokenId}`);
      }
    } catch {
      // Token already invalid or expired
    }
  }
}

```

---

### 3. Authentication Middleware (`src/middleware/auth.middleware.ts`)

```typescript
import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/token.service';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required: No bearer token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = TokenService.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired access token', code: 'TOKEN_EXPIRED' });
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden: Insufficient permissions' });
    }
    next();
  };
};

```

---

### 4. Auth Controller (`src/controllers/auth.controller.ts`)

```typescript
import { Request, Response } from 'express';
import { TokenService } from '../services/token.service';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
};

export class AuthController {
  // Login Handler
  static async login(req: Request, res: Response) {
    // ... Validate user credentials from database ...
    const mockUser = { _id: 'usr_102030', role: 'admin' }; // Example user

    const accessToken = TokenService.generateAccessToken({
      userId: mockUser._id,
      role: mockUser.role,
    });

    const refreshToken = await TokenService.generateRefreshToken(mockUser._id, mockUser.role);

    // Attach Refresh Token as HttpOnly Cookie
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    return res.json({
      accessToken,
      user: { id: mockUser._id, role: mockUser.role },
    });
  }

  // Refresh Token Rotation Handler
  static async refresh(req: Request, res: Response) {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      return res.status(401).json({ message: 'Refresh token cookie missing' });
    }

    try {
      const { newAccessToken, newRefreshToken } = await TokenService.rotateRefreshToken(oldRefreshToken);

      // Set rotated refresh token in HttpOnly cookie
      res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);

      return res.json({ accessToken: newAccessToken });
    } catch (error: any) {
      // Clear cookie if rotation failed or token reuse detected
      res.clearCookie('refreshToken', COOKIE_OPTIONS);
      return res.status(401).json({ message: error.message || 'Token refresh failed' });
    }
  }

  // Logout Handler
  static async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await TokenService.revokeSingleToken(refreshToken);
    }

    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    return res.json({ message: 'Logged out successfully' });
  }
}

```

---

### 5. Express Routes (`src/routes/auth.routes.ts`)

```typescript
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public Routes
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);

// Protected Routes
router.get('/profile', authenticate, (req, res) => {
  res.json({ message: 'Access granted to profile', user: req.user });
});

router.get('/admin-dashboard', authenticate, authorize('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

export default router;

```

---

### Client Integration Pattern (Axios Interceptor)

On the React/Frontend side, use an Axios interceptor to catch `401` errors and silently request a new access token using the HttpOnly cookie:

```typescript
import axios from 'axios';

const api = axios.create({ baseURL: 'https://api.yourdomain.com' });

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Send refresh request (Cookie automatically included via withCredentials)
        const res = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        const { accessToken } = res.data;

        // Attach new token to original request and retry
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Redirect user to login page
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

```
