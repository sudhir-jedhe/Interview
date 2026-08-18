# Problem 2: Module Augmentation to Add a Custom Property to Express's Request

## Task

Add a `requestId: string` property to Express's `Request` type, set by an early middleware for request tracing/logging purposes, so it's available with full type safety on every route handler without any `as any` casts. Requirements:

1. `requestId` should be required (not optional) from the perspective of route handlers running *after* the tracing middleware, but the middleware itself is what sets it.
2. Write the augmentation, the middleware that sets it, and a route handler that reads it.
3. Explain why `requestId` is typed as optional on `Request` itself even though handlers downstream of the middleware can rely on it always being set.

## Solution

```typescript
// types/express-augmentation.d.ts
import "express";

declare module "express" {
  interface Request {
    requestId?: string; // optional at the Request level — see explanation below
  }
}
```

```typescript
// middleware/requestId.ts
import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export function attachRequestId(req: Request, res: Response, next: NextFunction): void {
  req.requestId = randomUUID();
  res.setHeader("X-Request-Id", req.requestId);
  next();
}
```

```typescript
// routes/health.ts
import { Request, Response } from "express";

export function healthCheck(req: Request, res: Response): void {
  console.log(`[${req.requestId ?? "unknown"}] health check hit`); // handles the optional case
  res.json({ status: "ok" });
}
```

## Why `requestId` stays optional on `Request` itself

`Request` describes *every* possible incoming request object across the whole application, including any request that, for whatever reason, never passed through `attachRequestId` (a misconfigured route, a test harness constructing a bare `Request`-shaped object, or middleware ordering changing in the future). If `requestId` were declared as required (`requestId: string`, no `?`), it would be a lie at the type level for any code path that doesn't guarantee the middleware ran first — and TypeScript has no way to verify middleware ordering at the type level, since middleware registration happens at runtime via ordinary function calls, not something the compiler tracks.

The correct, honest approach is what's shown above: keep `requestId` optional on the shared `Request` type, and have each handler that truly depends on it present either narrow with a runtime check (`req.requestId ?? "unknown"`, or throwing if missing) or, for stronger guarantees, define a narrower type (e.g., `interface RequestWithId extends Request { requestId: string }`) and have `attachRequestId`'s calling convention (or a dedicated type-narrowing middleware wrapper) enforce that only handlers expecting to run after it accept that narrower type — pushing the "was this middleware guaranteed to run" concern to route wiring rather than pretending the type system can verify it globally.
