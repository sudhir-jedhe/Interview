# Problem: Model User/Admin with interfaces and demonstrate declaration merging

## Problem statement

Model a small domain: a base `User` interface, an `Admin` interface extending it with a `permissions` list. Then demonstrate declaration merging by splitting a third interface, `AuditLogEntry`, across two separate `interface` declarations that combine into one required shape, and write a function that only compiles once both declarations are present.

## Requirements

- `User`: `id: number`, `email: string`, `displayName: string`.
- `Admin extends User`: adds `permissions: string[]`.
- `AuditLogEntry` declared twice (declaration merging) — first declaration has `action: string`, `actorId: number`; second declaration adds `timestamp: Date`.
- A function `recordAudit(entry: AuditLogEntry): string` that uses fields from both declarations.
- Must compile under `strict: true`.

## Solution

```typescript
interface User {
  id: number;
  email: string;
  displayName: string;
}

interface Admin extends User {
  permissions: string[];
}

// --- Declaration merging demonstration ---
// First declaration, perhaps defined in one module:
interface AuditLogEntry {
  action: string;
  actorId: number;
}

// Second declaration, perhaps defined in another module augmenting the first:
interface AuditLogEntry {
  timestamp: Date;
}

// The merged AuditLogEntry now requires: action, actorId, AND timestamp.
function recordAudit(entry: AuditLogEntry): string {
  return `[${entry.timestamp.toISOString()}] actor #${entry.actorId} performed "${entry.action}"`;
}

const admin: Admin = {
  id: 1,
  email: "root@example.com",
  displayName: "Root Admin",
  permissions: ["users:write", "billing:read"],
};

const logLine = recordAudit({
  action: "grant_permission",
  actorId: admin.id,
  timestamp: new Date(),
});

console.log(logLine);
```

### Why this is the correct approach

`Admin extends User` demonstrates the standard layered-entity pattern: `Admin` structurally requires every `User` field plus its own, and any function accepting `User` will also accept an `Admin` value without a cast, thanks to structural typing. The `AuditLogEntry` split across two `interface` declarations shows declaration merging concretely — if only one of the two declarations existed, `recordAudit`'s body would fail to compile (either `entry.timestamp` or `entry.action`/`entry.actorId` would be missing from the type), but with both present, TypeScript treats them as one interface with the union of all members required. This is exactly the mechanism real codebases rely on to progressively augment a shared interface from multiple files/modules — most commonly seen extending ambient library types like `Express.Request` or `Window`.
