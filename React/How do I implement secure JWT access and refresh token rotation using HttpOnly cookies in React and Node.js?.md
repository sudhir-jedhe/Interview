Implementing secure JWT authentication with **Refresh Token Rotation (RTR)** requires a split-token architecture:

* **Access Token (Short-lived, ~10–15 min):** Kept exclusively in JavaScript memory (React state/closure) to prevent Cross-Site Scripting (XSS) extraction.
* **Refresh Token (Long-lived, ~7–30 days):** Stored in a strict `HttpOnly`, `Secure`, `SameSite` cookie, scoped strictly to the `/api/auth/refresh` endpoint.
* **Rotation & Reuse Detection:** Every time the refresh endpoint is hit, the current refresh token is invalidated and replaced with a new one. If an invalidated/old token is presented again (indicating token theft), all refresh tokens belonging to that user family are revoked immediately.

---

### Architecture Overview

```
React Client                                Node.js API (Fastify / Express)
     │                                                     │
     │ ── 1. POST /api/auth/login ───────────────────────► │
     │ ◄── 2. AccessToken (in JSON) + Set-Cookie (Refresh) ─ │
     │                                                     │
     │ ── 3. GET /api/protected (Bearer AccessToken) ────► │
     │ ◄── 4. 401 Unauthorized (Token Expired) ─────────── │
     │                                                     │
     │ ── 5. POST /api/auth/refresh (Cookie sent by browser) ──►
     │       (Rotates token in DB & detects token reuse)   │
     │ ◄── 6. New AccessToken + Set-Cookie (New Refresh) ── │
     │                                                     │
     │ ── 7. Retry Original Request with New AccessToken ─► │

```

---

### 1. Backend: Database Schema & Token Helpers

Store active refresh tokens in your database (e.g., PostgreSQL or Redis) to track families and handle invalidation.

```sql
-- PostgreSQL Token Store Table
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(64) NOT NULL,
    token_hash VARCHAR(128) NOT NULL,
    family_id UUID NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_refresh_token_lookup ON refresh_tokens (user_id, token_hash);

```

#### Token Utilities (`authUtils.ts`)

```typescript
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret_123';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret_123';

export interface TokenPayload {
  userId: string;
  role: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(payload: TokenPayload, familyId: string): string {
  return jwt.sign({ ...payload, familyId }, REFRESH_SECRET, { expiresIn: '7d' });
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

```

---

### 2. Backend: Fastify/Express Auth Controller & Token Rotation

```typescript
// authController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { generateAccessToken, generateRefreshToken, hashToken, TokenPayload } from './authUtils';

// Mock DB adapter (Replace with Prisma / Drizzle / TypeORM)
import { db } from './db';

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret_123';
const isProd = process.env.NODE_ENV === 'production';

export async function loginHandler(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as any;
  
  // 1. Authenticate user credentials...
  const user = await db.users.findUnique({ where: { email } });
  // Verify password hash...

  const tokenPayload: TokenPayload = { userId: user.id, role: user.role };
  const familyId = crypto.randomUUID();

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload, familyId);

  // 2. Persist hashed refresh token
  await db.refreshTokens.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      familyId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // 3. Set HttpOnly Cookie (Scoped strictly to refresh path)
  reply.setCookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: '/api/auth/refresh',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });

  // 4. Return Access Token in response body ONLY
  return reply.send({ accessToken, user: { id: user.id, email: user.email } });
}

export async function refreshHandler(request: FastifyRequest, reply: FastifyReply) {
  const incomingRefreshToken = request.cookies.refreshToken;

  if (!incomingRefreshToken) {
    return reply.status(401).send({ error: 'No refresh token provided' });
  }

  try {
    const decoded = jwt.verify(incomingRefreshToken, REFRESH_SECRET) as TokenPayload & {
      familyId: string;
    };

    const tokenHash = hashToken(incomingRefreshToken);
    const existingTokenRecord = await db.refreshTokens.findFirst({
      where: { tokenHash, userId: decoded.userId },
    });

    // ── REUSE DETECTION ──
    // If token not found or already revoked, an attacker or compromised client replayed it!
    if (!existingTokenRecord || existingTokenRecord.isRevoked) {
      // Invalidate the entire token family immediately
      await db.refreshTokens.updateMany({
        where: { familyId: decoded.familyId },
        data: { isRevoked: true },
      });

      reply.clearCookie('refreshToken', { path: '/api/auth/refresh' });
      return reply.status(403).send({ error: 'Compromised token detected. Please log in again.' });
    }

    // ── ROTATION ──
    // 1. Invalidate the used refresh token
    await db.refreshTokens.update({
      where: { id: existingTokenRecord.id },
      data: { isRevoked: true },
    });

    // 2. Generate new pair maintaining the same familyId
    const newPayload: TokenPayload = { userId: decoded.userId, role: decoded.role };
    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload, decoded.familyId);

    // 3. Store new token
    await db.refreshTokens.create({
      data: {
        userId: decoded.userId,
        tokenHash: hashToken(newRefreshToken),
        familyId: decoded.familyId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // 4. Set updated HttpOnly Cookie
    reply.setCookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60,
    });

    return reply.send({ accessToken: newAccessToken });
  } catch (err) {
    reply.clearCookie('refreshToken', { path: '/api/auth/refresh' });
    return reply.status(401).send({ error: 'Invalid or expired refresh token' });
  }
}

export async function logoutHandler(request: FastifyRequest, reply: FastifyReply) {
  const incomingRefreshToken = request.cookies.refreshToken;
  if (incomingRefreshToken) {
    const tokenHash = hashToken(incomingRefreshToken);
    await db.refreshTokens.updateMany({
      where: { tokenHash },
      data: { isRevoked: true },
    });
  }

  reply.clearCookie('refreshToken', { path: '/api/auth/refresh' });
  return reply.send({ message: 'Logged out successfully' });
}

```

