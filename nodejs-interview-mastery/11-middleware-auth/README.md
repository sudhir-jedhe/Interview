# Middleware & Authentication

Authentication (who are you) and authorization (what are you allowed to do) are distinct concerns that are easy to conflate, and the mechanism you choose to prove identity on every request — server-side sessions or self-contained tokens like JWT — has real architectural trade-offs around statelessness, revocation, and where credentials can be stolen from. This topic covers both approaches in depth, the actual structure and security guarantees of a JWT, the refresh-token pattern for balancing short-lived access tokens with usable sessions, and password storage fundamentals (bcrypt, salting, why you never hand-roll this). It closes with how to build the Express middleware that ties it all together: verifying a token and attaching identity to `req`.

## Folder structure

```
11-middleware-auth/
  theory/          Core concepts, one focused file per topic
  snippets/         Standalone, runnable code snippets with explanations
  output-based/     "What does this code print/return?" questions with answers
  scenarios/         Real-world problem scenarios with worked approaches
  interview-qa/     Themed Q&A pairs for verbal interview prep
  problems/          Practice problems with full worked solutions
  projects/auth-demo/  A genuine small login / protected-route demo project
  assets/            Images/PDFs from original notes (placeholder)
```

## theory/
1. `01-authentication-vs-authorization.md` — The distinction, why ordering matters, 401 vs 403
2. `02-session-vs-token-auth.md` — Session-based auth vs JWT, statelessness trade-offs
3. `03-jwt-structure-and-storage.md` — header.payload.signature, decode vs verify, localStorage vs httpOnly cookie
4. `04-refresh-tokens.md` — Access vs refresh tokens, revoking a JWT early
5. `05-password-hashing.md` — bcrypt, salting, cost factor, why not to roll your own
6. `06-building-auth-middleware.md` — The Express JWT middleware pattern, layering authorization on top

## snippets/
Seven standalone code snippets: bcrypt password hashing, issuing access + refresh token pairs, JWT auth middleware, role-based authorization middleware, a token-refresh endpoint, session-based auth with `express-session`, and instant refresh-token revocation on logout.

## output-based/
Seven "what does this print?" questions covering `decode` vs `verify`, middleware ordering (authorize before authenticate), expired token handling, the `bcrypt.compare` async bug, session behavior across a server restart, `httpOnly` cookie inaccessibility to JS, and JWT algorithm-confusion attacks.

## scenarios/
Four real-world scenarios with worked approaches: stateless auth for a horizontally-scaled mobile backend, force-logging-out a compromised account before JWT expiry, incident response after a plaintext password breach, and choosing token storage for an SPA worried about both XSS and CSRF.

## interview-qa/
Eleven Q&A pairs grouped into three themed files: authentication/authorization fundamentals, sessions/JWT/refresh tokens, and password hashing.

## problems/
Three practice problems with full worked solutions: implementing JWT auth middleware from scratch with a hand-rolled HMAC sign/verify (no JWT library), building fixed-window rate-limiting middleware for a login route, and implementing role-based authorization middleware with a role hierarchy.

## projects/auth-demo/
A genuine small multi-file login / protected-route demo — real `app.js`, registration/login routes, bcrypt password hashing, JWT auth middleware, and role-based authorization. See its own README for how to run it.
