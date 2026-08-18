# Module Augmentation

Module augmentation lets you add new properties, methods, or types to an *existing* module's exported types — most commonly used to extend a third-party library's types with something your application needs that the library doesn't natively support.

## The canonical example: extending Express's Request

A very common real-world need: attaching custom data to an Express `Request` object (e.g., an authenticated user, set by middleware) and having that property show up as properly typed everywhere `Request` is used, without touching Express's own type definitions.

```typescript
// types/express-augmentation.d.ts
import "express";

declare module "express" {
  interface Request {
    user?: {
      id: string;
      roles: string[];
    };
  }
}
```

```typescript
// middleware/auth.ts
import { Request, Response, NextFunction } from "express";

function attachUser(req: Request, res: Response, next: NextFunction) {
  req.user = { id: "u1", roles: ["admin"] }; // no error — Request now has `user`
  next();
}
```

```typescript
// routes/profile.ts
import { Request, Response } from "express";

function getProfile(req: Request, res: Response) {
  if (req.user) {
    res.json({ id: req.user.id }); // fully typed, autocompletes `id` and `roles`
  }
}
```

## Why this works: declaration merging

`declare module "express" { interface Request { ... } }` doesn't replace Express's `Request` interface — it *merges* into it. TypeScript interfaces are open by design: declaring an interface with the same name more than once (whether in the same file or across files, as long as both are visible to the compiler) merges their members into a single interface. Module augmentation exploits this by targeting the module specifier string `"express"` directly, telling TypeScript "reopen this module's `Request` interface and add these members to it."

The `import "express";` line at the top (a side-effect-only import) is important: it ensures the file is treated as a module that's actually augmenting the real `"express"` module, rather than accidentally declaring a brand-new, unrelated global `declare module "express"` block that shadows the real one.

## General shape of module augmentation

```typescript
import "some-library";

declare module "some-library" {
  interface ExistingConfig {
    myCustomOption?: boolean;
  }
}
```

This pattern generalizes beyond Express: augmenting Vue's component instance type, adding custom matchers to Jest's `expect`, extending a state-management library's store type with app-specific slices — anywhere a library exposes an interface (not a type alias — type aliases can't be merged this way) that you need to extend without forking the library.

## Constraints

- Only works on **interfaces**, not `type` aliases — TypeScript's declaration merging is an interface-specific feature.
- The module being augmented must actually be imported somewhere the augmentation file is visible to, or the merge won't apply.
- Augmentation is global to your program once the `.d.ts` file is included — every file that imports `Request` from `"express"` sees the augmented shape, which is usually the desired behavior but is worth knowing (you can't scope an augmentation to just one file).