---

### 3. Frontend: In-Memory Token Management & Axios Interceptor

In React, the access token is stored **only in memory** (module-scoped variable or React State), never in `localStorage` or `sessionStorage`.

An Axios interceptor catches `401 Unauthorized` responses and queues concurrent requests while a single refresh operation runs in flight.

```typescript
// src/api/apiClient.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

let inMemoryAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = () => inMemoryAccessToken;

export const api = axios.create({
  baseURL: 'https://api.example.com',
  headers: { 'Content-Type': 'application/json' },
});

// Attach in-memory token to outgoing requests
api.interceptors.request.use((config) => {
  if (inMemoryAccessToken && config.headers) {
    config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
  }
  return config;
});

// Mutex / Queue state for handling simultaneous 401s
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor for Silent Refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is not 401 or request has already been retried once, pass through
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // If a refresh is already in flight, queue this request until it finishes
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Call refresh endpoint with credentials: 'include' (sends HttpOnly cookie)
      const res = await axios.post(
        'https://api.example.com/api/auth/refresh',
        {},
        { withCredentials: true }
      );

      const newAccessToken = res.data.accessToken;
      setAccessToken(newAccessToken);

      processQueue(null, newAccessToken);

      // Re-run the failed request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      setAccessToken(null);
      
      // Dispatch logout event or redirect to login
      window.dispatchEvent(new Event('auth:session-expired'));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

```

---

### 4. React Context Provider for Silent Initial Authentication

When the user refreshes the page (`F5`), the in-memory access token is lost. The `AuthProvider` executes a silent refresh during initial app mount before rendering protected routes.

```tsx
// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { setAccessToken, getAccessToken } from '../api/apiClient';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Silent refresh on initial app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await axios.post(
          'https://api.example.com/api/auth/refresh',
          {},
          { withCredentials: true }
        );
        setAccessToken(res.data.accessToken);
        // Optionally decode user claims or fetch /api/users/me
        setUser({ authenticated: true });
      } catch (err) {
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();

    // Listen for session expiry from API interceptor
    const handleExpired = () => {
      setUser(null);
      setAccessToken(null);
    };
    window.addEventListener('auth:session-expired', handleExpired);
    return () => window.removeEventListener('auth:session-expired', handleExpired);
  }, []);

  const login = async (credentials: any) => {
    const res = await axios.post('https://api.example.com/api/auth/login', credentials, {
      withCredentials: true,
    });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const logout = async () => {
    await axios.post('https://api.example.com/api/auth/logout', {}, { withCredentials: true });
    setAccessToken(null);
    setUser(null);
  };

  if (isInitializing) {
    return <div className="loading-screen">Authenticating session...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

```

---

### Security Guardrails Checklist

* **Path Scoping (`Path=/api/auth/refresh`):** Restricts the browser from transmitting the heavy refresh token on standard API requests (`/api/orders`, `/api/profile`), preventing unnecessary cookie exposure and saving bandwidth.
* **Hash Tokens Before Storage:** Always store `SHA-256` hashes of refresh tokens in the database. If your database leaks or is dumped via SQL injection, active session tokens cannot be extracted.
* **Family ID Tracking for Rapid Revocation:** If an attacker steals a refresh token and uses it, the legitimate user will eventually attempt to use the same token. The backend detects this duplicate use, flags the `familyId`, and immediately revokes all descendant tokens in that session family.
