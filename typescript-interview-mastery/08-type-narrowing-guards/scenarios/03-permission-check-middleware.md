# Modeling request-handling middleware where user context may or may not be present

You're writing Express-style middleware for an API. Some routes are public (no user context required), others require an authenticated user, and a few require a user with a specific role. The request object carries `user?: AuthenticatedUser`, and handlers for protected routes shouldn't have to repeat `if (!req.user) throw ...` boilerplate — but they also can't be allowed to silently assume `req.user` exists when TypeScript's types say it might not.

**Approach:** Write an assertion function that both validates and narrows in one call, used at the top of every protected handler, plus a separate type guard for the role check (a legitimate branch, not an exceptional case) — matching each situation to the narrowing tool suited to it.

```typescript
interface AuthenticatedUser {
  id: string;
  email: string;
  role: "member" | "admin";
}

interface Request {
  user?: AuthenticatedUser;
}

function assertAuthenticated(
  req: Request
): asserts req is Request & { user: AuthenticatedUser } {
  if (!req.user) {
    throw new Error("401: Authentication required");
  }
}

function isAdmin(user: AuthenticatedUser): boolean {
  return user.role === "admin";
}

function getProfile(req: Request): AuthenticatedUser {
  assertAuthenticated(req);
  return req.user; // req.user: AuthenticatedUser, no ?. needed, no manual check
}

function deleteAllUsers(req: Request): string {
  assertAuthenticated(req);
  if (!isAdmin(req.user)) {
    throw new Error("403: Admin role required");
  }
  return "all users deleted"; // only reachable for an authenticated admin
}
```

`assertAuthenticated` is the right tool for the "user context missing" case specifically because it's genuinely exceptional for a protected route — there's no meaningful "handle the unauthenticated case gracefully" branch inside `getProfile` itself; the correct behavior is to stop execution immediately, which is exactly what an assertion function is for. `isAdmin`, on the other hand, is a plain type guard (well, a boolean-returning check here, since `role` is a known field, not an unknown value needing validation) used inside a real `if`/`else`-shaped decision, because "not an admin" is an expected, legitimate outcome that the route needs to branch on (return 403) rather than something the type system needs to eliminate as impossible. Mixing these up — using an assertion for the role check, say — would make "not an admin" throw generically from deep inside shared logic rather than being handled explicitly where the route's authorization rule actually lives.
