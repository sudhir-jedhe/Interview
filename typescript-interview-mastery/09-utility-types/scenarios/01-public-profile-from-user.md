# Scenario: Deriving a Public Profile Type from a Full User Type

You have a `User` type used internally across the backend that includes sensitive fields (password hash, internal flags, billing info). You need a `PublicProfile` type safe to serialize and send to the frontend when someone views another user's profile.

```typescript
interface User {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  email: string;
  passwordHash: string;
  isAdmin: boolean;
  billingCustomerId: string;
  lastLoginIp: string;
}
```

**Approach:** Use `Pick` rather than `Omit` here, deliberately. `Omit` would leak any new sensitive field added to `User` in the future unless someone remembers to add it to the exclusion list; `Pick` forces an explicit allowlist, so a new sensitive field (say, `twoFactorSecret`) simply doesn't appear on `PublicProfile` without anyone touching this file. For a security-sensitive boundary like "what do we expose to other users," allowlisting is the safer default.

```typescript
type PublicProfile = Pick<User, "id" | "username" | "displayName" | "bio" | "avatarUrl">;

function toPublicProfile(user: User): PublicProfile {
  const { id, username, displayName, bio, avatarUrl } = user;
  return { id, username, displayName, bio, avatarUrl };
}

// Usage at an API boundary
function getProfileHandler(user: User): PublicProfile {
  return toPublicProfile(user);
}
```

If a teammate later adds `phoneNumber: string` to `User`, `PublicProfile` and `toPublicProfile` compile unchanged and `phoneNumber` stays private by default — they have to make an active decision to add it to the `Pick` list, which is exactly the kind of friction you want around exposing new personal data.

A secondary safeguard: write a compile-time assertion that `PublicProfile` never accidentally picks up a sensitive key, by intersecting with `Exclude`:

```typescript
type SensitiveKey = "email" | "passwordHash" | "isAdmin" | "billingCustomerId" | "lastLoginIp";

// If this line fails to compile, PublicProfile has leaked a sensitive field.
type _Check = Exclude<keyof PublicProfile, SensitiveKey> extends keyof PublicProfile ? true : never;
```

This kind of "type-level test" costs nothing at runtime and catches leaks the moment someone edits the `Pick` list carelessly.
