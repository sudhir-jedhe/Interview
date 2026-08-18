```typescript
interface Admin {
  role: "admin";
  permissions: string[];
}

function isAdmin(user: unknown): user is Admin {
  return typeof user === "object" && user !== null;
}

function grantAccess(user: unknown): void {
  if (isAdmin(user)) {
    console.log(user.permissions.join(", "));
  }
}

grantAccess({ role: "guest" });
```

Does this compile? What happens at runtime?

**Answer:** It compiles cleanly — there's no type error anywhere. At runtime, it throws: `TypeError: Cannot read properties of undefined (reading 'join')`.

**Why:** `isAdmin`'s type predicate claims `user is Admin`, but its actual implementation only checks `typeof user === "object" && user !== null` — it never verifies `role === "admin"` or that `permissions` exists and is an array. TypeScript does not check that a type guard's runtime logic actually matches what its predicate promises; it simply trusts the annotation. So `grantAccess({ role: "guest" })` passes the (too-permissive) `isAdmin` check, `user` gets narrowed to `Admin` inside the `if`, and `user.permissions.join(", ")` type-checks fine — but at runtime, `{ role: "guest" }` has no `permissions` property, so `user.permissions` is `undefined`, and calling `.join` on it crashes. This is the central risk of hand-written type guards: a predicate that's too loose (or simply wrong) produces code that looks fully type-safe while still crashing in production, and it's why guard implementations validating external/unknown data deserve the same scrutiny and test coverage as any other business-critical logic — the compiler will not catch a mismatch here.
