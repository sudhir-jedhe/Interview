# Scenario: Attaching an Authenticated User to Express's Request

Your Node/Express API has an authentication middleware that decodes a JWT and needs to attach the resulting user data to `req` for every downstream route handler to read. Express's own `Request` type has no `user` field, and you don't want every handler casting `req as any` to access it.

```typescript
// Runtime shape you want available on every authenticated request:
interface AuthenticatedUser {
  id: string;
  email: string;
  roles: string[];
}
```

**Approach:** Use module augmentation to add a `user` property directly to Express's `Request` interface, in a `.d.ts` file included in the project's compilation, so every file that imports `Request` from `"express"` — middleware and route handlers alike — sees the augmented type automatically.

```typescript
// types/express-augmentation.d.ts
import "express"; // side-effect import — required so this augments, not redeclares

declare module "express" {
  interface Request {
    user?: {
      id: string;
      email: string;
      roles: string[];
    };
  }
}
```

```typescript
// middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "Missing token" });
    return;
  }
  const payload = verifyToken(token); // { id, email, roles }
  req.user = payload; // compiles — Request now has `user`
  next();
}
```

```typescript
// routes/orders.ts
import { Request, Response } from "express";
import { requireAuth } from "../middleware/auth";

export function listOrders(req: Request, res: Response): void {
  if (!req.user) {
    res.status(401).json({ error: "Unauthenticated" });
    return;
  }
  res.json({ orders: [], requestedBy: req.user.id }); // fully typed, no cast needed
}
```

The `user` property is deliberately optional (`user?:`) rather than required, since `Request` describes *every* incoming request, not just ones that have passed through `requireAuth` — a route with no auth middleware genuinely has `req.user === undefined`. Route handlers that require authentication still need a runtime `if (!req.user)` check (as above) — the augmentation gives you accurate typing and autocomplete for `req.user`, but it doesn't retroactively guarantee at compile time that `requireAuth` actually ran before a given handler; that ordering guarantee lives in how routes are wired up, not in the type system.
