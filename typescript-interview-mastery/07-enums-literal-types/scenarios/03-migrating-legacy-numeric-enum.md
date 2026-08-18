# Migrating a legacy numeric enum without breaking stored data

Your team inherited a codebase where `UserRole` is a numeric enum, and `role: number` values are already stored in a production database (`0` for `Guest`, `1` for `Member`, `2` for `Admin`). A new engineer wants to add a `Moderator` role and, having just learned about the reverse-mapping bug, wants to switch straight to a literal union — but the existing numeric data can't simply be reinterpreted as strings without a migration.

**Approach:** Separate the *storage representation* (still numbers, for backward compatibility with existing rows) from the *application-facing type* (a literal union, for safety and ergonomics going forward), and write one explicit, tested mapping layer at the boundary — rather than either leaving the numeric enum in place everywhere, or attempting an unsafe direct swap that would silently misinterpret old data.

```typescript
// The old, still-necessary storage shape — kept minimal and isolated
type StoredRole = 0 | 1 | 2 | 3; // 3 reserved for the new Moderator role

// The new application-facing type used everywhere else in the codebase
type UserRole = "guest" | "member" | "admin" | "moderator";

const ROLE_FROM_STORAGE: Record<StoredRole, UserRole> = {
  0: "guest",
  1: "member",
  2: "admin",
  3: "moderator",
};

const ROLE_TO_STORAGE: Record<UserRole, StoredRole> = {
  guest: 0,
  member: 1,
  admin: 2,
  moderator: 3,
};

function loadUserRole(raw: number): UserRole {
  if (!(raw in ROLE_FROM_STORAGE)) {
    throw new Error(`Unknown stored role value: ${raw}`);
  }
  return ROLE_FROM_STORAGE[raw as StoredRole];
}

function saveUserRole(role: UserRole): number {
  return ROLE_TO_STORAGE[role];
}

console.log(loadUserRole(2));        // "admin"
console.log(saveUserRole("moderator")); // 3
```

Both `Record` mappings are exhaustive over their respective union types, so the same "compiler forces you to update the map" safety net from the label-map pattern applies here too — adding a fifth role to `UserRole` without updating `ROLE_TO_STORAGE` fails to compile, and forgetting a `StoredRole` value in `ROLE_FROM_STORAGE` fails to compile as well. The rest of the application — everything except this one file — only ever sees `UserRole` as a literal union, getting all the benefits described earlier (readable values in logs, no reverse-mapping surprises, easy composition with other unions) while the numeric storage format keeps working unmodified for every row already in the database. `loadUserRole`'s runtime `in` check exists because `raw: number` is untyped/external input (from a database driver, not from TypeScript's own type system), so unlike the enum-internal-to-enum-internal conversions, this boundary genuinely needs a runtime guard, not just a type-level one.
