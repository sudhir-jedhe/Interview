# Scenario: Modeling a User/Admin domain with layered access

You're building an internal admin tool. There's a base `User` shape shared by every account, and `Admin` accounts need extra fields (permissions list) without duplicating the base fields. You also need to augment a third-party auth library's `Session` interface to carry your own `currentUser` field, without modifying that library's source.

**Approach:** Use `interface extends` for the layered domain hierarchy (it's the natural fit for "is-a" relationships with clear, eagerly-checked field compatibility), and use declaration merging to augment the third-party interface.

```typescript
interface User {
  id: number;
  email: string;
  displayName: string;
}

interface Admin extends User {
  permissions: string[];
  canImpersonate: boolean;
}

function describeAccount(user: User): string {
  return `${user.displayName} <${user.email}>`;
}

const admin: Admin = {
  id: 1,
  email: "root@example.com",
  displayName: "Root Admin",
  permissions: ["users:write", "billing:read"],
  canImpersonate: true,
};

console.log(describeAccount(admin)); // structurally satisfies User — no cast needed

// --- Declaration merging: augmenting a third-party interface ---
// Imagine this interface ships from an `auth-lib` package:
interface Session {
  token: string;
  expiresAt: Date;
}

// Your app augments it in its own module, without touching auth-lib's source:
interface Session {
  currentUser?: User;
}

function requireUser(session: Session): User {
  if (!session.currentUser) {
    throw new Error("Session has no authenticated user");
  }
  return session.currentUser;
}

const session: Session = {
  token: "abc123",
  expiresAt: new Date(Date.now() + 3600_000),
  currentUser: admin,
};

console.log(requireUser(session).displayName);
```

The merged `Session` interface now requires call sites to account for both the library-defined fields (`token`, `expiresAt`) and your app-specific addition (`currentUser`), all through a single interface name — exactly the pattern used in real codebases to extend `Express.Request`, `Window`, or other library/ambient globals with app-specific fields, without forking the library's type definitions.
