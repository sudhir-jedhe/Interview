# Snippet: Extending an interface

Shows `Admin` extending `User` with one additional required field.

```typescript
interface User {
  id: number;
  email: string;
}

interface Admin extends User {
  permissions: string[];
}

const admin: Admin = {
  id: 1,
  email: "root@example.com",
  permissions: ["users:write", "billing:read"],
};

console.log(`${admin.email} can: ${admin.permissions.join(", ")}`);
```
