# Problem 1: Derive a Public Profile Type with Pick and Omit

## Task

Given the full `User` type below, which contains sensitive fields, derive a `PublicProfile` type suitable for returning from a "view another user's profile" API endpoint. Then write the conversion function.

```typescript
interface User {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  email: string;
  passwordHash: string;
  twoFactorEnabled: boolean;
  isAdmin: boolean;
  createdAt: Date;
}
```

Requirements:
1. `PublicProfile` must include `id`, `username`, `displayName`, `bio`, `avatarUrl`, and `createdAt`.
2. `PublicProfile` must NOT include `email`, `passwordHash`, `twoFactorEnabled`, or `isAdmin`.
3. Write `toPublicProfile(user: User): PublicProfile` that performs the conversion.
4. Do it two ways: once using `Pick`, once using `Omit` — and note which one you'd actually ship and why.

## Solution

```typescript
// Approach A: Pick (explicit allowlist)
type PublicProfilePick = Pick<User, "id" | "username" | "displayName" | "bio" | "avatarUrl" | "createdAt">;

// Approach B: Omit (explicit blocklist)
type PublicProfileOmit = Omit<User, "email" | "passwordHash" | "twoFactorEnabled" | "isAdmin">;

function toPublicProfile(user: User): PublicProfilePick {
  const { id, username, displayName, bio, avatarUrl, createdAt } = user;
  return { id, username, displayName, bio, avatarUrl, createdAt };
}
```

**Which to ship:** `Pick` (Approach A). Sensitive-data boundaries should default to "expose nothing unless explicitly listed." With `Omit`, if a future teammate adds `phoneNumber: string` to `User`, it silently becomes public unless they remember to also add it to the `Omit` list — an easy mistake with real security consequences. With `Pick`, the same new field simply doesn't appear on `PublicProfile` until someone deliberately adds it, which is the safer failure mode.

A useful follow-up exercise: write a type-level assertion that fails to compile if `PublicProfilePick` and `PublicProfileOmit` ever diverge, to catch the moment someone updates one derivation but not the other:

```typescript
type _AssertSameShape = PublicProfilePick extends PublicProfileOmit
  ? PublicProfileOmit extends PublicProfilePick
    ? true
    : never
  : never;
const _check: _AssertSameShape = true; // fails to compile if the two shapes diverge
```
