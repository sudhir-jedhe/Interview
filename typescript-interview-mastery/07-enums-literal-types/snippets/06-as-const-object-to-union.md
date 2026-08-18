# Deriving a union type from an as-const object's values

```typescript
// Object gives named access (PERMISSIONS.READ); type derives from its values
const PERMISSIONS = {
  READ: "read",
  WRITE: "write",
  ADMIN: "admin",
} as const;

type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
// "read" | "write" | "admin"

function hasPermission(p: Permission): boolean {
  return p === PERMISSIONS.ADMIN;
}

console.log(hasPermission(PERMISSIONS.WRITE)); // false
```
